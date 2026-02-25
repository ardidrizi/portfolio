import { getProjectByRepoName, projects as localProjects, type Project } from '../data/projects.ts'

const GITHUB_USERNAME = 'ardidrizi'
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`

export type ProjectListItem = {
  title: string
  summary: string
  tags: string[]
  repoUrl: string
  stars: number
  updatedAt: string
  slug?: string
  screenshots?: string[]
  caseStudy?: Project
}

let cachedProjects: ProjectListItem[] | null = null

function mapLocalProjectsToProjectType(): ProjectListItem[] {
  return localProjects.map((project) => ({
    title: project.title,
    summary: project.summary,
    repoUrl: project.repoUrl,
    tags: project.tags,
    stars: 0,
    updatedAt: new Date().toISOString(),
    slug: project.slug,
    screenshots: project.screenshots,
    caseStudy: project,
  }))
}

type GithubRepo = {
  name: string
  description: string | null
  html_url: string
  language: string | null
  topics?: string[]
  stargazers_count: number
  updated_at: string
  fork: boolean
  archived: boolean
}

function mapRepoToProject(repo: GithubRepo): ProjectListItem {
  const tags = [repo.language, ...(repo.topics ?? [])].filter(Boolean) as string[]

  if (repo.fork) tags.push('Fork')
  if (repo.archived) tags.push('Archived')

  const caseStudy = getProjectByRepoName(repo.name)

  return {
    title: caseStudy?.title ?? repo.name,
    summary: caseStudy?.summary ?? repo.description ?? 'No description provided.',
    repoUrl: repo.html_url,
    tags: Array.from(new Set([...(caseStudy?.tags ?? []), ...tags])),
    stars: repo.stargazers_count,
    updatedAt: repo.updated_at,
    slug: caseStudy?.slug,
    screenshots: caseStudy?.screenshots,
    caseStudy,
  }
}

export async function fetchGithubProjects(): Promise<ProjectListItem[]> {
  if (cachedProjects) return cachedProjects

  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
  }

  const token = import.meta.env.VITE_GITHUB_TOKEN
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(GITHUB_API_URL, { headers })
  if (!response.ok) {
    throw new Error(`GitHub request failed with status ${response.status}`)
  }

  const repos: GithubRepo[] = await response.json()
  const mapped = repos.map(mapRepoToProject)

  cachedProjects = mapped

  return mapped
}

export function getLocalProjectFallback(): ProjectListItem[] {
  return mapLocalProjectsToProjectType()
}
