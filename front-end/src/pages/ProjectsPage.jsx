import { useEffect, useMemo, useState } from 'react'
import { Link } from '../lib/router.jsx'
import Seo from '../components/Seo.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import { projects as localProjects } from '../data/projects.ts'
import { fetchGithubProjects, getLocalProjectFallback } from '../services/github.ts'

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function GithubRepoCard({ project }) {
  return (
    <article className="project-card github-project-card">
      {project.screenshots?.[0] ? (
        <div className="project-image-wrap">
          <img
            src={project.screenshots[0]}
            alt={`Primary screenshot for ${project.title}`}
            className="project-image"
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : null}
      <div className="project-body">
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        <div className="tag-list" aria-label="Repository tags">
          {project.tags.map((tag) => (
            <span key={`${project.repoUrl}-${tag}`} className="tag">
              {tag}
            </span>
          ))}
        </div>
        <p className="small-text github-repo-meta">★ {project.stars} · Updated {formatDate(project.updatedAt)}</p>
        {project.slug ? (
          <Link to={`/projects/${project.slug}`} className="text-link project-card-link">
            View case study →
          </Link>
        ) : (
          <a href={project.repoUrl} className="text-link" target="_blank" rel="noreferrer noopener">
            Open repository →
          </a>
        )}
      </div>
    </article>
  )
}

function ProjectsPage() {
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState('All')
  const [showGithubRepos, setShowGithubRepos] = useState(true)
  const [githubProjects, setGithubProjects] = useState([])
  const [fallbackNotice, setFallbackNotice] = useState('')

  useEffect(() => {
    if (!showGithubRepos) return

    let cancelled = false

    async function loadGithubProjects() {
      try {
        const repos = await fetchGithubProjects()
        if (cancelled) return
        setGithubProjects(repos)
        setFallbackNotice('')
      } catch {
        if (cancelled) return
        setGithubProjects(getLocalProjectFallback())
        setFallbackNotice('GitHub repositories are temporarily unavailable. Showing local projects instead.')
      }
    }

    loadGithubProjects()

    return () => {
      cancelled = true
    }
  }, [showGithubRepos])

  const sourceProjects = showGithubRepos ? githubProjects : localProjects

  const tags = useMemo(() => {
    const all = sourceProjects.flatMap((project) => project.tags)
    return ['All', ...new Set(all)]
  }, [sourceProjects])

  const filteredProjects = useMemo(() => {
    return sourceProjects.filter((project) => {
      const matchesTag = activeTag === 'All' || project.tags.includes(activeTag)
      const matchesSearch =
        project.title.toLowerCase().includes(search.toLowerCase()) ||
        project.summary.toLowerCase().includes(search.toLowerCase())

      return matchesTag && matchesSearch
    })
  }, [activeTag, search, sourceProjects])

  return (
    <>
      <Seo
        title="Projects"
        description="Browse project case studies by keyword and technology tags."
        path="/projects"
      />
      <section>
        <h1>Projects</h1>
        <p>Use filters to find relevant case studies quickly.</p>
      </section>

      <section className="filters" aria-label="Project filters">
        <label className="github-toggle-label" htmlFor="github-toggle">
          <input
            id="github-toggle"
            type="checkbox"
            checked={showGithubRepos}
            onChange={(event) => {
              setShowGithubRepos(event.target.checked)
              setActiveTag('All')
            }}
          />
          Show GitHub repos
        </label>

        {fallbackNotice ? <p className="small-text github-fallback-notice">{fallbackNotice}</p> : null}

        <label htmlFor="project-search" className="visually-hidden">
          Search projects
        </label>
        <input
          id="project-search"
          type="search"
          placeholder={showGithubRepos ? 'Search repositories' : 'Search projects'}
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
          {filteredProjects.map((project) =>
            showGithubRepos ? (
              <GithubRepoCard key={project.repoUrl} project={project} />
            ) : (
              <ProjectCard key={project.slug} project={project} />
            ),
          )}
        </div>
        {filteredProjects.length === 0 ? <p>No projects match your filters.</p> : null}
      </section>
    </>
  )
}

export default ProjectsPage
