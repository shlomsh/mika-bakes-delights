

# Migration to Lovable Cloud

Since Lovable Cloud can only be enabled on a new project, the migration involves creating a new project and moving everything over.

## Overview

Your current project has:
- 8 database tables (recipes, categories, and 6 related tables)
- Small dataset: 22 recipes, 3 categories, ~419 related records total
- Auth (login for recipe management)
- Storage (recipe images)
- Frontend code (React + TypeScript)

## Step-by-Step Migration

### Step 1: Create a New Lovable Project with Lovable Cloud
- Create a new project in Lovable
- Enable Lovable Cloud when prompted (this sets up a fresh Supabase-backed backend automatically)

### Step 2: Copy the Frontend Code
- Remix this current project, OR copy the source files into the new project
- The code will work as-is since Lovable Cloud uses the same Supabase JS SDK under the hood

### Step 3: Recreate the Database Schema
- In the new project, ask Lovable to create the same tables:
  - `categories` (name, slug, description, color, icon)
  - `recipes` (name, description, image_url, recommended, category_id)
  - `recipe_ingredients`, `recipe_instructions`, `recipe_sauces`, `recipe_sauce_ingredients`, `recipe_garnish_ingredients`, `recipe_garnish_instructions`
- Set up the same RLS policies and storage bucket (`recipe-images`)

### Step 4: Export and Import Data
- Export data from your current Supabase dashboard (CSV export or SQL dump)
- Import into the new Lovable Cloud database using the Cloud View "Run SQL" feature

### Step 5: Migrate Recipe Images
- Download images from your current Supabase storage bucket
- Re-upload them to the new project's storage bucket
- Update `image_url` references in the recipes table if the URLs change

### Step 6: Verify and Publish
- Test all pages: home, category, recipe detail, create/edit recipe
- Test authentication (login/signup)
- Test image uploads
- Publish the new project and point your custom domain to it

## Important Notes

- **This requires a new Lovable project** -- you cannot convert this existing project
- **Image URLs will change** -- the storage bucket will have a different domain
- **Auth users won't carry over** -- users will need to sign up again on the new project
- Lovable Cloud uses usage-based pricing, which may or may not be cheaper than your current Supabase plan depending on usage

## Estimated Effort

This is a moderate effort migration (~10-15 prompts in the new project) given the small data size. The biggest manual step is re-uploading recipe images.

