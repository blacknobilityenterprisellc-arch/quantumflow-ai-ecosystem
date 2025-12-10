export interface User {
  id: string
  email: string
  name?: string
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  name: string
  description?: string
  status: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  id: string
  token: string
  userId: string
  expiresAt: Date
  createdAt: Date
}

export interface CreateUserData {
  email: string
  name?: string
}

export interface CreateProjectData {
  name: string
  description?: string
  userId: string
}