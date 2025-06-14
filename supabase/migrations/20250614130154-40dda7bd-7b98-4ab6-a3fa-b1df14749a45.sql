
-- Add UPDATE and DELETE policies for recipe images to allow replacing them.

-- Allow authenticated users to update their own images
CREATE POLICY "Allow authenticated update for recipe images"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'recipe-images' AND auth.uid() = owner );

-- Allow authenticated users to delete their own images
CREATE POLICY "Allow authenticated delete for recipe images"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'recipe-images' AND auth.uid() = owner );
