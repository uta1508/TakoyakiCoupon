# Gallery Section and Page Implementation

This plan details the addition of a Gallery feature to the marketing homepage, a dedicated Gallery page, and an admin interface for uploading images.

## User Review Required

> [!IMPORTANT]
> **Supabase Setup Required**
> Since we will be storing uploaded image files, you will need to create a Storage Bucket in your Supabase dashboard.
> 1. Go to your Supabase Dashboard -> Storage
> 2. Click "New Bucket"
> 3. Name it exactly: `gallery`
> 4. **Check the "Public bucket" toggle** (so anyone can view the images)
> 5. Click Save.

## Proposed Changes

### `src/app/page.tsx` (Homepage)
- [MODIFY] Change the `CONCEPT` link in the header navigation to `GALLERY` and link it to `/gallery`.
- [MODIFY] Insert a new `GALLERY` section right above the `INFORMATION` section.
- [MODIFY] The `GALLERY` section will fetch the latest 6 images from the `gallery` Supabase Storage bucket and display them in a beautiful masonry/grid layout.
- [MODIFY] Add a "View All" button below the grid that navigates to `/gallery`.

### `src/components/MobileMenu.tsx`
- [MODIFY] Change the `CONCEPT` link to `GALLERY` and update the `href` to `/gallery`.

### `src/app/gallery/page.tsx`
- [NEW] Create a new page dedicated to the gallery.
- [NEW] Fetch all images from the `gallery` bucket, sort them by upload date (newest first).
- [NEW] Display images in a clean, masonry-style grid layout similar to the provided reference image.

### `src/app/admin/dashboard/page.tsx`
- [MODIFY] Add a "Gallery Management" section.
- [MODIFY] Provide a file input for admins to select and upload photos.
- [MODIFY] Call a new API endpoint to upload the image to Supabase Storage.
- [MODIFY] Show a list/grid of uploaded images with a "Delete" button for each.

### `src/app/api/admin/gallery/route.ts`
- [NEW] Create an API endpoint for uploading and deleting gallery images securely using the Supabase Service Role key.

## Verification Plan
1. Ensure the user creates the `gallery` bucket.
2. Upload an image via the admin dashboard and verify it appears.
3. Verify the image appears on the homepage (up to 6).
4. Verify the image appears on the `/gallery` page.
5. Delete the image via admin dashboard and verify it disappears.
