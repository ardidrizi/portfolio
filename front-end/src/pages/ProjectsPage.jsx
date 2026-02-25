import { useMemo, useState } from 'react'
import Seo from '../components/Seo.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import { projects } from '../data/projects.ts'

function ProjectsPage() {
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState('All')

  const tags = useMemo(() => {
    const all = projects.flatMap((project) => project.tags)
    return ['All', ...new Set(all)]
  }, [])

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesTag = activeTag === 'All' || project.tags.includes(activeTag)
      const matchesSearch =
        project.title.toLowerCase().includes(search.toLowerCase()) ||
        project.summary.toLowerCase().includes(search.toLowerCase())

      return matchesTag && matchesSearch
    })
  }, [activeTag, search])

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
        <label htmlFor="project-search" className="visually-hidden">
          Search projects
        </label>
        <input
          id="project-search"
          type="search"
          placeholder="Search projects"
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
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
        {filteredProjects.length === 0 ? <p>No projects match your filters.</p> : null}
      </section>
    </>
  )
}

export default ProjectsPage
