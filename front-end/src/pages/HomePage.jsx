import { Link } from "../lib/router.jsx";
import Seo from "../components/Seo.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import { projects } from "../data/projects.ts";

const skills = [
  "React",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "UX Collaboration",
  "Testing",
];

function HomePage() {
  const featured = projects.filter((project) => project.featured);

  return (
    <>
      <Seo
        title="Home"
        description="Portfolio home featuring selected case studies, skills, and ways to connect."
        path="/"
      />
      <section className="hero">
        <p className="eyebrow">Hello, I&apos;m Ardian Idrizi</p>
        <h1>I build thoughtful, fast, and accessible web experiences.</h1>
        <p>
          I&apos;m a fullstack developer focused on product outcomes turning
          business goals into clean, user-centered interfaces.
        </p>
        <div className="hero-actions">
          <Link className="button primary" to="/projects">
            View Projects
          </Link>
          <Link className="button" to="/contact">
            Let&apos;s Talk
          </Link>
        </div>
      </section>

      <section>
        <div className="section-heading">
          <h2>Featured Projects</h2>
          <Link to="/projects" className="text-link">
            Browse all →
          </Link>
        </div>
        <div className="project-grid">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section>
        <h2>Core Skills</h2>
        <div className="tag-list">
          {skills.map((skill) => (
            <span key={skill} className="tag">
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className="cta-block">
        <h2>Need a developer for your next product push?</h2>
        <p>I&apos;m available for freelance and full-time opportunities.</p>
        <Link className="button primary" to="/contact">
          Contact Me
        </Link>
      </section>
    </>
  );
}

export default HomePage;
