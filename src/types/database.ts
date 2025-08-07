export interface Experience {
  id: string
  title: string
  description: string
  project_number: number
  created_at: string
  updated_at: string
}

export interface Media {
  id: string
  title: string
  description: string
  file_url: string
  file_type: 'image' | 'video'
  file_size: number
  created_at: string
  updated_at: string
}

export interface Admin {
  id: string
  email: string
  role: 'admin'
  created_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  company?: string
  message: string
  created_at: string
  read: boolean
} 