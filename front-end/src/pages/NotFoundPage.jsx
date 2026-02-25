import { Link } from '../lib/router.jsx'
import Seo from '../components/Seo.jsx'

function NotFoundPage() {
  return (
    <section>
      <Seo title="Not Found" description="The requested page was not found." />
      <h1>404</h1>
      <p>Sorry, this page does not exist.</p>
      <Link to="/" className="text-link">
        Go home
      </Link>
    </section>
  )
}

export default NotFoundPage
