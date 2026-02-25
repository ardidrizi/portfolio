export const projects = [
  {
    slug: 'saas-analytics-dashboard',
    title: 'SaaS Analytics Dashboard',
    summary: 'A product analytics dashboard that unifies adoption, retention, and revenue insights.',
    image:
      'https://images.unsplash.com/photo-1551281044-8b9a4f5f4d7c?auto=format&fit=crop&w=1200&q=80',
    tags: ['React', 'TypeScript', 'Data Viz'],
    problem:
      'Product and growth teams had metrics spread across multiple tools, making weekly reporting slow and inconsistent.',
    solution:
      'Designed a centralized dashboard with customizable segments, KPI snapshots, and exportable reports for stakeholders.',
    stack: ['React', 'Vite', 'TypeScript', 'Chart.js', 'Node.js'],
    features: [
      'Role-specific dashboards for product, marketing, and leadership',
      'Saved filters and automated weekly summary emails',
      'Event funnel and cohort retention visualizations',
    ],
    challenges:
      'Balancing large datasets with fast rendering and preserving clear information hierarchy for non-technical users.',
    results:
      'Cut reporting time by 60% and improved decision cycle speed for weekly product planning.',
    links: {
      demo: '#',
      repo: '#',
    },
    featured: true,
  },
  {
    slug: 'ecommerce-redesign-system',
    title: 'E-commerce Redesign System',
    summary: 'A modular UI system and storefront redesign focused on conversion and accessibility.',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    tags: ['Design System', 'Accessibility', 'Commerce'],
    problem:
      'Inconsistent UI patterns and poor mobile usability were hurting conversion rates across key product pages.',
    solution:
      'Built a component library with standardized spacing, typography, and semantic patterns across the shopping funnel.',
    stack: ['React', 'Storybook', 'SCSS', 'Figma'],
    features: [
      'Reusable product cards, filters, and checkout components',
      'Mobile-first product listing and detail templates',
      'WCAG-focused color and keyboard interaction updates',
    ],
    challenges:
      'Migrating legacy templates incrementally while preserving active merchandising workflows.',
    results:
      'Increased mobile conversion by 18% and reduced UI defects reported by QA.',
    links: {
      demo: '#',
      repo: '#',
    },
    featured: true,
  },
  {
    slug: 'developer-portfolio-platform',
    title: 'Developer Portfolio Platform',
    summary: 'A portfolio framework enabling fast project publishing and SEO-friendly case studies.',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    tags: ['Portfolio', 'SEO', 'Content'],
    problem:
      'Publishing new projects required repeated manual layout work and inconsistent metadata setup.',
    solution:
      'Created a data-driven architecture with reusable case-study sections and centralized SEO defaults.',
    stack: ['React', 'Vite', 'React Router', 'React Helmet Async'],
    features: [
      'Route-based pages with reusable layout shell',
      'Project detail templates powered by local data',
      'OpenGraph and metadata support for each page',
    ],
    challenges:
      'Keeping authoring flexible while maintaining consistent visual structure across all project entries.',
    results:
      'Reduced time-to-publish for new projects and improved share previews on social platforms.',
    links: {
      demo: '#',
      repo: '#',
    },
    featured: false,
  },
]
