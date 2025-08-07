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
  password_hash: string
  role: 'admin'
  created_at: string
}

export interface AdminProfile {
  id: string
  name: string
  position: string
  slogan: string
  profile_picture_url: string
  created_at: string
  updated_at: string
}

export interface AboutContent {
  id: string
  content: string
  image_url: string
  created_at: string
  updated_at: string
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