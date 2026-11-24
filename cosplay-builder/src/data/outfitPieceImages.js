// ============================================
// COSTUME PIECES DATA
// ============================================
// This structure mimics the JSON response from the database API
// Each piece represents a row from the "outfit_pieces" table
// TODO: Replace with actual API call to backend

// Import images (local files only)
import glovesImage from '../assets/gloves.webp';
import holsterImage from '../assets/weaponHolster.jpg';
import wigImage from '../assets/longDirtyBlondeWig.jpg';
import bootsImage from '../assets/whiteCombatBoots.jpg';
import jumpsuitImage from '../assets/whiteLongJumpsuit.webp';
import beltImage from '../assets/tacticalBlackBelt.jpg';
import vestImage from '../assets/tacticalVest.jpg';
import thunderboltsYelenaImage from '../assets/thunderboltsYelena.jpg';

// ============================================
// COSTUME PIECES DATABASE STRUCTURE
// ============================================
// This simulates what the backend API will return
// Each object represents one row from the outfit_pieces table
const costumePiecesData = {
  "White Jumpsuit": {
    id: 1,
    name: "White Jumpsuit",
    type: "Clothing",
    imageUrl: jumpsuitImage,
    estimatedCostMin: 34.99,
    estimatedCostMax: 89.99,
    difficultyLevel: "Medium",
    isOptional: false,
    notes: "Core piece of the costume",
    purchaseLinks: [
      { 
        id: 1,
        vendor: "Amazon", 
        url: "https://amazon.com/search?q=white+jumpsuit+costume", 
        price: 34.99,
        inStock: true,
        isAffiliate: false
      },
      { 
        id: 2,
        vendor: "Etsy", 
        url: "https://etsy.com/search?q=white+tactical+jumpsuit", 
        price: 89.99,
        inStock: true,
        isAffiliate: false
      }
    ]
  },
  
  "Tactical Vest": {
    id: 2,
    name: "Tactical Vest",
    type: "Clothing",
    imageUrl: vestImage,
    estimatedCostMin: 19.99,
    estimatedCostMax: 29.99,
    difficultyLevel: "Easy",
    isOptional: false,
    notes: "Worn over jumpsuit",
    purchaseLinks: [
      { 
        id: 3,
        vendor: "Amazon", 
        url: "https://www.amazon.ca/Outdoor-Breathable-Multiple-Pockets-Fishing/dp/B0GKG41T9Y", 
        price: 29.99,
        inStock: true,
        isAffiliate: false
      },
      { 
        id: 4,
        vendor: "AliExpress", 
        url: "https://aliexpress.com/w/wholesale-tactical-vest.html", 
        price: 19.99,
        inStock: true,
        isAffiliate: false
      }
    ]
  },
  
  "Utility Belt": {
    id: 3,
    name: "Utility Belt",
    type: "Accessory",
    imageUrl: beltImage,
    estimatedCostMin: 15.99,
    estimatedCostMax: 24.99,
    difficultyLevel: "Easy",
    isOptional: false,
    notes: "Tactical belt with pouches",
    purchaseLinks: [
      { 
        id: 5,
        vendor: "Amazon", 
        url: "https://amazon.com/search?q=utility+belt+costume", 
        price: 15.99,
        inStock: true,
        isAffiliate: false
      },
      { 
        id: 6,
        vendor: "Etsy", 
        url: "https://etsy.com/search?q=utility+belt", 
        price: 24.99,
        inStock: true,
        isAffiliate: false
      }
    ]
  },
  
  "White Lace-up Boots": {
    id: 4,
    name: "White Lace-up Boots",
    type: "Footwear",
    imageUrl: bootsImage,
    estimatedCostMin: 45.99,
    estimatedCostMax: 79.99,
    difficultyLevel: "Easy",
    isOptional: false,
    notes: "Combat-style boots",
    purchaseLinks: [
      { 
        id: 7,
        vendor: "Amazon", 
        url: "https://amazon.com/search?q=white+lace+up+boots", 
        price: 45.99,
        inStock: true,
        isAffiliate: false
      },
      { 
        id: 8,
        vendor: "Zappos", 
        url: "https://zappos.com/white-boots", 
        price: 79.99,
        inStock: true,
        isAffiliate: false
      }
    ]
  },
  
  "Fingerless Gloves": {
    id: 5,
    name: "Fingerless Gloves",
    type: "Accessory",
    imageUrl: glovesImage,
    estimatedCostMin: 12.99,
    estimatedCostMax: 18.99,
    difficultyLevel: "Easy",
    isOptional: true,
    notes: "Tactical fingerless gloves",
    purchaseLinks: [
      { 
        id: 9,
        vendor: "Amazon", 
        url: "https://amazon.com/search?q=fingerless+gloves+tactical", 
        price: 12.99,
        inStock: true,
        isAffiliate: false
      },
      { 
        id: 10,
        vendor: "Etsy", 
        url: "https://etsy.com/search?q=fingerless+gloves", 
        price: 18.99,
        inStock: true,
        isAffiliate: false
      }
    ]
  },
  
  "Holster": {
    id: 6,
    name: "Holster",
    type: "Accessory",
    imageUrl: holsterImage,
    estimatedCostMin: 19.99,
    estimatedCostMax: 32.99,
    difficultyLevel: "Easy",
    isOptional: true,
    notes: "Leg holster for props",
    purchaseLinks: [
      { 
        id: 11,
        vendor: "Amazon", 
        url: "https://amazon.com/search?q=costume+holster", 
        price: 19.99,
        inStock: true,
        isAffiliate: false
      },
      { 
        id: 12,
        vendor: "Etsy", 
        url: "https://etsy.com/search?q=tactical+holster", 
        price: 32.99,
        inStock: true,
        isAffiliate: false
      }
    ]
  },
  
  "Wig": {
    id: 7,
    name: "Wig",
    type: "Wig",
    imageUrl: wigImage,
    estimatedCostMin: 24.99,
    estimatedCostMax: 42.99,
    difficultyLevel: "Medium",
    isOptional: false,
    notes: "Blonde short wig",
    purchaseLinks: [
      { 
        id: 13,
        vendor: "Amazon", 
        url: "https://amazon.com/search?q=blonde+short+wig", 
        price: 24.99,
        inStock: true,
        isAffiliate: false
      },
      { 
        id: 14,
        vendor: "Arda Wigs", 
        url: "https://arda-wigs.com/", 
        price: 42.99,
        inStock: true,
        isAffiliate: false
      }
    ]
  },
  
  // Thunderbolts pieces (no images yet)
  "Black Bodysuit": {
    id: 8,
    name: "Black Bodysuit",
    type: "Clothing",
    imageUrl: null,
    estimatedCostMin: 29.99,
    estimatedCostMax: 75.99,
    difficultyLevel: "Medium",
    isOptional: false,
    notes: "Black tactical bodysuit",
    purchaseLinks: [
      { 
        id: 15,
        vendor: "Amazon", 
        url: "https://amazon.com/search?q=black+bodysuit", 
        price: 29.99,
        inStock: true,
        isAffiliate: false
      },
      { 
        id: 16,
        vendor: "Etsy", 
        url: "https://etsy.com/search?q=black+tactical+bodysuit", 
        price: 75.99,
        inStock: true,
        isAffiliate: false
      }
    ]
  },
  
  "Black Boots": {
    id: 9,
    name: "Black Boots",
    type: "Footwear",
    imageUrl: null,
    estimatedCostMin: 49.99,
    estimatedCostMax: 89.99,
    difficultyLevel: "Easy",
    isOptional: false,
    notes: "Black tactical boots",
    purchaseLinks: [
      { 
        id: 17,
        vendor: "Amazon", 
        url: "https://amazon.com/search?q=black+tactical+boots", 
        price: 49.99,
        inStock: true,
        isAffiliate: false
      },
      { 
        id: 18,
        vendor: "Zappos", 
        url: "https://zappos.com/black-boots", 
        price: 89.99,
        inStock: true,
        isAffiliate: false
      }
    ]
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================
// These simulate what your frontend will do with the API response

// Get costume piece data by name
export function getCostumePiece(pieceName) {
  return costumePiecesData[pieceName] || null;
}

// Check if piece has an image
export function hasImage(pieceName) {
  const piece = costumePiecesData[pieceName];
  return piece && piece.imageUrl !== null;
}

// Get all costume pieces (simulates API endpoint)
export function getAllCostumePieces() {
  return Object.values(costumePiecesData);
}

// Get pieces for specific appearance (this would be a query parameter in the real API)
export function getCostumePiecesByAppearance(appearanceId) {
  // In real API: GET /api/appearances/:appearanceId/outfit-pieces
  // For now, just return all pieces
  return Object.values(costumePiecesData);
}

export default costumePiecesData;
