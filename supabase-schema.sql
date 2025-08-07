-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create tables
CREATE TABLE IF NOT EXISTS experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  project_number INTEGER NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT CHECK (file_type IN ('image', 'video')) NOT NULL,
  file_size INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role = 'admin'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  slogan TEXT NOT NULL,
  profile_picture_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS about_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_experiences_project_number ON experiences(project_number);
CREATE INDEX IF NOT EXISTS idx_media_file_type ON media(file_type);
CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages(read);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);

-- Enable Row Level Security
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create simple policies - allow all operations (admin panel will handle authentication)
CREATE POLICY "Allow all operations on experiences" ON experiences
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on media" ON media
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on admins" ON admins
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on admin_profiles" ON admin_profiles
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on about_content" ON about_content
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on contact_messages" ON contact_messages
  FOR ALL USING (true) WITH CHECK (true);

-- Create functions for automatic updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_experiences_updated_at 
  BEFORE UPDATE ON experiences 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_updated_at 
  BEFORE UPDATE ON media 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_profiles_updated_at 
  BEFORE UPDATE ON admin_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_about_content_updated_at 
  BEFORE UPDATE ON about_content 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO experiences (title, description, project_number) VALUES
  ('Junior Center B2B Callcenter, Olten', 'Dies war mein erstes Projekt. Ich lernte, wie man mit Kunden umgeht und konnte meine kommunikativen Skills verbessern.', 1),
  ('Junior Center B2B Mediamatik, Zürich/Bern', 'In diesem Projekt lernte ich viel zum Thema Fotografie. Eine meiner Hauptaufgaben war es, Fotoshootings zu machen.', 2),
  ('MMO Multimediateam, Zürich', 'Von dem Videoschneiden bis zum Illustrieren konnte ich in allem Übung sammeln bei MMO.', 3),
  ('Motion, Zürich', 'Dies war mein erstes Projekt. Ich lernte, wie man mit Kunden umgeht und konnte meine kommunikativen Skills verbessern.', 4)
ON CONFLICT (project_number) DO NOTHING;

-- Insert sample admin user (password: admin123)
INSERT INTO admins (email, password_hash, role) VALUES
  ('admin@matteo.com', 'admin123', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Dock Apps table
CREATE TABLE IF NOT EXISTS dock_apps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    app_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    icon_url TEXT NOT NULL,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    image_urls JSONB DEFAULT '[]', -- Array of image URLs
    content_type VARCHAR(20) DEFAULT 'text', -- 'text', 'image', 'mixed', 'gallery'
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for dock apps
CREATE INDEX IF NOT EXISTS idx_dock_apps_active ON dock_apps(is_active);
CREATE INDEX IF NOT EXISTS idx_dock_apps_sort ON dock_apps(sort_order);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_dock_apps_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_dock_apps_updated_at
    BEFORE UPDATE ON dock_apps
    FOR EACH ROW
    EXECUTE FUNCTION update_dock_apps_updated_at();

-- RLS policies for dock_apps
ALTER TABLE dock_apps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on dock_apps" ON dock_apps
    FOR ALL USING (true) WITH CHECK (true);

-- Insert sample dock apps
INSERT INTO dock_apps (app_id, name, icon_url, title, content, sort_order) VALUES
('finder', 'Finder', 'https://cdn.jim-nielsen.com/macos/1024/finder-2021-09-10.png?rf=1024', 'Finder', 'Welcome to Finder!

This is where you can browse and organize your files and folders. 

Key Features:
• Browse files and folders
• Search for items
• Organize your desktop
• Access external drives
• Share files with others

Current Location: Desktop
Items: 12 files, 3 folders', 1),

('calculator', 'Calculator', 'https://cdn.jim-nielsen.com/macos/1024/calculator-2021-04-29.png?rf=1024', 'Calculator', 'Calculator

A simple calculator for basic arithmetic operations.

Functions:
• Addition (+)
• Subtraction (-)
• Multiplication (×)
• Division (÷)
• Percentage (%)
• Square root (√)

Memory: 0
Last calculation: 42 + 8 = 50', 2),

('terminal', 'Terminal', 'https://cdn.jim-nielsen.com/macos/1024/terminal-2021-06-03.png?rf=1024', 'Terminal', 'Terminal - bash

Welcome to the command line interface.

Available commands:
• ls - list files
• cd - change directory
• pwd - print working directory
• mkdir - make directory
• rm - remove files
• cp - copy files
• mv - move files

Current user: matteo
Current directory: ~/Desktop
Last login: Today at 14:30', 3),

('mail', 'Mail', 'https://cdn.jim-nielsen.com/macos/1024/mail-2021-05-25.png?rf=1024', 'Mail', 'Mail

Inbox (3 unread messages)

Recent Messages:
• From: Apple Support
  Subject: Welcome to Mail
  Time: 2 hours ago

• From: GitHub
  Subject: Repository update
  Time: 1 day ago

• From: LinkedIn
  Subject: New connection request
  Time: 3 days ago

Drafts: 1
Sent: 24
Trash: 8', 4),

('notes', 'Notes', 'https://cdn.jim-nielsen.com/macos/1024/notes-2021-05-25.png?rf=1024', 'Notes', 'Notes

My Notes:
• Portfolio Ideas
  - Add more interactive elements
  - Include project showcases
  - Improve mobile responsiveness

• To-Do List
  - Update website content
  - Add new projects
  - Contact potential clients

• Meeting Notes
  - Discuss new design concepts
  - Plan next project phase
  - Review feedback from clients

Total Notes: 15
Last edited: Today at 10:15', 5),

('safari', 'Safari', 'https://cdn.jim-nielsen.com/macos/1024/safari-2021-06-02.png?rf=1024', 'Safari', 'Safari

Current Tab: Portfolio Website

Recent Sites:
• github.com - GitHub
• linkedin.com - LinkedIn
• behance.net - Behance
• dribbble.com - Dribbble

Bookmarks:
• Portfolio Projects
• Design Resources
• Development Tools
• Inspiration Sites

History: 127 pages
Downloads: 3 files
Reading List: 5 items', 6),

('photos', 'Photos', 'https://cdn.jim-nielsen.com/macos/1024/photos-2021-05-28.png?rf=1024', 'Photos', 'Photos

Library Overview:
• All Photos: 1,247
• Recently Added: 23
• Favorites: 89
• Albums: 12

Recent Albums:
• Portfolio Work
• Personal Projects
• Design Inspiration
• Travel Photos

Shared Albums:
• Family Photos
• Work Projects

Storage Used: 2.3 GB
Available Space: 45.7 GB', 7),

('music', 'Music', 'https://cdn.jim-nielsen.com/macos/1024/music-2021-05-28.png?rf=1024', 'Music', 'Music

Now Playing: "Creative Vibes" - Lo-Fi Beats

Library:
• Songs: 1,234
• Albums: 89
• Artists: 156
• Playlists: 23

Recent Playlists:
• Work Focus
• Design Inspiration
• Coding Sessions
• Relaxation

Recently Added:
• "Ambient Works" - Various Artists
• "Productivity Mix" - Curated
• "Creative Flow" - Lo-Fi

Up Next: "Design Process" - Instrumental', 8),

('calendar', 'Calendar', 'https://cdn.jim-nielsen.com/macos/1024/calendar-2021-04-29.png?rf=1024', 'Calendar', 'Calendar

Today''s Events:
• 10:00 AM - Team Meeting
• 2:00 PM - Client Call
• 4:30 PM - Design Review

Upcoming:
• Tomorrow - Project Deadline
• Friday - Portfolio Update
• Next Week - New Project Start

This Month:
• 5 meetings scheduled
• 3 deadlines
• 2 client presentations

Holidays:
• Christmas: Dec 25
• New Year: Jan 1', 9)
ON CONFLICT (app_id) DO NOTHING;
