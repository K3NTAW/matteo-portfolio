-- Set up storage bucket for media uploads
-- Run this in your Supabase SQL Editor

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-media',
  'portfolio-media',
  true,
  52428800, -- 50MB file size limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
) ON CONFLICT (id) DO NOTHING;

-- Create storage policies for the bucket
-- Allow public read access
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-media');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'portfolio-media'
);

-- Allow authenticated users to update their uploads
CREATE POLICY "Users can update own uploads" ON storage.objects FOR UPDATE USING (
  bucket_id = 'portfolio-media'
);

-- Allow authenticated users to delete their uploads
CREATE POLICY "Users can delete own uploads" ON storage.objects FOR DELETE USING (
  bucket_id = 'portfolio-media'
); 