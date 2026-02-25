import { projects as localProjects } from '../data/projects.ts'

const GITHUB_USERNAME = 'ardidrizi'
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`

export type Project = {
  title: string
  description: string
  repoUrl: string
  tags: string[]
  stars: number
  updatedAt: string
}

let cachedProjects: Project[] | null = null

function mapLocalProjectsToProjectType(): Project[] {
  return localProjects.map((project) => ({
    title: project.title,
    description: project.summary,
    repoUrl: project.links?.repo ?? '#',
    tags: project.tags,
    stars: 0,
    updatedAt: new Date().toISOString(),
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

function mapRepoToProject(repo: GithubRepo): Project {
  const tags = [repo.language, ...(repo.topics ?? [])].filter(Boolean) as string[]

  if (repo.fork) tags.push('Fork')
  if (repo.archived) tags.push('Archived')

  return {
    title: repo.name,
    description: repo.description ?? 'No description provided.',
    repoUrl: repo.html_url,
    tags: Array.from(new Set(tags)),
    stars: repo.stargazers_count,
    updatedAt: repo.updated_at,
  }
}

export async function fetchGithubProjects(): Promise<Project[]> {
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

export function getLocalProjectFallback(): Project[] {
  return mapLocalProjectsToProjectType()
}
