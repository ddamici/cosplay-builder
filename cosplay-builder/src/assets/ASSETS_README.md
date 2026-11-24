# Assets Directory Structure

This directory contains all images and static assets for the Cosplay Builder application.

## Directory Structure

```
src/assets/
├── gloves.webp                      # ✅ Real image - Fingerless Gloves
├── placeholders/                    # Placeholder images for outfit pieces
│   ├── jumpsuit-white.webp          # ⏳ TODO
│   ├── vest-tactical.webp           # ⏳ TODO
│   ├── belt-utility.webp            # ⏳ TODO
│   ├── boots-white.webp             # ⏳ TODO
│   ├── boots-black.webp             # ⏳ TODO
│   ├── holster.webp                 # ⏳ TODO
│   ├── wig-blonde.webp              # ⏳ TODO
│   ├── bodysuit-black.webp          # ⏳ TODO
│   └── default-costume-piece.webp   # ⏳ TODO - Generic fallback
└── ASSETS_README.md                 # This file
```

## Current Status

### ✅ Completed
- **gloves.webp** - Fingerless gloves image (real product photo)

### ⏳ Needed Placeholder Images

The following placeholder images are referenced in `src/data/outfitPieceImages.js` but not yet created:

1. **jumpsuit-white.webp** - White tactical jumpsuit
2. **vest-tactical.webp** - Black tactical vest
3. **belt-utility.webp** - Utility belt with pouches
4. **boots-white.webp** - White lace-up boots
5. **boots-black.webp** - Black tactical boots
6. **holster.webp** - Leg holster
7. **wig-blonde.webp** - Short blonde wig
8. **bodysuit-black.webp** - Black bodysuit
9. **default-costume-piece.webp** - Generic "costume piece" icon

## Image Specifications

### Recommended Format
- **Format**: WebP (for best compression and quality)
- **Dimensions**: 400x400px (square)
- **Background**: White or transparent
- **File size**: < 100KB per image

### Where to Get Images
1. **Product photos**: Amazon, Etsy, AliExpress
2. **Stock photos**: Unsplash, Pexels (free commercial use)
3. **AI-generated**: Midjourney, DALL-E, Stable Diffusion
4. **Mock images**: Figma, Canva

## How to Add New Images

### 1. Add the file
Place your image in the appropriate directory:
```bash
# Real product images
/src/assets/your-image.webp

# Placeholder/reference images
/src/assets/placeholders/your-image.webp
```

### 2. Update the mapping
Edit `src/data/outfitPieceImages.js`:
```javascript
const outfitPieceImages = {
  "Your Piece Name": "/src/assets/placeholders/your-image.webp",
  // ...
};
```

### 3. Add purchase links (optional)
```javascript
export const outfitPieceLinks = {
  "Your Piece Name": [
    { vendor: "Amazon", url: "https://...", price: 29.99 },
  ],
};
```

## Current Behavior

When viewing outfit components:
- **Fingerless Gloves**: Shows real product image ✅
- **All other pieces**: Shows placeholder icon with "Coming Soon" text ⏳

## Future Enhancement

Once you have real product images, the UI will automatically display them with:
- 80x80px preview in the outfit table
- Hover effects
- Mobile-responsive cards
- Purchase links underneath

## File Naming Convention

Use kebab-case with descriptive names:
```
✅ Good: wig-blonde.webp, boots-white.webp, vest-tactical.webp
❌ Bad: image1.webp, photo.jpg, IMG_1234.png
```

## Notes

- The UI is already set up to display these images once they're added
- Currently only the Fingerless Gloves image (`gloves.webp`) exists
- All other pieces show a fallback icon until images are added
- The app will work fine without placeholder images - they're cosmetic enhancements

---

**Last Updated**: November 9, 2026
