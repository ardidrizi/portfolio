import Seo from '../components/Seo.jsx'

function ResumePage() {
  return (
    <>
      <Seo
        title="Resume"
        description="Highlights of experience, achievements, and technical expertise."
        path="/resume"
      />
      <section>
        <h1>Resume</h1>
        <p>Use this page for a concise experience summary and downloadable PDF link.</p>
        <a href="#" className="button" aria-disabled="true">
          Download Resume (placeholder)
        </a>
      </section>
    </>
  )
}

export default ResumePage
