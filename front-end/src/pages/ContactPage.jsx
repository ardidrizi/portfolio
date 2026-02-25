import Seo from '../components/Seo.jsx'

function ContactPage() {
  return (
    <>
      <Seo
        title="Contact"
        description="Get in touch to discuss freelance, full-time, or collaboration opportunities."
        path="/contact"
      />
      <section>
        <h1>Contact</h1>
        <p>Send a message and I&apos;ll respond soon.</p>
        <form className="contact-form">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" required />

          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required />

          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows="5" required />

          <button className="button primary" type="submit">
            Send
          </button>
        </form>
      </section>
    </>
  )
}

export default ContactPage
