import { Link } from '../lib/router.jsx'
import Seo from '../components/Seo.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import { projects } from '../data/projects.ts'

const stack = [
  'React',
  'TypeScript',
  'JavaScript',
  'Node.js',
  'Express',
  'PostgreSQL',
  'Prisma',
  'REST APIs',
  'Tailwind CSS',
  'Accessibility',
  'Testing',
  'CI/CD',
]

function HomePage() {
  const featured = projects.filter((project) => project.featured)

  return (
    <>
      <Seo
        title="Home"
        description="Portfolio home featuring selected case studies, skills, and ways to connect."
        path="/"
      />
      <section className="hero">
        <p className="eyebrow">Hello, I&apos;m Ardian Idrizi</p>
        <h1>I build premium digital products with speed, clarity, and purpose.</h1>
        <p>
          Full-stack developer delivering polished interfaces and reliable systems that turn product strategy into
          measurable outcomes.
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
        <p className="small-text section-subtitle">A curated selection of product work with strong UX and technical depth.</p>
        <div className="project-grid">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className="stack-section">
        <div className="section-heading">
          <h2>Skills &amp; Stack</h2>
        </div>
        <p className="small-text section-subtitle">Tools and technologies I use to ship maintainable, production-ready software.</p>
        <div className="tag-list">
          {stack.map((skill) => (
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
  )
}

export default HomePage
