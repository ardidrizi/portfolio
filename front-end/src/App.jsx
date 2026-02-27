import Layout from './components/Layout.jsx'
import HomePage from './pages/HomePage.jsx'
import ProjectsPage from './pages/ProjectsPage.jsx'
import ProjectDetailPage from './pages/ProjectDetailPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ResumePage from './pages/ResumePage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import { useRouter } from './lib/router.jsx'

function App() {
  const { pathname } = useRouter()

  let page = <NotFoundPage />

  if (pathname === '/') page = <HomePage />
  if (pathname === '/projects') page = <ProjectsPage />
  if (/^\/projects\/[^/]+\/[^/]+$/.test(pathname)) page = <ProjectDetailPage />
  if (pathname === '/about') page = <AboutPage />
  if (pathname === '/resume') page = <ResumePage />
  if (pathname === '/contact') page = <ContactPage />

  return <Layout>{page}</Layout>
}

export default App
