# Testing Guide - Cosplay Builder

## 🚀 Current Status

Your app is running at: **http://localhost:5175/**

---

## ✅ What to Test

### 1. Character Selection Screen

**What you should see:**
- Large "Cosplay Builder" title with gradient purple/pink
- Search bar with magnifying glass icon
- Grid of character cards (9 characters total)
- Each card has an image and character name

**Try this:**
1. Type "yelena" in the search box → Should filter to show only Yelena Belova
2. Click on Yelena's card → Purple border should appear
3. Purple confirmation bar appears at top: "Selected: Yelena Belova"
4. Click "Continue with Yelena Belova" button

---

### 2. Appearance Selection

**What you should see:**
- Back button (top left)
- Yelena's avatar (circular, 100x100px)
- "Choose an Appearance" heading
- Two cards:
  - "Black Widow (2021) - Tactical Gear"
  - "Thunderbolts* (2025) - Tactical Gear"

**Try this:**
1. Click "Black Widow (2021)" card → Border turns pink
2. Page scrolls down to show outfit components

---

### 3. Outfit Components (Desktop View)

**What you should see:**
- "Outfit Components" heading
- Info box: "Selected Appearance: Black Widow (2021) - Tactical Gear"
- **Table with 7 rows** (one per costume piece):
  - Preview column (80x80px images)
  - Piece Name
  - Type (Chip/badge)
  - Estimated Cost
  - Purchase Links (buttons)

**Expected Images:**
- ✅ **Fingerless Gloves**: Shows real product image
- ⏳ **All other pieces**: Shows placeholder icon + "Coming Soon"

**Expected Purchase Links:**
Each piece shows 1-2 buttons:
- "Amazon - $12.99" (contained button)
- "Etsy - $18.99" (outlined button)

**At the bottom:**
- Purple card showing "Estimated Total Cost: $258.98"
- Footnote: "Prices are estimates and may vary"

---

### 4. Mobile View (Resize Browser)

**Try this:**
1. Resize browser window to < 960px wide
2. Character cards should stack (1 per row on small screens)
3. Outfit table disappears, replaced by cards
4. Each outfit piece becomes a card:
   - Image on left (80x80px)
   - Info on right (name, type, price)
   - Purchase buttons below (full width)

---

## 🐛 Known Issues to Expect

### What's NOT an Error:

1. **Most images show "Coming Soon"** ✅ Expected
   - Only Fingerless Gloves has a real image
   - Other pieces need placeholder images added

2. **Hard-coded purchase links** ✅ Expected
   - Links go to Amazon/Etsy searches
   - Will be replaced with database API later

3. **No backend yet** ✅ Expected
   - All data comes from `characters.js`
   - Database schema is designed but not implemented

4. **Console warnings on first load** ✅ Ignore these
   - Old Grid warnings from initial load
   - Will disappear after refresh

---

## 🎨 What Should Look Good

### Character Selection:
- ✅ Smooth hover effects (cards lift up)
- ✅ Selected state (purple border + checkmark)
- ✅ Responsive grid (4 columns → 3 → 2 → 1)
- ✅ Search filters instantly

### Appearance Cards:
- ✅ Radio button changes to checkmark when selected
- ✅ Purple chip shows "Tactical Gear"
- ✅ Hover effect (shadow + lift)

### Outfit Table:
- ✅ Clean Material UI design
- ✅ Alternating row hover effect
- ✅ Purchase buttons with shopping cart icons
- ✅ Price comparison (2 options per piece)

### Mobile Cards:
- ✅ No horizontal scrolling
- ✅ Easy-to-tap buttons
- ✅ Clean spacing
- ✅ Same data, different layout

---

## 🔍 Things to Verify

### Desktop (>960px):
- [ ] Character grid shows 3-4 cards per row
- [ ] Outfit table is visible
- [ ] All 7 outfit pieces show in table
- [ ] Fingerless Gloves shows real image
- [ ] Purchase link buttons work (open in new tab)

### Mobile (<960px):
- [ ] Character grid shows 1 card per row
- [ ] Outfit table is hidden
- [ ] Outfit cards are visible instead
- [ ] Buttons are full width and easy to tap
- [ ] Total cost card is readable

### Functionality:
- [ ] Search filters characters
- [ ] Character selection highlights card
- [ ] Confirmation button appears when character selected
- [ ] Back button returns to character selection
- [ ] Appearance selection shows outfit pieces
- [ ] Purchase links open in new tabs

---

## 🎯 Next Steps to Test

### Add More Images:
1. Find or create placeholder images (400x400px, .webp format)
2. Save them to: `src/assets/placeholders/`
3. Update `src/data/outfitPieceImages.js`:
   ```javascript
   import jumpsuit from '../assets/placeholders/jumpsuit-white.webp';
   
   const outfitPieceImages = {
     "White Jumpsuit": jumpsuit,
     // ...
   };
   ```
4. Refresh browser → Image should appear!

### Update Purchase Links:
Edit `src/data/outfitPieceImages.js`:
```javascript
export const outfitPieceLinks = {
  "White Jumpsuit": [
    { vendor: "Amazon", url: "https://...", price: 89.99 },
    { vendor: "Etsy", url: "https://...", price: 120.00 },
  ],
};
```

### Test Other Characters:
Currently only Yelena has appearances defined. To test others:
1. Open `src/data/characters.js`
2. Add `appearances` array to another character
3. Refresh → That character should now show appearances

---

## 📊 Success Criteria

### You'll know it's working when:
- ✅ Character cards look professional (not plain HTML)
- ✅ Search filters characters instantly
- ✅ Yelena shows 2 appearances (Black Widow & Thunderbolts)
- ✅ Black Widow appearance shows 7 outfit pieces
- ✅ Fingerless Gloves image displays correctly
- ✅ Purchase links open Amazon/Etsy in new tabs
- ✅ Total cost calculates correctly ($258.98)
- ✅ Mobile view doesn't require horizontal scrolling
- ✅ Everything is readable on dark theme

---

## 🆘 Troubleshooting

### Problem: No images show at all
**Solution**: Check browser console (F12) for import errors

### Problem: Fingerless Gloves image broken
**Solution**: Verify file exists at `/Users/daniella/Desktop/cosplay-builder/cosplay-builder/src/assets/gloves.webp`

### Problem: Grid warnings in console
**Solution**: These are from initial load before Grid2 updates. Refresh once and they'll disappear.

### Problem: Purchase links don't work
**Solution**: Check if browser is blocking popups. Links should open in new tab.

### Problem: Mobile view has horizontal scrolling
**Solution**: Refresh browser after resize. Material UI needs to recalculate breakpoints.

### Problem: Total cost is wrong
**Solution**: Check `outfitPieceLinks` in `outfitPieceImages.js` for correct prices

---

## 📸 Expected Visual Flow

```
1. Character Selection
   ↓ (Click Yelena, then "Continue")
   
2. Appearance Selection
   ↓ (Click "Black Widow (2021)")
   
3. Outfit Components
   - Preview images (1 real, 6 placeholders)
   - 7 outfit pieces in table
   - 2 purchase links each
   - Total: $258.98
   ↓ (Click "Back to Characters")
   
4. Back to Character Selection
```

---

## 🎉 What's New Since Last Version

### UI Improvements:
- ✅ Material UI v7 components
- ✅ Professional card-based design
- ✅ Search functionality
- ✅ Confirmation workflow
- ✅ Mobile-responsive tables

### Data Structure:
- ✅ Separate image mapping file
- ✅ Purchase links with vendors
- ✅ Dynamic cost calculation
- ✅ Proper Vite image imports

### Backend Ready:
- ✅ Swagger API spec
- ✅ Database schema recommendations
- ✅ Python ORM models
- ✅ 7 tables designed

---

**Test Status**: Ready for UAT testing!  
**Dev Server**: http://localhost:5175/  
**Last Updated**: November 9, 2026, 5:15 PM PST
