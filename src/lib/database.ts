import { supabase } from './supabase'
import { Experience, Media, ContactMessage, AdminProfile, AboutContent, Admin, DockApp } from '@/types/database'

// Experience functions
export async function getExperiences(): Promise<Experience[]> {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .order('project_number', { ascending: true })

  if (error) throw error
  return data || []
}

export async function createExperience(experience: Omit<Experience, 'id' | 'created_at' | 'updated_at'>): Promise<Experience> {
  const { data, error } = await supabase
    .from('experiences')
    .insert(experience)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateExperience(id: string, updates: Partial<Experience>): Promise<Experience> {
  const { data, error } = await supabase
    .from('experiences')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteExperience(id: string): Promise<void> {
  const { error } = await supabase
    .from('experiences')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting experience:', error);
    throw error;
  }
}

// Media functions
export async function getMedia(): Promise<Media[]> {
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getMediaByType(fileType: 'image' | 'video'): Promise<Media[]> {
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .eq('file_type', fileType)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function createMedia(media: Omit<Media, 'id' | 'created_at' | 'updated_at'>): Promise<Media> {
  const { data, error } = await supabase
    .from('media')
    .insert(media)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateMedia(id: string, updates: Partial<Media>): Promise<Media> {
  const { data, error } = await supabase
    .from('media')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteMedia(id: string): Promise<void> {
  const { error } = await supabase
    .from('media')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting media:', error);
    throw error;
  }
}

// Contact message functions
export async function createContactMessage(message: Omit<ContactMessage, 'id' | 'created_at' | 'read'>): Promise<ContactMessage> {
  const { data, error } = await supabase
    .from('contact_messages')
    .insert(message)
    .select()
    .single()

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }
  return data
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function markMessageAsRead(id: string): Promise<ContactMessage> {
  const { data, error } = await supabase
    .from('contact_messages')
    .update({ read: true })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteContactMessage(id: string): Promise<void> {
  const { error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting contact message:', error);
    throw error;
  }
}

// File upload functions
export async function uploadFile(file: File, bucket: string = 'portfolio-media'): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `${bucket}/${fileName}`

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file)

  if (error) throw error

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return data.publicUrl
}

export async function deleteFile(filePath: string, bucket: string = 'portfolio-media'): Promise<void> {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath])

  if (error) throw error
}

// Admin Profile functions
export async function getAdminProfile(): Promise<AdminProfile | null> {
  const { data, error } = await supabase
    .from('admin_profiles')
    .select('*')
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
  return data
}

export async function createAdminProfile(profile: Omit<AdminProfile, 'id' | 'created_at' | 'updated_at'>): Promise<AdminProfile> {
  const { data, error } = await supabase
    .from('admin_profiles')
    .insert(profile)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateAdminProfile(id: string, updates: Partial<AdminProfile>): Promise<AdminProfile> {
  const { data, error } = await supabase
    .from('admin_profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteAdminProfile(id: string): Promise<void> {
  const { error } = await supabase
    .from('admin_profiles')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// About Content functions
export async function getAboutContent(): Promise<AboutContent | null> {
  const { data, error } = await supabase
    .from('about_content')
    .select('*')
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
  return data
}

export async function createAboutContent(content: Omit<AboutContent, 'id' | 'created_at' | 'updated_at'>): Promise<AboutContent> {
  const { data, error } = await supabase
    .from('about_content')
    .insert(content)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateAboutContent(id: string, updates: Partial<AboutContent>): Promise<AboutContent> {
  const { data, error } = await supabase
    .from('about_content')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteAboutContent(id: string): Promise<void> {
  const { error } = await supabase
    .from('about_content')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Authentication functions
export async function authenticateAdmin(email: string, password: string): Promise<Admin | null> {
  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !data) return null

  // In a real app, you'd use bcrypt or similar for password hashing
  // For now, we'll do a simple comparison (NOT recommended for production)
  if (data.password_hash === password) {
    return data
  }

  return null
}

// Dock Apps functions
export async function getDockApps(): Promise<DockApp[]> {
  const { data, error } = await supabase
    .from('dock_apps')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) throw error
  return data || []
}

export async function getAllDockApps(): Promise<DockApp[]> {
  const { data, error } = await supabase
    .from('dock_apps')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw error
  return data || []
}

export async function createDockApp(app: Omit<DockApp, 'id' | 'created_at' | 'updated_at'>): Promise<DockApp> {
  const { data, error } = await supabase
    .from('dock_apps')
    .insert(app)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateDockApp(id: string, updates: Partial<DockApp>): Promise<DockApp> {
  const { data, error } = await supabase
    .from('dock_apps')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteDockApp(id: string): Promise<void> {
  const { error } = await supabase
    .from('dock_apps')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting dock app:', error);
    throw error;
  }
} 