import { useEffect, useMemo, useState } from 'react'
import { Link, useRouter } from '../lib/router.jsx'
import Seo from '../components/Seo.jsx'
import { PROJECT_SECTION_ORDER, getProjectRoute } from '../data/projects.ts'
import { fetchProjects } from '../services/github.ts'

function ProjectDetailPage() {
  const { pathname } = useRouter()
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetchProjects()
      .then((response) => {
        if (cancelled) return
        setProjects(response.projects)
        setIsLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setProjects([])
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const pathParts = pathname.split('/').filter(Boolean)
  const owner = pathParts[1] ?? ''
  const repo = pathParts[2] ?? ''

  const project = useMemo(
    () => projects.find((item) => item.owner.toLowerCase() === owner.toLowerCase() && item.repo.toLowerCase() === repo.toLowerCase()),
    [owner, projects, repo],
  )

  if (isLoading) {
    return <section><p>Loading project…</p></section>
  }

  if (!project) {
    return (
      <section>
        <Seo title="Project Not Found" description="Requested project case study was not found." path={window.location.pathname} />
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
      <Seo title={project.title} description={project.summary} path={getProjectRoute(project)} />
      <article className="case-study" aria-labelledby="case-study-title">
        <header>
          <p className="eyebrow">Case Study</p>
          <h1 id="case-study-title">{project.title}</h1>
          <p>{project.summary}</p>
        </header>

        {PROJECT_SECTION_ORDER.map((sectionKey) => {
          const section = project.sections[sectionKey]
          if (!section.content.length) return null

          return (
            <section key={sectionKey} aria-labelledby={`section-${sectionKey}`}>
              <h2 id={`section-${sectionKey}`}>{section.title}</h2>
              {section.content.map((entry) => {
                const isLink = sectionKey === 'links' && /^https?:\/\//i.test(entry)
                if (isLink) {
                  return (
                    <p key={entry}>
                      <a href={entry} target="_blank" rel="noreferrer noopener">
                        {entry}
                      </a>
                    </p>
                  )
                }

                return <p key={`${sectionKey}-${entry}`}>{entry}</p>
              })}
            </section>
          )
        })}

        <section aria-labelledby="project-links-title">
          <h2 id="project-links-title">Repository</h2>
          <div className="hero-actions" role="group" aria-label="Project links">
            <a className="button primary" href={project.repoUrl} target="_blank" rel="noreferrer noopener">
              View repository
            </a>
            {project.homepageUrl ? (
              <a className="button" href={project.homepageUrl} target="_blank" rel="noreferrer noopener">
                View homepage
              </a>
            ) : null}
          </div>
        </section>
      </article>
    </>
  )
}

export default ProjectDetailPage
