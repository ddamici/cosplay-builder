# Frontend Explanation - How the Costume Pieces Work

## 🎓 For Beginner Frontend Engineers

This document explains how we display the costume pieces list and what changed.

---

## What is `.map()` in React?

Think of `.map()` as a **loop that creates React components**. It takes an array and returns JSX (HTML-like code) for each item.

### Simple Example:

```javascript
const fruits = ["Apple", "Banana", "Orange"];

// Using map to create a list
fruits.map((fruit) => {
  return <li>{fruit}</li>;
});

// This creates:
// <li>Apple</li>
// <li>Banana</li>
// <li>Orange</li>
```

---

## How We Use Map for Costume Pieces

### The Setup

We have an appearance (like "Black Widow 2021") that contains an array of outfit piece names:

```javascript
selectedAppearance = {
  title: "Black Widow (2021)",
  outfitName: "Tactical Gear",
  outfitPieces: [
    "White Jumpsuit",
    "Tactical Vest",
    "Utility Belt",
    "White Lace-up Boots",
    "Fingerless Gloves",
    "Holster",
    "Wig"
  ]
}
```

### Step-by-Step: What Happens When We Map

```javascript
selectedAppearance.outfitPieces.map((pieceName, index) => {
  // This function runs 7 times (once for each piece)
  
  // STEP 1: Get the full data for this piece
  const pieceData = getCostumePiece(pieceName);
  // pieceName = "White Jumpsuit"
  // pieceData = { id: 1, name: "White Jumpsuit", type: "Clothing", imageUrl: "...", purchaseLinks: [...] }
  
  // STEP 2: Calculate the lowest price
  const lowestPrice = Math.min(...pieceData.purchaseLinks.map(link => link.price));
  // lowestPrice = 34.99 (from Amazon)
  
  // STEP 3: Return JSX (one table row)
  return (
    <TableRow key={index}>
      <TableCell>{/* Image goes here */}</TableCell>
      <TableCell>{pieceData.name}</TableCell>
      <TableCell>{pieceData.type}</TableCell>
      <TableCell>${lowestPrice}</TableCell>
      <TableCell>{/* Purchase buttons go here */}</TableCell>
    </TableRow>
  );
});
```

**Result:** This creates 7 `<TableRow>` components, one for each costume piece!

---

## Before vs After: What Changed?

### ❌ BEFORE (Separated Data)

We had **two separate objects** - one for images, one for purchase links:

```javascript
// Images object
const outfitPieceImages = {
  "White Jumpsuit": jumpsuitImage,
  "Tactical Vest": vestImage,
  // ...
};

// Separate purchase links object
const outfitPieceLinks = {
  "White Jumpsuit": [
    { vendor: "Amazon", url: "...", price: 34.99 },
    { vendor: "Etsy", url: "...", price: 89.99 }
  ],
  // ...
};

// In the component, we had to fetch from BOTH:
const imageUrl = getOutfitPieceImage(pieceName);  // Get image separately
const purchaseLinks = getOutfitPieceLinks(pieceName);  // Get links separately
const pieceType = pieceTypes[pieceName];  // Get type separately
```

**Problems:**
- Had to look up data in 3 different places
- Doesn't match how databases work (data is usually in one row)
- Hard to add new fields (you'd have to update multiple objects)

### ✅ AFTER (Unified Data - Like a Database Row)

Now we have **ONE object** with all the data together:

```javascript
const costumePiecesData = {
  "White Jumpsuit": {
    id: 1,
    name: "White Jumpsuit",
    type: "Clothing",  // ← Type is here
    imageUrl: jumpsuitImage,  // ← Image is here
    estimatedCostMin: 34.99,
    estimatedCostMax: 89.99,
    difficultyLevel: "Medium",
    isOptional: false,
    notes: "Core piece of the costume",
    purchaseLinks: [  // ← Purchase links are nested here
      { id: 1, vendor: "Amazon", url: "...", price: 34.99 },
      { id: 2, vendor: "Etsy", url: "...", price: 89.99 }
    ]
  }
};

// In the component, we get EVERYTHING at once:
const pieceData = getCostumePiece(pieceName);  // Get all data in one call

// Now we can access:
pieceData.name           // "White Jumpsuit"
pieceData.type           // "Clothing"
pieceData.imageUrl       // (the image)
pieceData.purchaseLinks  // [{ vendor: "Amazon", ... }, { vendor: "Etsy", ... }]
```

**Benefits:**
- ✅ Everything is in one place (like a database row!)
- ✅ Matches what the API will return
- ✅ Easy to add new fields (just add to the object)
- ✅ Cleaner code (one function call instead of three)

---

## Do We Use One Component to Display the Table?

**Yes!** We use ONE component (`CostumeBuilder`) that contains the table, but the `.map()` creates **multiple rows dynamically**.

### The Component Structure:

```javascript
function CostumeBuilder({ character, onBack }) {
  return (
    <Container>
      {/* ONE table element */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Preview</TableCell>
            <TableCell>Piece Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Estimated Cost</TableCell>
            <TableCell>Purchase Links</TableCell>
          </TableRow>
        </TableHead>
        
        {/* ONE TableBody element */}
        <TableBody>
          {/* .map() creates MULTIPLE TableRow elements */}
          {selectedAppearance.outfitPieces.map((pieceName, index) => {
            const pieceData = getCostumePiece(pieceName);
            
            return (
              <TableRow key={index}>
                {/* Image cell */}
                <TableCell>
                  <img src={pieceData.imageUrl} alt={pieceData.name} />
                </TableCell>
                
                {/* Name cell */}
                <TableCell>{pieceData.name}</TableCell>
                
                {/* Type cell */}
                <TableCell>{pieceData.type}</TableCell>
                
                {/* Cost cell */}
                <TableCell>${lowestPrice}</TableCell>
                
                {/* Purchase buttons cell */}
                <TableCell>
                  {/* Nested map for purchase links! */}
                  {pieceData.purchaseLinks.map((link) => (
                    <Button key={link.id} href={link.url}>
                      {link.vendor} - ${link.price}
                    </Button>
                  ))}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Container>
  );
}
```

### Visual Breakdown:

```
CostumeBuilder Component (ONE)
  └── Table (ONE)
       ├── TableHead (ONE)
       │    └── TableRow (ONE) - Headers
       │
       └── TableBody (ONE)
            ├── TableRow (CREATED BY MAP) - White Jumpsuit
            ├── TableRow (CREATED BY MAP) - Tactical Vest
            ├── TableRow (CREATED BY MAP) - Utility Belt
            ├── TableRow (CREATED BY MAP) - White Lace-up Boots
            ├── TableRow (CREATED BY MAP) - Fingerless Gloves
            ├── TableRow (CREATED BY MAP) - Holster
            └── TableRow (CREATED BY MAP) - Wig
```

---

## The "Nested Map" for Purchase Links

Inside each table row, we have **another map** for the purchase buttons!

```javascript
{/* For each costume piece... */}
{selectedAppearance.outfitPieces.map((pieceName) => {
  const pieceData = getCostumePiece(pieceName);
  
  return (
    <TableRow>
      {/* ... other cells ... */}
      
      <TableCell>
        {/* NESTED MAP: For each purchase link in this piece... */}
        {pieceData.purchaseLinks.map((link) => (
          <Button key={link.id} href={link.url}>
            {link.vendor} - ${link.price}
          </Button>
        ))}
      </TableCell>
    </TableRow>
  );
})}
```

**Why nested?** Because each piece has its own list of purchase links!

Example:
```
White Jumpsuit
  ├── Amazon button ($34.99)
  └── Etsy button ($89.99)

Tactical Vest
  ├── Amazon button ($29.99)
  └── AliExpress button ($19.99)
```

---

## When the Backend is Ready...

Right now, we get data from a JavaScript object:
```javascript
const pieceData = getCostumePiece(pieceName);  // From local file
```

When the backend API is ready, we'll change it to:
```javascript
// Fetch from API once when component loads
const [costumePieces, setCostumePieces] = useState([]);

useEffect(() => {
  fetch('/api/v1/appearances/1/outfit-pieces')
    .then(response => response.json())
    .then(data => setCostumePieces(data.data));
}, []);

// Then map over the API data (same structure!)
{costumePieces.map((pieceData) => (
  <TableRow>
    <TableCell>{pieceData.name}</TableCell>
    {/* ... rest of the row ... */}
  </TableRow>
))}
```

**The key insight:** Because our mock data structure matches what the API will return, we only need to change WHERE we get the data, not HOW we display it!

---

## Key Takeaways

### 1. **`.map()` is a loop that creates React components**
```javascript
array.map((item) => <Component>{item}</Component>)
```

### 2. **We use ONE component, but map creates MULTIPLE rows**
- ONE `<Table>` component
- SEVEN `<TableRow>` components (created by map)

### 3. **The new structure is like a database row**
- Before: Split data across multiple objects
- After: All data in one object (easier to work with)

### 4. **Nested maps are common**
- Outer map: Loop through costume pieces
- Inner map: Loop through purchase links for each piece

### 5. **Mock data → Real API is an easy switch**
- Structure is identical
- Just change where you fetch the data from

---

## Try It Yourself

Open the browser console (F12) and type:

```javascript
// See all costume pieces
console.log(getAllCostumePieces());

// Get one piece
console.log(getCostumePiece("White Jumpsuit"));

// See just the purchase links
console.log(getCostumePiece("White Jumpsuit").purchaseLinks);
```

This will help you see the data structure we're working with!

---

## Questions?

- **Q: Why use `.map()` instead of a regular `for` loop?**  
  A: In React, `.map()` returns JSX directly, making it cleaner and more "React-like."

- **Q: What does `key={index}` mean?**  
  A: React needs a unique `key` prop for each item in a list so it can track which items changed.

- **Q: Can we have more than 2 nested maps?**  
  A: Yes! But it can get messy. Usually 2 levels (pieces → links) is the max.

- **Q: What if `pieceData` is `null`?**  
  A: That's why we have `if (!pieceData) return null;` - it skips that row if data is missing.

---

**Next Steps:**
1. Look at the code in `CostumeBuilder.jsx` lines 174-307
2. Find the `.map()` functions
3. See how `pieceData` is used to populate each row
4. Notice the nested `.map()` for purchase buttons

Happy coding! 🚀
