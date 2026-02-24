const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const nodemailer = require("nodemailer");

const app = express();
const prisma = new PrismaClient();

// Admin auth middleware
const adminAuth = (req, res, next) => {
  const adminToken = req.headers["x-admin-token"];
  if (adminToken !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.length === 0) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  }),
);
app.use(express.json());

//request logger
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.url}`,
    Object.keys(req.body || {}).length ? { body: req.body } : "",
  );
  next();
});

const handleServerError = (res, error, logMessage, clientMessage) => {
  console.error(logMessage, error);
  res.status(500).json({ error: clientMessage });
};

// Routes
app.post("/api/projects", async (req, res) => {
  const {
    title,
    description,
    link,
    image,
    tech,
    tags,
    images,
    category,
    published,
    github_stars,
    github_forks,
  } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ error: "Title and description are required" });
  }

  try {
    const project = await prisma.project.create({
      data: {
        title,
        description,
        link,
        image,
        tech,
        tags,
        images,
        category: category || "Other",
        published: published !== false,
        github_stars,
        github_forks,
      },
    });
    res.status(201).json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
});

// Delete a project
app.delete("/api/projects/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.project.delete({
      where: { id },
    });
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
});

// Update project (publish/unpublish)
app.patch("/api/projects/:id", async (req, res) => {
  const { id } = req.params;
  const { published, views } = req.body;

  try {
    const updateData = {};
    if (published !== undefined) updateData.published = published;
    if (views !== undefined) updateData.views = views;

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
    });
    res.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Failed to update project" });
  }
});

// Track project view
app.post("/api/projects/:id/view", async (req, res) => {
  const { id } = req.params;
  try {
    // Record view event
    await prisma.projectView.create({
      data: { projectId: id },
    });

    // Increment view counter
    const project = await prisma.project.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    res.json({ success: true, views: project.views });
  } catch (error) {
    console.error("Error tracking view:", error);
    // Don't fail the user experience if tracking fails
    res.status(500).json({ error: "Failed to track view" });
  }
});

// Get all projects with optional filtering and search
app.get("/api/projects", async (req, res) => {
  const { tags, search, category } = req.query;
  try {
    let projects = await prisma.project.findMany();

    // Filter by tags (pipe-separated)
    if (tags) {
      const tagArray = tags.split(",").map((t) => t.trim().toLowerCase());
      projects = projects.filter((p) => {
        if (!p.tags) return false;
        const projectTags = p.tags
          .split("|")
          .map((t) => t.trim().toLowerCase());
        return tagArray.some((tag) => projectTags.includes(tag));
      });
    }

    // Filter by category
    if (category) {
      projects = projects.filter((p) => p.category === category);
    }

    // Search by title or description
    if (search) {
      const searchLower = search.toLowerCase();
      projects = projects.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower),
      );
    }

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is running" });
});

// Admin stats endpoint
app.get("/api/admin/stats", adminAuth, async (req, res) => {
  try {
    const total = await prisma.project.count();
    const published = await prisma.project.count({
      where: { published: true },
    });
    const drafts = await prisma.project.count({
      where: { published: false },
    });

    res.json({
      total,
      published,
      drafts,
      totalViews: 0, // TODO: Re-enable after database migration
    });
  } catch (error) {
    handleServerError(
      res,
      error,
      "Error fetching admin stats:",
      "Failed to fetch stats",
    );
  }
});

// Admin: Get all projects (including drafts)
app.get("/api/admin/projects", adminAuth, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(projects);
  } catch (error) {
    handleServerError(
      res,
      error,
      "Error fetching all projects:",
      "Failed to fetch projects",
    );
  }
});

// Admin: Get analytics (most viewed projects)
app.get("/api/admin/analytics", adminAuth, async (req, res) => {
  try {
    // TODO: Analytics tracking - implement after database migration
    // For now, return empty analytics
    res.json({
      mostViewed: [],
      recentViews: 0,
      viewsByDate: {},
    });
    /*
    const timeRange = req.query.days || 30;
    const startDate = new Date(Date.now() - timeRange * 24 * 60 * 60 * 1000);

    // Get most viewed projects
    const mostViewed = await prisma.project.findMany({
      select: {
        id: true,
        title: true,
        views: true,
      },
      orderBy: { views: "desc" },
      take: 10,
    });

    // Get recent views (for timeline)
    const recentViews = await prisma.projectView.findMany({
      where: {
        viewedAt: { gte: startDate },
      },
      select: {
        projectId: true,
        viewedAt: true,
      },
      orderBy: { viewedAt: "desc" },
      take: 100,
    });

    // Count views by date (last 7 days)
    const viewsByDate = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split("T")[0];
      viewsByDate[dateStr] = 0;
    }

    recentViews.forEach((view) => {
      const dateStr = view.viewedAt.toISOString().split("T")[0];
      if (viewsByDate[dateStr] !== undefined) {
        viewsByDate[dateStr]++;
      }
    });

    res.json({
      mostViewed: recentViews ? recentViews.length : 0,
      recentViews: recentViews ? recentViews.length : 0,
      viewsByDate,
    });
    */
  } catch (error) {
    handleServerError(
      res,
      error,
      "Error fetching analytics:",
      "Failed to fetch analytics",
    );
  }
});

// GitHub sync endpoint
app.post("/api/projects/sync-github", async (req, res) => {
  const githubToken = process.env.GITHUB_TOKEN;
  const githubUsername = process.env.GITHUB_USERNAME;

  if (!githubToken || !githubUsername) {
    return res.status(400).json({
      error:
        "GitHub integration not configured. Set GITHUB_TOKEN and GITHUB_USERNAME in .env",
    });
  }

  try {
    const response = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`,
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const repos = await response.json();

    // Transform repos to project format
    const githubProjects = repos
      .filter((repo) => !repo.fork) // Exclude forks
      .map((repo) => ({
        title: repo.name,
        description: repo.description || "No description",
        link: repo.html_url,
        tech: repo.language || "Other",
        tags: "github",
        category: "GitHub",
        images: null,
        image: null,
        github_stars: repo.stargazers_count || 0,
        github_forks: repo.forks_count || 0,
      }));

    res.json(githubProjects);
  } catch (error) {
    console.error("Error syncing GitHub repos:", error);
    res.status(500).json({ error: "Failed to sync GitHub repos" });
  }
});

// Contact form endpoint
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ error: "Name, email, and message are required" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New contact form submission from ${name}`,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
      replyTo: email,
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
