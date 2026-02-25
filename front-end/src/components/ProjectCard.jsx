import { Link } from '../lib/router.jsx'

function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <div className="project-image-wrap">
        <img
          src={project.image}
          alt={`Preview of ${project.title}`}
          className="project-image"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="project-body">
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        <div className="tag-list" aria-label="Project tags">
          {project.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
        <Link to={`/projects/${project.slug}`} className="text-link project-card-link">
          View case study →
        </Link>
      </div>
    </article>
  )
}

export default ProjectCard
