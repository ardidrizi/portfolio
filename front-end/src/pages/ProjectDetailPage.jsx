import { Link, useRouter } from '../lib/router.jsx'
import Seo from '../components/Seo.jsx'
import { getProjectBySlug } from '../data/projects.ts'

function ProjectDetailPage() {
  const { pathname } = useRouter()
  const slug = pathname.replace('/projects/', '')
  const project = getProjectBySlug(slug)

  if (!project) {
    return (
      <section>
        <Seo
          title="Project Not Found"
          description="Requested project case study was not found."
          path={window.location.pathname}
        />
        <h1>Project not found</h1>
        <p>That case study does not exist yet.</p>
        <Link className="text-link" to="/projects">
          Back to projects
        </Link>
      </section>
    )
  }

  return (
    <>
      <Seo
        title={project.title}
        description={project.summary}
        path={`/projects/${project.slug}`}
        image={project.screenshots[0]}
      />
      <article className="case-study" aria-labelledby="case-study-title">
        <header>
          <p className="eyebrow">Case Study</p>
          <h1 id="case-study-title">{project.title}</h1>
          <p>{project.summary}</p>
        </header>

        <section aria-labelledby="project-overview-title">
          <h2 id="project-overview-title">Overview</h2>
          <h3>Problem</h3>
          <p>{project.problem}</p>
          <h3>Solution</h3>
          <p>{project.solution}</p>
        </section>

        <section aria-labelledby="project-screenshots-title">
          <h2 id="project-screenshots-title">Screenshots</h2>
          <div className="case-study-screenshots">
            {project.screenshots.map((screenshot) => (
              <img
                key={screenshot}
                src={screenshot}
                alt={`${project.title} screenshot`}
                className="detail-image"
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
        </section>

        <section aria-labelledby="project-stack-title">
          <h2 id="project-stack-title">Stack</h2>
          <ul>
            {project.stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="project-features-title">
          <h2 id="project-features-title">Features</h2>
          <ul>
            {project.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="project-challenges-title">
          <h2 id="project-challenges-title">Challenges</h2>
          <ul>
            {project.challenges.map((challenge) => (
              <li key={challenge}>{challenge}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="project-results-title">
          <h2 id="project-results-title">Results</h2>
          <ul>
            {project.results.map((result) => (
              <li key={result}>{result}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="project-links-title">
          <h2 id="project-links-title">Links</h2>
          <ul>
            <li>
              <a href={project.demoUrl} target="_blank" rel="noreferrer noopener">
                Live demo
              </a>
            </li>
            <li>
              <a href={project.repoUrl} target="_blank" rel="noreferrer noopener">
                Repository
              </a>
            </li>
          </ul>
        </section>
      </article>
    </>
  )
}

export default ProjectDetailPage
