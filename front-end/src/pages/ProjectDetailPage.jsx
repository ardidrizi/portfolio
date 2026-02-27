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

  const gallerySlots =
    project.screenshots.length > 0
      ? project.screenshots.map((src, index) => ({ src, label: `Screenshot ${index + 1}` }))
      : (project.screenshotLabels ?? ['Screenshot 1', 'Screenshot 2', 'Screenshot 3']).map((label) => ({
          src: '',
          label,
        }))

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
        </header>

        <section aria-labelledby="project-overview-title">
          <h2 id="project-overview-title">Overview</h2>
          <p>{project.pitch ?? project.summary}</p>
          <div className="hero-actions" role="group" aria-label="Project links">
            <a className="button primary" href={project.demoUrl} target="_blank" rel="noreferrer noopener">
              View live demo
            </a>
            <a className="button" href={project.repoUrl} target="_blank" rel="noreferrer noopener">
              View repository
            </a>
          </div>
        </section>

        <section aria-labelledby="project-problem-title">
          <h2 id="project-problem-title">Problem</h2>
          <p>{project.pain ?? project.problem}</p>
        </section>

        <section aria-labelledby="project-target-title">
          <h2 id="project-target-title">Target users</h2>
          <p>{project.target ?? 'TBD'}</p>
        </section>

        <section aria-labelledby="project-solution-title">
          <h2 id="project-solution-title">Solution</h2>
          <p>{project.solution}</p>
        </section>

        <section aria-labelledby="project-features-title">
          <h2 id="project-features-title">Key features</h2>
          <ul>
            {project.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="project-stack-title" className="stack-section">
          <h2 id="project-stack-title">Tech stack</h2>
          <ul>
            {project.stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="project-architecture-title">
          <h2 id="project-architecture-title">Architecture</h2>
          <pre className="architecture-diagram" aria-label="Architecture diagram">
            {(project.architecture ?? ['TBD: Architecture diagram details pending.']).join('\n')}
          </pre>
        </section>

        <section aria-labelledby="project-challenges-title">
          <h2 id="project-challenges-title">Challenges &amp; tradeoffs</h2>
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

        <section aria-labelledby="project-next-steps-title">
          <h2 id="project-next-steps-title">Next steps</h2>
          <ul>
            {(project.nextSteps ?? ['TBD: Define implementation roadmap.']).map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="project-screenshots-title">
          <h2 id="project-screenshots-title">Screenshots gallery</h2>
          <div className="case-study-screenshots" aria-label="Project screenshots gallery">
            {gallerySlots.map((slot) =>
              slot.src ? (
                <figure className="screenshot-card" key={`${slot.label}-${slot.src}`}>
                  <img src={slot.src} alt={`${project.title} ${slot.label}`} className="detail-image" loading="lazy" decoding="async" />
                  <figcaption>{slot.label}</figcaption>
                </figure>
              ) : (
                <figure className="screenshot-card" key={slot.label}>
                  <div className="detail-image screenshot-placeholder" role="img" aria-label={`Placeholder for ${slot.label}`}>
                    Placeholder
                  </div>
                  <figcaption>{slot.label}</figcaption>
                </figure>
              ),
            )}
          </div>
        </section>
      </article>
    </>
  )
}

export default ProjectDetailPage
