import { type Project, type ProjectSectionKey } from '../data/projects.ts'

const GITHUB_USERNAME = 'ardidrizi'
const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql'
const GITHUB_REPOS_FALLBACK_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=4&sort=updated`

const SECTION_TITLES: Record<ProjectSectionKey, string> = {
  overview: 'Overview',
  problem: 'Problem',
  target: 'Target',
  solution: 'Solution',
  roleAndTeam: 'Role & Team',
  contributions: 'Contributions',
  keyFeatures: 'Key Features',
  architecture: 'Architecture',
  challenges: 'Challenges',
  results: 'Results',
  links: 'Links',
}

const SECTION_HEADING_MAP: Record<string, ProjectSectionKey> = {
  overview: 'overview',
  problem: 'problem',
  target: 'target',
  'target users': 'target',
  solution: 'solution',
  'role & team': 'roleAndTeam',
  'role and team': 'roleAndTeam',
  contributions: 'contributions',
  'key features': 'keyFeatures',
  architecture: 'architecture',
  challenges: 'challenges',
  results: 'results',
  links: 'links',
}

type PinnedRepo = {
  name: string
  description: string | null
  url: string
  homepageUrl: string | null
  stargazerCount: number
  updatedAt: string
  owner: { login: string }
  defaultBranchRef: { name: string } | null
  repositoryTopics: { nodes: Array<{ topic: { name: string } }> }
}

type PublicRepo = {
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  stargazers_count: number
  updated_at: string
  owner: { login: string }
  default_branch: string
  topics?: string[]
}

let projectsCache: Project[] | null = null
let loadPromise: Promise<{ projects: Project[]; notice: string | null }> | null = null

function createEmptySections() {
  return {
    overview: { title: SECTION_TITLES.overview, content: [] },
    problem: { title: SECTION_TITLES.problem, content: [] },
    target: { title: SECTION_TITLES.target, content: [] },
    solution: { title: SECTION_TITLES.solution, content: [] },
    roleAndTeam: { title: SECTION_TITLES.roleAndTeam, content: [] },
    contributions: { title: SECTION_TITLES.contributions, content: [] },
    keyFeatures: { title: SECTION_TITLES.keyFeatures, content: [] },
    architecture: { title: SECTION_TITLES.architecture, content: [] },
    challenges: { title: SECTION_TITLES.challenges, content: [] },
    results: { title: SECTION_TITLES.results, content: [] },
    links: { title: SECTION_TITLES.links, content: [] },
  }
}

function normalizeHeading(value: string): string {
  return value.trim().toLowerCase().replace(/[:#]+$/g, '')
}

function safeArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
}

function parseCaseStudyJson(jsonText: string, fallbackSummary: string) {
  const parsed = JSON.parse(jsonText) as Record<string, unknown>
  const sections = createEmptySections()

  const mappedFields: Array<[keyof typeof sections, string[]]> = [
    ['overview', safeArray(parsed.overview)],
    ['problem', safeArray(parsed.problem)],
    ['target', safeArray(parsed.target)],
    ['solution', safeArray(parsed.solution)],
    ['roleAndTeam', safeArray(parsed.roleAndTeam)],
    ['contributions', safeArray(parsed.contributions)],
    ['keyFeatures', safeArray(parsed.keyFeatures)],
    ['architecture', safeArray(parsed.architecture)],
    ['challenges', safeArray(parsed.challenges)],
    ['results', safeArray(parsed.results)],
    ['links', safeArray(parsed.links)],
  ]

  mappedFields.forEach(([key, values]) => {
    sections[key].content = values
  })

  if (sections.overview.content.length === 0 && fallbackSummary) {
    sections.overview.content = [fallbackSummary]
  }

  return {
    title: typeof parsed.title === 'string' ? parsed.title : undefined,
    summary: typeof parsed.summary === 'string' ? parsed.summary : undefined,
    sections,
  }
}

function parseCaseStudyMarkdown(markdown: string, fallbackSummary: string) {
  const sections = createEmptySections()
  let currentSection: ProjectSectionKey = 'overview'

  for (const rawLine of markdown.split('\n')) {
    const line = rawLine.trim()
    if (!line) continue

    const match = line.match(/^##\s+(.+)$/)
    if (match) {
      const normalized = normalizeHeading(match[1])
      currentSection = SECTION_HEADING_MAP[normalized] ?? currentSection
      continue
    }

    sections[currentSection].content.push(line.replace(/^-\s+/, ''))
  }

  if (sections.overview.content.length === 0 && fallbackSummary) {
    sections.overview.content = [fallbackSummary]
  }

  return { sections }
}

function buildMinimalSections(repo: Pick<Project, 'description' | 'homepageUrl' | 'repoUrl' | 'updatedAt'>) {
  const sections = createEmptySections()
  sections.overview.content = [repo.description || 'No repository description provided.']
  sections.solution.content = ['Detailed case study content is not available in this repository yet.']
  sections.results.content = [`Repository last updated on ${new Date(repo.updatedAt).toLocaleDateString()}.`]
  sections.links.content = [repo.repoUrl, ...(repo.homepageUrl ? [repo.homepageUrl] : [])]
  return sections
}

async function fetchCaseStudy(owner: string, repo: string, branch: string, fallbackSummary: string) {
  const jsonUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/case-study.json`
  const markdownUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/CASE_STUDY.md`

  const jsonResponse = await fetch(jsonUrl)
  if (jsonResponse.ok) {
    const payload = await jsonResponse.text()
    try {
      return parseCaseStudyJson(payload, fallbackSummary)
    } catch {
      return { sections: createEmptySections() }
    }
  }

  const markdownResponse = await fetch(markdownUrl)
  if (markdownResponse.ok) {
    const payload = await markdownResponse.text()
    return parseCaseStudyMarkdown(payload, fallbackSummary)
  }

  return null
}

function toProject(repo: PinnedRepo | PublicRepo): Project {
  const owner = 'owner' in repo ? repo.owner.login : GITHUB_USERNAME
  const name = repo.name
  const tags = 'repositoryTopics' in repo
    ? repo.repositoryTopics.nodes.map((node) => node.topic.name)
    : (repo.topics ?? [])

  return {
    id: `${owner}/${name}`,
    owner,
    repo: name,
    title: name,
    summary: repo.description ?? 'No description provided.',
    description: repo.description ?? '',
    repoUrl: 'url' in repo ? repo.url : repo.html_url,
    homepageUrl: 'homepageUrl' in repo ? repo.homepageUrl : repo.homepage,
    stars: 'stargazerCount' in repo ? repo.stargazerCount : repo.stargazers_count,
    updatedAt: 'updatedAt' in repo ? repo.updatedAt : repo.updated_at,
    tags,
    defaultBranch: 'defaultBranchRef' in repo ? repo.defaultBranchRef?.name ?? 'main' : repo.default_branch,
    sections: createEmptySections(),
  }
}

async function fetchPinnedRepos(token: string): Promise<PinnedRepo[]> {
  const query = `query {
    user(login: "${GITHUB_USERNAME}") {
      pinnedItems(first: 4, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
            description
            url
            homepageUrl
            stargazerCount
            updatedAt
            repositoryTopics(first: 20) {
              nodes {
                topic {
                  name
                }
              }
            }
            owner {
              login
            }
            defaultBranchRef {
              name
            }
          }
        }
      }
    }
  }`

  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })

  if (!response.ok) {
    throw new Error(`GitHub GraphQL request failed with status ${response.status}`)
  }

  const data = await response.json()
  return data.data?.user?.pinnedItems?.nodes ?? []
}

async function fetchPublicRepos(): Promise<PublicRepo[]> {
  const response = await fetch(GITHUB_REPOS_FALLBACK_URL, {
    headers: { Accept: 'application/vnd.github+json' },
  })

  if (!response.ok) {
    throw new Error(`GitHub REST request failed with status ${response.status}`)
  }

  const repos: PublicRepo[] = await response.json()
  return repos.slice(0, 4)
}

export async function fetchProjects(): Promise<{ projects: Project[]; notice: string | null }> {
  if (projectsCache) return { projects: projectsCache, notice: null }
  if (loadPromise) return loadPromise

  loadPromise = (async () => {
    const token = import.meta.env.VITE_GITHUB_TOKEN
    let notice: string | null = null

    const sourceRepos = token
      ? await fetchPinnedRepos(token)
      : await fetchPublicRepos().then((repos) => {
          notice = 'Pinned repositories require VITE_GITHUB_TOKEN. Showing latest public repositories instead.'
          return repos
        })

    const mappedProjects = await Promise.all(
      sourceRepos.map(async (repo) => {
        const project = toProject(repo)
        const caseStudy = await fetchCaseStudy(project.owner, project.repo, project.defaultBranch, project.summary)

        if (!caseStudy) {
          project.sections = buildMinimalSections(project)
          return project
        }

        project.sections = caseStudy.sections
        project.title = caseStudy.title ?? project.title
        project.summary = caseStudy.summary ?? project.summary
        return project
      }),
    )

    projectsCache = mappedProjects
    return { projects: mappedProjects, notice }
  })()

  try {
    return await loadPromise
  } finally {
    loadPromise = null
  }
}

export function clearProjectCache() {
  projectsCache = null
  loadPromise = null
}
