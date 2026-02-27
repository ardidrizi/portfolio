export type ProjectSectionKey =
  | 'overview'
  | 'problem'
  | 'target'
  | 'solution'
  | 'roleAndTeam'
  | 'contributions'
  | 'keyFeatures'
  | 'architecture'
  | 'challenges'
  | 'results'
  | 'links'

export type ProjectSection = {
  title: string
  content: string[]
}

export type Project = {
  id: string
  owner: string
  repo: string
  title: string
  summary: string
  description: string
  repoUrl: string
  homepageUrl: string | null
  stars: number
  updatedAt: string
  tags: string[]
  defaultBranch: string
  sections: Record<ProjectSectionKey, ProjectSection>
}

export const PROJECT_SECTION_ORDER: ProjectSectionKey[] = [
  'overview',
  'problem',
  'target',
  'solution',
  'roleAndTeam',
  'contributions',
  'keyFeatures',
  'architecture',
  'challenges',
  'results',
  'links',
]

export function getProjectRoute(project: Pick<Project, 'owner' | 'repo'>): string {
  return `/projects/${project.owner}/${project.repo}`
}
