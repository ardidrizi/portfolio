import { useEffect, useMemo, useState } from 'react'
import { Link } from '../lib/router.jsx'
import Seo from '../components/Seo.jsx'
import { fetchProjects } from '../services/github.ts'
import { getProjectRoute } from '../data/projects.ts'

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function ProjectsPage() {
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState('All')
  const [projects, setProjects] = useState([])
  const [notice, setNotice] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadProjects() {
      try {
        const response = await fetchProjects()
        if (cancelled) return
        setProjects(response.projects)
        setNotice(response.notice ?? '')
        setErrorMessage('')
      } catch {
        if (cancelled) return
        setErrorMessage('Unable to load projects from GitHub right now. Please try again in a moment.')
      }
    }

    loadProjects()

    return () => {
      cancelled = true
    }
  }, [])

  const tags = useMemo(() => {
    const all = projects.flatMap((project) => project.tags)
    return ['All', ...new Set(all)]
  }, [projects])

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) => {
        const matchesTag = activeTag === 'All' || project.tags.includes(activeTag)
        const q = search.toLowerCase()
        const matchesSearch = project.title.toLowerCase().includes(q) || project.summary.toLowerCase().includes(q)
        return matchesTag && matchesSearch
      }),
    [activeTag, projects, search],
  )

  return (
    <>
      <Seo title="Projects" description="Browse project case studies by keyword and technology tags." path="/projects" />
      <section>
        <h1>Projects</h1>
        <p>Loaded from GitHub repositories and case study files.</p>
        {notice ? <p className="small-text github-fallback-notice">{notice}</p> : null}
        {errorMessage ? <p className="small-text github-fallback-notice">{errorMessage}</p> : null}
      </section>

      <section className="filters" aria-label="Project filters">
        <label htmlFor="project-search" className="visually-hidden">
          Search projects
        </label>
        <input
          id="project-search"
          type="search"
          placeholder="Search repositories"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <div className="tag-list">
          {tags.map((tag) => (
            <button
              key={tag}
              className={`tag-button ${activeTag === tag ? 'active' : ''}`}
              onClick={() => setActiveTag(tag)}
              type="button"
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      <section>
        <p className="small-text">{filteredProjects.length} result(s)</p>
        <div className="project-grid">
          {filteredProjects.map((project) => (
            <article className="project-card github-project-card" key={project.id}>
              <div className="project-body">
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <div className="tag-list" aria-label="Repository tags">
                  {project.tags.map((tag) => (
                    <span key={`${project.id}-${tag}`} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="small-text github-repo-meta">
                  ★ {project.stars} · Updated {formatDate(project.updatedAt)}
                </p>
                <Link to={getProjectRoute(project)} className="text-link project-card-link">
                  View case study →
                </Link>
              </div>
            </article>
          ))}
        </div>
        {filteredProjects.length === 0 ? <p>No projects match your filters.</p> : null}
      </section>
    </>
  )
}

export default ProjectsPage
