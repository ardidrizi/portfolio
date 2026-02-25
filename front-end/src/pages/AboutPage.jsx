import Seo from '../components/Seo.jsx'

function AboutPage() {
  return (
    <>
      <Seo
        title="About"
        description="Learn about my background, process, and product mindset."
        path="/about"
      />
      <section>
        <h1>About</h1>
        <p>
          I&apos;m a front-end developer who enjoys simplifying complex workflows into intuitive interfaces.
          I partner with design and product teams to ship polished, measurable features.
        </p>
      </section>
    </>
  )
}

export default AboutPage
