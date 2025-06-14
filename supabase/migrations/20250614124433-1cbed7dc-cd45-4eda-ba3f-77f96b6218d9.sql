
-- Create a public storage bucket for recipe images
INSERT INTO storage.buckets (id, name, public)
VALUES ('recipe-images', 'recipe-images', true);

-- RLS policy to allow anyone to view images in the bucket
CREATE POLICY "Public read access for recipe images"
ON storage.objects FOR SELECT
USING (bucket_id = 'recipe-images');

-- RLS policy to allow anyone to upload to the bucket.
-- For a production app, you'd likely want to restrict this to authenticated users.
CREATE POLICY "Allow authenticated users to upload recipe images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'recipe-images');

