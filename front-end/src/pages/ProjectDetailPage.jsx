import { Link } from '../lib/router.jsx'
import Seo from '../components/Seo.jsx'
import { projects } from '../data/projects.ts'
import { useRouter } from '../lib/router.jsx'

function ProjectDetailPage() {
  const { pathname } = useRouter()
  const slug = pathname.replace('/projects/', '')
  const project = projects.find((item) => item.slug === slug)

  if (!project) {
    return (
      <section>
        <Seo title="Project Not Found" description="Requested project case study was not found." />
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
      <Seo title={project.title} description={project.summary} path={`/projects/${project.slug}`} image={project.image} />
      <article className="case-study">
        <header>
          <p className="eyebrow">Case Study</p>
          <h1>{project.title}</h1>
          <p>{project.summary}</p>
          <img
            src={project.image}
            alt={`${project.title} preview`}
            className="detail-image"
            loading="lazy"
            decoding="async"
          />
        </header>

        <section>
          <h2>Problem</h2>
          <p>{project.problem}</p>
        </section>

        <section>
          <h2>Solution</h2>
          <p>{project.solution}</p>
        </section>

        <section>
          <h2>Stack</h2>
          <ul>
            {project.stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Features</h2>
          <ul>
            {project.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Challenges</h2>
          <p>{project.challenges}</p>
        </section>

        <section>
          <h2>Results</h2>
          <p>{project.results}</p>
        </section>

        <section>
          <h2>Links</h2>
          <ul>
            <li>
              <a href={project.links.demo} target="_blank" rel="noreferrer">
                Live demo
              </a>
            </li>
            <li>
              <a href={project.links.repo} target="_blank" rel="noreferrer">
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
