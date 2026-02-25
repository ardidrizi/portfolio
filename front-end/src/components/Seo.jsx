import { useEffect } from 'react'

const SITE_NAME = 'Portfolio'
const DEFAULT_DESCRIPTION =
  'Personal portfolio showcasing projects, process, and engineering outcomes.'
const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80'

const upsertMeta = (attribute, key, content) => {
  const selector = `meta[${attribute}="${key}"]`
  let tag = document.head.querySelector(selector)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function Seo({ title, description = DEFAULT_DESCRIPTION, image = DEFAULT_IMAGE, path = '' }) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`
    const canonical = `https://example.com${path}`

    document.title = fullTitle
    upsertMeta('name', 'description', description)
    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:site_name', SITE_NAME)
    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:image', image)
    upsertMeta('property', 'og:url', canonical)
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', image)

    let canonicalTag = document.head.querySelector('link[rel="canonical"]')
    if (!canonicalTag) {
      canonicalTag = document.createElement('link')
      canonicalTag.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalTag)
    }
    canonicalTag.setAttribute('href', canonical)
  }, [title, description, image, path])

  return null
}

export default Seo
