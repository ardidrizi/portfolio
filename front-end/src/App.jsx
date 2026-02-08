import { useEffect, useState, useMemo, useCallback } from "react";
import ReactDOM from "react-dom";
import "./App.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? window.location.origin : "http://localhost:5005");

const getInitialTheme = () => {
  const saved = localStorage.getItem("portfolio-theme");
  if (saved) return JSON.parse(saved);
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-header">
      <div className="skeleton-title" />
      <div className="skeleton-date" />
    </div>
    <div className="skeleton-image" />
    <div className="skeleton-text" />
    <div className="skeleton-text" style={{ width: "80%" }} />
    <div className="skeleton-tags">
      <div className="skeleton-tag" />
      <div className="skeleton-tag" />
    </div>
  </div>
);

const featuredProjects = [
  {
    title: "Revolty",
    description: "Revolty Paris marketing site built in Webflow.",
    link: "https://www.revolty.fr/",
    tech: ["Webflow"],
  },
  {
    title: "SAT+",
    description: "Ruby on Rails project for the SeniorenAllTagPlus platform.",
    link: "https://senioren-all-tag-plus-c79d436cda54.herokuapp.com",
    tech: ["Ruby on Rails"],
  },
];

function App() {
  const [darkMode, setDarkMode] = useState(getInitialTheme);
  const [apiAvailable, setApiAvailable] = useState(true);
  const [apiMessage, setApiMessage] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    link: "",
    tech: "",
    tags: "",
    images: "",
    image: "",
    category: "Other",
    published: true,
  });

  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");
  const [deletingId, setDeletingId] = useState("");
  // Initialize state from URL params
  const getInitialFilters = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      tag: params.get("tag") || "",
      search: params.get("search") || "",
      sort: params.get("sort") || "date-desc",
      view: params.get("view") || "grid",
      page: parseInt(params.get("page")) || 1,
    };
  };

  const initialFilters = getInitialFilters();

  const [selectedTag, setSelectedTag] = useState(initialFilters.tag);
  const [searchQuery, setSearchQuery] = useState(initialFilters.search);
  const [sortBy, setSortBy] = useState(initialFilters.sort);
  const [currentPage, setCurrentPage] = useState(initialFilters.page);
  const [viewMode, setViewMode] = useState(initialFilters.view);
  const [syncingGithub, setSyncingGithub] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [expandedTechGroups, setExpandedTechGroups] = useState({});
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [adminToken, setAdminToken] = useState(
    sessionStorage.getItem("admin_token") || "",
  );
  const [adminStats, setAdminStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    totalViews: 0,
  });
  const [adminProjects, setAdminProjects] = useState([]);
  const [showAdminDash, setShowAdminDash] = useState(false);
  const [adminAnalytics, setAdminAnalytics] = useState({
    mostViewed: [],
    recentViews: 0,
    viewsByDate: {},
  });
  const itemsPerPage = 9;
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light",
    );
    localStorage.setItem("portfolio-theme", JSON.stringify(darkMode));
  }, [darkMode]);

  // Format/parse helper functions
  const formatDate = (value) => {
    if (!value) return null;
    const d = new Date(value);
    if (Number.isNaN(d)) return null;
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short" });
  };

  const parseTech = (value) =>
    value
      ? value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

  const parseTags = (value) =>
    value
      ? value
          .split("|")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

  const parseImages = (value) => {
    if (!value) return [];
    try {
      return Array.isArray(JSON.parse(value)) ? JSON.parse(value) : [];
    } catch {
      return value
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean);
    }
  };

  // Sync filters to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedTag) params.set("tag", selectedTag);
    if (searchQuery) params.set("search", searchQuery);
    if (sortBy !== "date-desc") params.set("sort", sortBy);
    if (viewMode !== "grid") params.set("view", viewMode);
    if (currentPage > 1) params.set("page", currentPage);

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params}`
      : window.location.pathname;
    window.history.replaceState({}, "", newUrl);
  }, [selectedTag, searchQuery, sortBy, viewMode, currentPage]);

  // Fetch admin data when token changes
  useEffect(() => {
    if (!adminToken || !apiAvailable) {
      setAdminProjects([]);
      setAdminStats({ total: 0, published: 0, drafts: 0, totalViews: 0 });
      setAdminAnalytics({ mostViewed: [], recentViews: 0, viewsByDate: {} });
      return;
    }

    Promise.all([
      fetch(`${API_BASE_URL}/api/admin/stats`, {
        headers: { "x-admin-token": adminToken },
      }).then((r) => r.json()),
      fetch(`${API_BASE_URL}/api/admin/projects`, {
        headers: { "x-admin-token": adminToken },
      }).then((r) => r.json()),
      fetch(`${API_BASE_URL}/api/admin/analytics`, {
        headers: { "x-admin-token": adminToken },
      }).then((r) => r.json()),
    ]).then(([stats, projects, analytics]) => {
      setAdminStats(stats);
      setAdminProjects(projects);
      setAdminAnalytics(analytics);
    });
  }, [adminToken, apiAvailable]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // ESC closes gallery
      if (e.key === "Escape" && galleryOpen) {
        setGalleryOpen(null);
      }

      // Arrow keys in gallery - note: use direct fetch/parse here since we can't guarantee sortedProjects
      if (galleryOpen) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          // Gallery will handle image navigation, we just close on ESC
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          // Gallery will handle image navigation, we just close on ESC
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [galleryOpen]);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const load = async () => {
      try {
        const healthRes = await fetch(`${API_BASE_URL}/api/health`, {
          signal: controller.signal,
        });

        if (!healthRes.ok) {
          throw new Error("Backend unavailable");
        }

        setApiAvailable(true);
        setApiMessage("");
      } catch (err) {
        setApiAvailable(false);
        setApiMessage(
          "Backend unavailable. Some features are disabled. Check VITE_API_BASE_URL and backend status.",
        );
        setError("Backend unavailable. Please try again later.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/projects`);
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    load();

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!apiAvailable) {
      setFormError("Backend unavailable. Please try again later.");
      return;
    }
    if (!form.title || !form.description) {
      setFormError("Title and description are required");
      return;
    }

    setCreating(true);
    setFormError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to create project");
      }

      const created = await res.json();
      setProjects((prev) => [created, ...prev]);
      setForm({
        title: "",
        description: "",
        link: "",
        tech: "",
        tags: "",
        images: "",
        image: "",
        category: "Other",
        published: true,
      });
    } catch (err) {
      setFormError(err.message || "Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!apiAvailable) {
      alert("Backend unavailable. Please try again later.");
      return;
    }
    const confirmDelete = window.confirm(
      "Delete this project? This cannot be undone.",
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      const res = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to delete project");
      }

      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete project");
    } finally {
      setDeletingId("");
    }
  };

  const handleGithubSync = async () => {
    if (!apiAvailable) {
      alert("Backend unavailable. Please try again later.");
      return;
    }
    setSyncingGithub(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/projects/sync-github`, {
        method: "POST",
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to sync GitHub repos");
      }

      const repos = await res.json();
      if (repos.length === 0) {
        alert("No repositories found");
        return;
      }

      // Show which repos will be added
      const repoNames = repos.map((r) => r.title).join("\n");
      const confirmed = window.confirm(
        `Add ${repos.length} repositories?\n\n${repoNames}`,
      );
      if (!confirmed) return;

      // Add each repo as a project
      for (const repo of repos) {
        try {
          await fetch(`${API_BASE_URL}/api/projects`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(repo),
          });
        } catch (err) {
          console.error(`Failed to add ${repo.title}:`, err);
        }
      }

      // Reload projects
      const projectRes = await fetch(`${API_BASE_URL}/api/projects`);
      const updated = await projectRes.json();
      setProjects(updated);
      alert(`Successfully added ${repos.length} projects from GitHub!`);
    } catch (err) {
      alert(err.message || "Failed to sync GitHub repos");
    } finally {
      setSyncingGithub(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!apiAvailable) {
      setContactMessage("✗ Backend unavailable. Please try again later.");
      return;
    }
    setContactSubmitting(true);
    setContactMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to send message");
      }

      setContactMessage("✓ Message sent! I'll get back to you soon.");
      setContactForm({ name: "", email: "", message: "" });
    } catch (err) {
      setContactMessage(
        `✗ ${err.message || "Failed to send message. Please try again."}`,
      );
    } finally {
      setContactSubmitting(false);
    }
  };

  // Track project view when link is clicked
  const trackProjectView = useCallback(
    (projectId) => {
      if (!apiAvailable) return;
      fetch(`${API_BASE_URL}/api/projects/${projectId}/view`, {
        method: "POST",
      }).catch(() => {
        // Silently fail - don't interrupt user experience
      });
    },
    [apiAvailable],
  );

  // Get all unique tags from projects (memoized)
  const allTags = useMemo(
    () =>
      Array.from(new Set(projects.flatMap((p) => parseTags(p.tags)).sort())),
    [projects],
  );

  // Get all unique categories from projects (memoized)
  const allCategories = useMemo(
    () =>
      Array.from(new Set(projects.map((p) => p.category || "Other").sort())),
    [projects],
  );

  // Filter projects by selected tag and search query (memoized)
  const filteredProjects = useMemo(
    () =>
      projects.filter((project) => {
        // Hide drafts unless admin is logged in
        if (!adminToken && !project.published) {
          return false;
        }

        const matchesTag =
          !selectedTag || parseTags(project.tags).includes(selectedTag);
        const matchesSearch =
          !searchQuery ||
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTag && matchesSearch;
      }),
    [projects, selectedTag, searchQuery, adminToken],
  );

  // Sort projects (memoized)
  const sortedProjects = useMemo(
    () =>
      [...filteredProjects].sort((a, b) => {
        switch (sortBy) {
          case "date-asc":
            return new Date(a.createdAt) - new Date(b.createdAt);
          case "date-desc":
            return new Date(b.createdAt) - new Date(a.createdAt);
          case "name":
            return a.title.localeCompare(b.title);
          case "tech":
            return (a.tech || "").localeCompare(b.tech || "");
          default:
            return 0;
        }
      }),
    [filteredProjects, sortBy],
  );

  // Group projects by tech (memoized)
  const groupedByTech = useMemo(() => {
    const grouped = {};
    sortedProjects.forEach((project) => {
      const techs = parseTech(project.tech);
      if (techs.length === 0) {
        if (!grouped["Untagged"]) grouped["Untagged"] = [];
        grouped["Untagged"].push(project);
      } else {
        techs.forEach((tech) => {
          if (!grouped[tech]) grouped[tech] = [];
          grouped[tech].push(project);
        });
      }
    });
    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  }, [sortedProjects]);

  // Pagination
  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedProjects = sortedProjects.slice(startIdx, endIdx);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTag, searchQuery, sortBy]);

  return (
    <div className="app" role="application" aria-label="Portfolio website">
      {!apiAvailable && apiMessage && (
        <div className="api-banner" role="status" aria-live="polite">
          {apiMessage}
        </div>
      )}
      <nav className="top-nav" aria-label="Main navigation">
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </div>
        <button
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          aria-pressed={darkMode}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
        {!adminToken && (
          <button
            className="theme-toggle"
            disabled={!apiAvailable}
            onClick={() => {
              if (!apiAvailable) return;
              const token = prompt("Admin password:");
              if (token) {
                setAdminToken(token);
                sessionStorage.setItem("admin_token", token);
              }
            }}
            title="Admin login"
            aria-label="Admin login"
          >
            🔐
          </button>
        )}
        {adminToken && (
          <button
            className="theme-toggle"
            disabled={!apiAvailable}
            onClick={() => setShowAdminDash(!showAdminDash)}
            title="Toggle admin dashboard"
            aria-label="Toggle admin dashboard"
            style={{ color: "#3b82f6" }}
          >
            📊
          </button>
        )}
        {adminToken && (
          <button
            className="theme-toggle"
            onClick={() => {
              setAdminToken("");
              sessionStorage.removeItem("admin_token");
            }}
            title="Admin logout"
            aria-label="Admin logout"
            style={{ color: "#22c55e" }}
          >
            ✓
          </button>
        )}
      </nav>

      <section className="hero">
        <h1>Hi, I&apos;m Ardian Idrizi</h1>
        <p>
          Junior full‑stack developer building production‑ready web
          applications.
        </p>
        <div className="hero-actions">
          <a href="#projects" className="primary-btn">
            View projects
          </a>
          <a href="#contact" className="secondary-btn">
            Get in touch
          </a>
        </div>
      </section>

      <section id="about" className="section">
        <h2>About</h2>
        <p>
          I&apos;m a junior full‑stack developer with hands‑on experience
          building production‑ready web applications using React, Node.js,
          Prisma, and PostgreSQL. I&apos;ve completed intensive bootcamps at
          Ironhack and Le Wagon and worked as a freelance developer for a
          Paris‑based startup.
        </p>
        <p>
          I focus on clean code, REST APIs, and production‑ready applications.
          Based in Berlin.
        </p>
      </section>

      <section id="skills" className="section">
        <h2>Skills</h2>
        <div className="skills-grid">
          <div className="skills-group">
            <h3>Frontend</h3>
            <div className="skills-tags">
              <span>React</span>
              <span>TypeScript</span>
              <span>JavaScript</span>
              <span>HTML</span>
              <span>CSS</span>
              <span>SCSS</span>
              <span>Tailwind</span>
            </div>
          </div>

          <div className="skills-group">
            <h3>Backend</h3>
            <div className="skills-tags">
              <span>Node.js</span>
              <span>Express</span>
              <span>Prisma</span>
              <span>Ruby on Rails</span>
            </div>
          </div>

          <div className="skills-group">
            <h3>Databases</h3>
            <div className="skills-tags">
              <span>PostgreSQL</span>
              <span>MySQL</span>
              <span>MongoDB</span>
            </div>
          </div>

          <div className="skills-group">
            <h3>Tools & Concepts</h3>
            <div className="skills-tags">
              <span>Git</span>
              <span>Docker</span>
              <span>Railway</span>
              <span>Netlify</span>
              <span>Heroku</span>
              <span>REST APIs</span>
              <span>Authentication</span>
              <span>CRUD</span>
              <span>Responsive Design</span>
              <span>Agile</span>
            </div>
          </div>
        </div>
      </section>

      <section
        id="projects"
        className="section"
        aria-label="Projects portfolio"
      >
        <h2>Projects</h2>
        <div className="featured-projects">
          <h3>Featured projects</h3>
          <div className="projects-grid" role="list">
            {featuredProjects.map((proj) => (
              <article
                key={proj.title}
                className="project-card"
                role="listitem"
              >
                <header className="project-card-header">
                  <h3>{proj.title}</h3>
                </header>
                <p>{proj.description}</p>
                {proj.tech && (
                  <div className="project-tags">
                    {proj.tech.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                )}
                {proj.link && (
                  <a href={proj.link} target="_blank" rel="noreferrer">
                    View project
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>

        <h3>Other projects</h3>

        {/* Add Project Button */}
        <button
          className="add-project-btn"
          disabled={!apiAvailable}
          onClick={() => setFormOpen(!formOpen)}
          aria-label={
            formOpen ? "Close add project form" : "Open add project form"
          }
        >
          {formOpen ? "✕ Close Form" : "+ Add Project"}
        </button>

        {/* Project Form Modal */}
        {formOpen && (
          <div
            className="form-modal-overlay"
            onClick={() => setFormOpen(false)}
          >
            <div className="form-modal" onClick={(e) => e.stopPropagation()}>
              <button
                className="form-close"
                onClick={() => setFormOpen(false)}
                aria-label="Close form"
              >
                ✕
              </button>
              <div className="project-form">
                <h3>Add a new project</h3>
                {formError && <p className="error">{formError}</p>}
                <form onSubmit={handleSubmit}>
                  {/* Title */}
                  <label>
                    Title
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="Project title"
                    />
                  </label>

                  {/* Description */}
                  <label>
                    Description
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Short description"
                      rows={3}
                    />
                  </label>

                  {/* Link */}
                  <label>
                    Link (optional)
                    <input
                      name="link"
                      value={form.link}
                      onChange={handleChange}
                      placeholder="https://…"
                    />
                  </label>

                  {/* Tech */}
                  <label>
                    Tech (optional, comma-separated)
                    <input
                      name="tech"
                      value={form.tech}
                      onChange={handleChange}
                      placeholder="React, Node.js, Prisma"
                    />
                  </label>

                  {/* Tags */}
                  <label>
                    Tags (optional, pipe-separated)
                    <input
                      name="tags"
                      value={form.tags}
                      onChange={handleChange}
                      placeholder="frontend|react|portfolio"
                    />
                  </label>

                  {/* Category */}
                  <label>
                    Category
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                    >
                      <option value="Other">Other</option>
                      <option value="Web">Web</option>
                      <option value="Mobile">Mobile</option>
                      <option value="Desktop">Desktop</option>
                      <option value="GitHub">GitHub</option>
                      <option value="Design">Design</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  </label>

                  {/* Publish */}
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <input
                      type="checkbox"
                      name="published"
                      checked={form.published}
                      onChange={(e) =>
                        setForm({ ...form, published: e.target.checked })
                      }
                    />
                    <span>Publish (uncheck to save as draft)</span>
                  </label>

                  {/* Image */}
                  <label>
                    Image URL (optional)
                    <input
                      name="image"
                      value={form.image}
                      onChange={handleChange}
                      placeholder="https://…"
                    />
                  </label>

                  {/* Images (multiple) */}
                  <label>
                    Additional image URLs (optional, comma-separated)
                    <input
                      name="images"
                      value={form.images}
                      onChange={handleChange}
                      placeholder="https://…, https://…"
                    />
                  </label>

                  <button type="submit" disabled={creating}>
                    {creating ? "Saving..." : "Add project"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* GitHub Sync Button */}
        <button
          className="github-sync-button"
          onClick={handleGithubSync}
          disabled={syncingGithub || !apiAvailable}
        >
          {syncingGithub ? "Syncing..." : "Sync from GitHub"}
        </button>

        {/* Search & Filter */}
        <div className="project-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="controls-row">
            {allTags.length > 0 && (
              <div className="tag-filters">
                <button
                  className={`tag-button ${!selectedTag ? "active" : ""}`}
                  onClick={() => setSelectedTag("")}
                >
                  All
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    className={`tag-button ${selectedTag === tag ? "active" : ""}`}
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            <div className="sort-controls">
              <label htmlFor="sort-select">Sort by:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="name">Alphabetical (A-Z)</option>
                <option value="tech">Tech Stack</option>
              </select>

              <div className="view-toggle">
                <button
                  className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  title="Grid view"
                  aria-label="Grid view"
                >
                  ⊞
                </button>
                <button
                  className={`view-btn ${viewMode === "timeline" ? "active" : ""}`}
                  onClick={() => setViewMode("timeline")}
                  title="Timeline view"
                  aria-label="Timeline view"
                >
                  ∥
                </button>
                <button
                  className={`view-btn ${viewMode === "tech" ? "active" : ""}`}
                  onClick={() => setViewMode("tech")}
                  title="Tech view"
                  aria-label="Tech view"
                >
                  ⚙
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div
            className="projects-grid"
            aria-busy="true"
            aria-label="Loading projects"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}
        {error && (
          <p className="error" role="alert" aria-live="assertive">
            {error}
          </p>
        )}

        {!loading && !error && filteredProjects.length === 0 && (
          <p className="empty-state">
            {projects.length === 0
              ? "No projects yet. Add one above to get started."
              : "No projects match your filters."}
          </p>
        )}

        {!loading &&
          !error &&
          paginatedProjects.length > 0 &&
          viewMode === "grid" && (
            <>
              <div className="projects-grid">
                {paginatedProjects.map((project) => {
                  const createdLabel = formatDate(project.createdAt);
                  const techList = parseTech(project.tech);
                  const tagList = parseTags(project.tags);
                  const imageList = parseImages(project.images);
                  const allImages = [project.image, ...imageList].filter(
                    Boolean,
                  );

                  return (
                    <article key={project.id} className="project-card">
                      <header className="project-card-header">
                        <h3>
                          {project.title}
                          {!project.published && adminToken && (
                            <span
                              style={{
                                marginLeft: "0.5rem",
                                padding: "0.25rem 0.5rem",
                                background: "#fca5a5",
                                color: "#7f1d1d",
                                borderRadius: "4px",
                                fontSize: "0.7rem",
                                fontWeight: "bold",
                              }}
                            >
                              DRAFT
                            </span>
                          )}
                        </h3>
                        {createdLabel && (
                          <span className="project-date">{createdLabel}</span>
                        )}
                      </header>
                      {project.category && project.category !== "Other" && (
                        <span className="project-category">
                          {project.category}
                        </span>
                      )}
                      {allImages.length > 0 && (
                        <div className="project-image-container">
                          <img
                            className="project-image"
                            src={allImages[0]}
                            alt={project.title}
                            loading="lazy"
                            onClick={() => {
                              setGalleryOpen(project.id);
                              setGalleryIndex(0);
                            }}
                            style={{
                              cursor:
                                allImages.length > 1 ? "pointer" : "default",
                            }}
                          />
                          {allImages.length > 1 && (
                            <div className="image-count">
                              {allImages.length} images
                            </div>
                          )}
                        </div>
                      )}
                      <p>{project.description}</p>
                      {techList.length > 0 && (
                        <div className="project-tags">
                          {techList.map((t) => (
                            <span key={t}>{t}</span>
                          ))}
                        </div>
                      )}
                      {(project.github_stars !== undefined ||
                        project.github_forks !== undefined) && (
                        <div className="github-stats">
                          {project.github_stars !== undefined && (
                            <span title={`${project.github_stars} stars`}>
                              ⭐ {project.github_stars}
                            </span>
                          )}
                          {project.github_forks !== undefined && (
                            <span title={`${project.github_forks} forks`}>
                              🍴 {project.github_forks}
                            </span>
                          )}
                        </div>
                      )}
                      {tagList.length > 0 && (
                        <div className="project-tags category-tags">
                          {tagList.map((t) => (
                            <button
                              key={t}
                              className="tag-link"
                              onClick={() => setSelectedTag(t)}
                              title={`Filter by ${t}`}
                            >
                              #{t}
                            </button>
                          ))}
                        </div>
                      )}
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => trackProjectView(project.id)}
                        >
                          View project →
                        </a>
                      )}
                      {adminToken && (
                        <button
                          type="button"
                          className="project-delete-button"
                          onClick={() =>
                            fetch(
                              `${API_BASE_URL}/api/projects/${project.id}`,
                              {
                                method: "PATCH",
                                headers: {
                                  "Content-Type": "application/json",
                                  "x-admin-token": adminToken,
                                },
                                body: JSON.stringify({
                                  published: !project.published,
                                }),
                              },
                            )
                              .then(() => {
                                setProjects((prev) =>
                                  prev.map((p) =>
                                    p.id === project.id
                                      ? {
                                          ...p,
                                          published: !p.published,
                                        }
                                      : p,
                                  ),
                                );
                              })
                              .catch((err) =>
                                alert("Failed to change publish status"),
                              )
                          }
                          style={{
                            background: project.published
                              ? "#fca5a5"
                              : "#86efac",
                            color: project.published ? "#7f1d1d" : "#166534",
                          }}
                        >
                          {project.published ? "Unpublish" : "Publish"}
                        </button>
                      )}
                      <button
                        type="button"
                        className="project-delete-button"
                        onClick={() => handleDelete(project.id)}
                        disabled={deletingId === project.id}
                      >
                        {deletingId === project.id ? "Deleting..." : "Delete"}
                      </button>
                    </article>
                  );
                })}
              </div>

              {/* Pagination Controls - Grid View */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    ← Previous
                  </button>

                  <div className="pagination-info">
                    <span>
                      Page {currentPage} of {totalPages}
                    </span>
                    <span className="pagination-count">
                      {startIdx + 1}–{Math.min(endIdx, sortedProjects.length)}{" "}
                      of {sortedProjects.length}
                    </span>
                  </div>

                  <button
                    className="pagination-btn"
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}

        {/* Timeline View */}
        {!loading &&
          !error &&
          sortedProjects.length > 0 &&
          viewMode === "timeline" && (
            <div className="timeline-container">
              {Array.from(
                new Set(
                  sortedProjects.map((p) =>
                    new Date(p.createdAt).getFullYear(),
                  ),
                ),
              )
                .sort()
                .reverse()
                .map((year) => (
                  <div key={year}>
                    <h3 className="timeline-year">{year}</h3>
                    <div className="timeline">
                      {sortedProjects
                        .filter(
                          (p) => new Date(p.createdAt).getFullYear() === year,
                        )
                        .map((project) => {
                          const createdLabel = formatDate(project.createdAt);
                          const techList = parseTech(project.tech);
                          return (
                            <div key={project.id} className="timeline-item">
                              <div className="timeline-dot" />
                              <article className="timeline-project">
                                <h4>{project.title}</h4>
                                {createdLabel && (
                                  <span className="timeline-date">
                                    {createdLabel}
                                  </span>
                                )}
                                <p>{project.description}</p>
                                {techList.length > 0 && (
                                  <div className="project-tags">
                                    {techList.map((t) => (
                                      <span key={t}>{t}</span>
                                    ))}
                                  </div>
                                )}
                                {(project.github_stars !== undefined ||
                                  project.github_forks !== undefined) && (
                                  <div className="github-stats">
                                    {project.github_stars !== undefined && (
                                      <span
                                        title={`${project.github_stars} stars`}
                                      >
                                        ⭐ {project.github_stars}
                                      </span>
                                    )}
                                    {project.github_forks !== undefined && (
                                      <span
                                        title={`${project.github_forks} forks`}
                                      >
                                        🍴 {project.github_forks}
                                      </span>
                                    )}
                                  </div>
                                )}
                                {project.link && (
                                  <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={() => trackProjectView(project.id)}
                                  >
                                    View project →
                                  </a>
                                )}
                              </article>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ))}
            </div>
          )}

        {/* Tech Group View */}
        {!loading &&
          !error &&
          sortedProjects.length > 0 &&
          viewMode === "tech" && (
            <div className="tech-groups">
              {groupedByTech.map(([tech, projects]) => (
                <div key={tech} className="tech-group">
                  <button
                    className={`tech-group-header ${
                      expandedTechGroups[tech] ? "expanded" : ""
                    }`}
                    onClick={() =>
                      setExpandedTechGroups((prev) => ({
                        ...prev,
                        [tech]: !prev[tech],
                      }))
                    }
                  >
                    <span className="tech-group-title">
                      {tech} ({projects.length})
                    </span>
                    <span className="tech-group-toggle">
                      {expandedTechGroups[tech] ? "▼" : "▶"}
                    </span>
                  </button>
                  {expandedTechGroups[tech] && (
                    <div className="tech-group-projects">
                      {projects.map((project) => {
                        const createdLabel = formatDate(project.createdAt);
                        const techList = parseTech(project.tech);
                        const imageList = parseImages(project.images);
                        const allImages = [project.image, ...imageList].filter(
                          Boolean,
                        );

                        return (
                          <article
                            key={project.id}
                            className="project-card tech-card"
                          >
                            <header className="project-card-header">
                              <h3>{project.title}</h3>
                              {createdLabel && (
                                <span className="project-date">
                                  {createdLabel}
                                </span>
                              )}
                            </header>
                            {allImages.length > 0 && (
                              <div className="project-image-container">
                                <img
                                  className="project-image"
                                  src={allImages[0]}
                                  alt={project.title}
                                  loading="lazy"
                                  onClick={() => {
                                    setGalleryOpen(project.id);
                                    setGalleryIndex(0);
                                  }}
                                  style={{
                                    cursor:
                                      allImages.length > 1
                                        ? "pointer"
                                        : "default",
                                  }}
                                />
                                {allImages.length > 1 && (
                                  <div className="image-count">
                                    {allImages.length} images
                                  </div>
                                )}
                              </div>
                            )}
                            <p>{project.description}</p>
                            {techList.length > 0 && (
                              <div className="project-tags">
                                {techList.map((t) => (
                                  <span key={t}>{t}</span>
                                ))}
                              </div>
                            )}
                            {(project.github_stars !== undefined ||
                              project.github_forks !== undefined) && (
                              <div className="github-stats">
                                {project.github_stars !== undefined && (
                                  <span title={`${project.github_stars} stars`}>
                                    ⭐ {project.github_stars}
                                  </span>
                                )}
                                {project.github_forks !== undefined && (
                                  <span title={`${project.github_forks} forks`}>
                                    🍴 {project.github_forks}
                                  </span>
                                )}
                              </div>
                            )}
                            {project.link && (
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => trackProjectView(project.id)}
                              >
                                View project →
                              </a>
                            )}
                          </article>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        {/* Image Gallery Modal */}
        {galleryOpen && (
          <div
            className="gallery-modal"
            onClick={() => setGalleryOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Image gallery"
          >
            <div
              className="gallery-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="gallery-close"
                onClick={() => setGalleryOpen(null)}
                aria-label="Close gallery (ESC)"
                title="Close (ESC)"
              >
                ✕
              </button>
              {sortedProjects.find((p) => p.id === galleryOpen) &&
                (() => {
                  const project = sortedProjects.find(
                    (p) => p.id === galleryOpen,
                  );
                  const imageList = parseImages(project.images);
                  const allImages = [project.image, ...imageList].filter(
                    Boolean,
                  );
                  return (
                    <>
                      <img
                        src={allImages[galleryIndex]}
                        alt={`${project.title} ${galleryIndex + 1}`}
                        className="gallery-image"
                      />
                      {allImages.length > 1 && (
                        <div className="gallery-nav">
                          <button
                            onClick={() =>
                              setGalleryIndex(
                                (galleryIndex - 1 + allImages.length) %
                                  allImages.length,
                              )
                            }
                            aria-label="Previous image (Left Arrow)"
                            title="Previous (← Arrow)"
                          >
                            ‹ Prev
                          </button>
                          <span>
                            {galleryIndex + 1} / {allImages.length}
                          </span>
                          <button
                            onClick={() =>
                              setGalleryIndex(
                                (galleryIndex + 1) % allImages.length,
                              )
                            }
                            aria-label="Next image (Right Arrow)"
                            title="Next (→ Arrow)"
                          >
                            Next ›
                          </button>
                        </div>
                      )}
                    </>
                  );
                })()}
            </div>
          </div>
        )}
      </section>

      <section id="contact" className="section">
        <h2>Contact</h2>

        <form onSubmit={handleContactSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="contact-name">Name</label>
            <input
              id="contact-name"
              type="text"
              placeholder="Your name"
              value={contactForm.name}
              onChange={(e) =>
                setContactForm({ ...contactForm, name: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact-email">Email</label>
            <input
              id="contact-email"
              type="email"
              placeholder="your@email.com"
              value={contactForm.email}
              onChange={(e) =>
                setContactForm({ ...contactForm, email: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              placeholder="Your message here..."
              value={contactForm.message}
              onChange={(e) =>
                setContactForm({ ...contactForm, message: e.target.value })
              }
              rows={5}
              required
            />
          </div>

          {contactMessage && (
            <p
              className={`contact-message ${
                contactMessage.startsWith("✓") ? "success" : "error"
              }`}
            >
              {contactMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={contactSubmitting || !apiAvailable}
            className="contact-submit"
          >
            {contactSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>

        <hr />

        <p>
          Best way to reach me:
          <br />
          <a href="mailto:ardianidizi@gmail.com">ardianidizi@gmail.com</a>
        </p>
        <p>
          Or find me on{" "}
          <a
            href="https://github.com/ardidrizi"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          .
        </p>
      </section>

      {/* Admin Dashboard Modal - Render as Portal */}
      {adminToken &&
        showAdminDash &&
        ReactDOM.createPortal(
          <div
            className="admin-modal-overlay"
            onClick={() => setShowAdminDash(false)}
          >
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
              <button
                className="admin-modal-close"
                onClick={() => setShowAdminDash(false)}
                aria-label="Close admin dashboard"
              >
                ✕
              </button>

              <h2>Admin Dashboard</h2>

              {/* Stats Grid */}
              <div className="admin-stats">
                <div className="admin-stat-card">
                  <div className="stat-number">{adminStats.total}</div>
                  <div className="stat-label">Total Projects</div>
                </div>
                <div className="admin-stat-card">
                  <div className="stat-number" style={{ color: "#22c55e" }}>
                    {adminStats.published}
                  </div>
                  <div className="stat-label">Published</div>
                </div>
                <div className="admin-stat-card">
                  <div className="stat-number" style={{ color: "#ef4444" }}>
                    {adminStats.drafts}
                  </div>
                  <div className="stat-label">Drafts</div>
                </div>
                <div className="admin-stat-card">
                  <div className="stat-number">{adminStats.totalViews}</div>
                  <div className="stat-label">Total Views</div>
                </div>
              </div>

              {/* Most Viewed Projects */}
              <h3 style={{ marginTop: "2rem" }}>Most Viewed Projects</h3>
              {adminAnalytics?.mostViewed?.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: "1rem",
                    marginBottom: "2rem",
                  }}
                >
                  {adminAnalytics.mostViewed.slice(0, 5).map((project) => (
                    <div
                      key={project.id}
                      style={{
                        background:
                          "linear-gradient(135deg, var(--bg-primary), var(--bg-secondary))",
                        border: "1px solid var(--border)",
                        borderRadius: "0.75rem",
                        padding: "1rem",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{ fontWeight: "600", marginBottom: "0.5rem" }}
                      >
                        {project.title}
                      </div>
                      <div
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                          color: "#3b82f6",
                        }}
                      >
                        {project.views}
                      </div>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--text-secondary)",
                        }}
                      >
                        views
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p
                  style={{
                    color: "var(--text-secondary)",
                    marginBottom: "2rem",
                  }}
                >
                  No views yet
                </p>
              )}

              {/* Projects Table */}
              <h3 style={{ marginTop: "2rem" }}>All Projects</h3>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Category</th>
                      <th>Views</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminProjects.map((project) => (
                      <tr key={project.id}>
                        <td style={{ fontWeight: "500" }}>{project.title}</td>
                        <td>
                          <span
                            style={{
                              padding: "0.25rem 0.5rem",
                              borderRadius: "4px",
                              fontSize: "0.85rem",
                              background: project.published
                                ? "#d1fae5"
                                : "#fee2e2",
                              color: project.published ? "#065f46" : "#7f1d1d",
                            }}
                          >
                            {project.published ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td>{project.category || "Other"}</td>
                        <td>{project.views || 0}</td>
                        <td style={{ fontSize: "0.9rem" }}>
                          {formatDate(project.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p
                style={{ marginTop: "1rem", fontSize: "0.9rem", opacity: 0.7 }}
              >
                {adminProjects.length} projects total
              </p>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default App;
