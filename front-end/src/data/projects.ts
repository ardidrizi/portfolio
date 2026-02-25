export type Project = {
  slug: string
  repoName: string
  title: string
  summary: string
  tags: string[]
  screenshots: string[]
  demoUrl: string
  repoUrl: string
  problem: string
  solution: string
  stack: string[]
  features: string[]
  challenges: string[]
  results: string[]
  featured: boolean
}

export const projects: Project[] = [
  {
    slug: 'saas-analytics-dashboard',
    repoName: 'saas-analytics-dashboard',
    title: 'SaaS Analytics Dashboard',
    summary: 'A product analytics dashboard that unifies adoption, retention, and revenue insights into one decision workspace.',
    screenshots: [
      'https://images.unsplash.com/photo-1551281044-8b9a4f5f4d7c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=1200&q=80',
    ],
    tags: ['React', 'TypeScript', 'Data Visualization'],
    demoUrl: 'https://example.com/demo/saas-analytics-dashboard [PLACEHOLDER]',
    repoUrl: 'https://github.com/ardidrizi/saas-analytics-dashboard [PLACEHOLDER]',
    problem:
      'Product and growth teams were pulling KPIs from three disconnected tools, which made weekly planning slow and metrics inconsistent between teams.',
    solution:
      'Built a unified analytics surface with reusable metric cards, cohort and funnel visualizations, and role-specific dashboards for product, marketing, and leadership.',
    stack: ['React', 'Vite', 'TypeScript', 'Chart.js', 'Node.js', 'PostgreSQL'],
    features: [
      'Saved segments and custom date ranges for rapid drill-downs',
      'Automated weekly KPI email digests for stakeholders',
      'Cohort retention and funnel conversion analysis views',
      'CSV and PNG export for executive reporting',
    ],
    challenges: [
      'Rendering large event datasets without blocking the UI on lower-end laptops',
      'Keeping KPI definitions consistent across product and marketing teams',
      'Designing visualizations that were useful for both analysts and non-technical stakeholders',
    ],
    results: [
      'Reduced weekly reporting effort by 60%',
      'Improved planning meeting prep time from half-day to under one hour',
      'Increased dashboard adoption to 4 teams within the first month',
    ],
    featured: true,
  },
  {
    slug: 'commerce-redesign-system',
    repoName: 'commerce-redesign-system',
    title: 'Commerce Redesign System',
    summary: 'A modular storefront and design system overhaul focused on accessibility, speed, and conversion lift.',
    screenshots: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
    ],
    tags: ['Design System', 'Accessibility', 'E-commerce'],
    demoUrl: 'https://example.com/demo/commerce-redesign-system [PLACEHOLDER]',
    repoUrl: 'https://github.com/ardidrizi/commerce-redesign-system [PLACEHOLDER]',
    problem:
      'Legacy storefront templates had inconsistent spacing, interaction behavior, and poor mobile usability, leading to friction throughout browsing and checkout.',
    solution:
      'Created a token-driven UI system and migrated high-impact pages first, introducing reusable components, accessibility guardrails, and mobile-first templates.',
    stack: ['React', 'Storybook', 'SCSS', 'Figma', 'Lighthouse CI'],
    features: [
      'Reusable product card, filtering, and cart components',
      'Semantic form patterns with improved error messaging and keyboard support',
      'Theme tokens for color, typography, spacing, and elevation',
      'Component documentation and usage examples in Storybook',
    ],
    challenges: [
      'Incrementally replacing legacy templates without interrupting merchandising campaigns',
      'Aligning design and engineering on component API boundaries',
      'Maintaining visual consistency while allowing page-level flexibility',
    ],
    results: [
      'Increased mobile conversion by 18%',
      'Cut UI regressions found in QA by 35%',
      'Reduced average page weight on product listing pages by 22%',
    ],
    featured: true,
  },
  {
    slug: 'developer-portfolio-platform',
    repoName: 'portfolio',
    title: 'Developer Portfolio Platform',
    summary: 'A portfolio framework with reusable case-study sections and SEO defaults for faster publishing.',
    screenshots: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=1200&q=80',
    ],
    tags: ['Portfolio', 'SEO', 'Content Architecture'],
    demoUrl: 'https://example.com/demo/portfolio-platform [PLACEHOLDER]',
    repoUrl: 'https://github.com/ardidrizi/portfolio [PLACEHOLDER]',
    problem:
      'Publishing project updates required repetitive page composition and manual metadata entry, resulting in inconsistent structure and slower iteration.',
    solution:
      'Implemented a data-driven case-study model, route-based detail pages, and centralized SEO helpers so new projects can be published with predictable quality.',
    stack: ['React', 'Vite', 'TypeScript', 'Custom Router', 'ESLint'],
    features: [
      'Reusable project card and detail page layout for consistent storytelling',
      'Project filtering by tags and text search on the listing page',
      'Case-study metadata support for social sharing previews',
      'GitHub repository integration with graceful fallback',
    ],
    challenges: [
      'Supporting both curated local case studies and live GitHub repository data',
      'Balancing concise portfolio browsing with deep-dive technical storytelling',
      'Keeping the content model extensible for future media and metrics',
    ],
    results: [
      'Reduced time to publish a new project page to under 15 minutes',
      'Improved consistency across case-study page structure and metadata',
      'Created a scalable baseline for adding richer project narratives',
    ],
    featured: true,
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}

export function getProjectByRepoName(repoName: string): Project | undefined {
  const normalized = repoName.trim().toLowerCase()
  return projects.find((project) => project.repoName.toLowerCase() === normalized)
}
