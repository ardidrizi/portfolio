import { Link } from '../lib/router.jsx'
import Seo from '../components/Seo.jsx'

function ResumePage() {
  return (
    <>
      <Seo
        title="Resume"
        description="Download my resume and learn more about my experience across product-focused engineering roles."
        path="/resume"
      />
      <section>
        <h1>Resume</h1>
        <p>
          Looking for a concise overview of my experience, project impact, and technical strengths? Download the PDF
          below.
        </p>
        <a href="/resume-placeholder.pdf" className="button primary" download>
          Download Resume PDF (placeholder)
        </a>
        <p className="small-text">
          Replace <code>/public/resume-placeholder.pdf</code> with your final resume file before production release.
        </p>
      </section>

      <section className="cta-block">
        <h2>Want to discuss a role or project?</h2>
        <p>I&apos;m open to freelance and full-time opportunities.</p>
        <Link className="button" to="/contact">
          Contact Me
        </Link>
      </section>
    </>
  )
}

export default ResumePage
