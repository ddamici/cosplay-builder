// ============================================
// COSTUME PIECES DATA
// ============================================
// This structure mimics the JSON response from the database API
// Each piece represents a row from the "outfit_pieces" table
// Images use remote URLs (same shape the backend / CDN will return)
// TODO: Replace with actual API call to backend

// ============================================
// COSTUME PIECES DATABASE STRUCTURE
// ============================================
const costumePiecesData = {
  "White Jumpsuit": {
    id: 1,
    name: "White Jumpsuit",
    type: "Clothing",
    // Prefer a dedicated piece image; purchase links can also carry imageUrl
    imageUrl: "https://n.nordstrommedia.com/it/445a7b3a-ed5e-4f47-b132-8a41d3d67d8f.jpeg?w=780&h=1170&crop=pad&dpr=2",
    estimatedCostMin: 50.99,
    estimatedCostMax: 100.00,
    purchaseLinks: [
      {
        id: 1,
        vendor: "Amazon",
        url: "https://www.amazon.ca/Ecupper-Workout-Jumpsuit-Bodysuit-Unitard/dp/B0HFMCVVL5/ref=pd_rhf_dp_s_ci_mcx_mr__d_sccl_2_1/135-5340499-5287358?pd_rd_w=uMXw4&content-id=amzn1.sym.55479b01-18bc-4a84-9dea-c4e3f49fa64c%3Aamzn1.symc.d3391730-f670-41da-8b34-61787b3edb82&pf_rd_p=55479b01-18bc-4a84-9dea-c4e3f49fa64c&pf_rd_r=FE142J2RBPT8W0ZZ8C02&pd_rd_wg=xYTFa&pd_rd_r=d61652c6-3716-4208-870d-70e3dcd1f639&pd_rd_i=B0HFMCVVL5&th=1&psc=1",
        imageUrl: "https://fancon.s3.us-east-2.amazonaws.com/characters/abby%20anderson.webp",
        price: 50.99,
        inStock: true,
        isAffiliate: false,
      },
      {
        id: 2,
        vendor: "Nordstrom",
        url: "https://www.nordstrom.com/s/naked-wardrobe-quarter-zip-jumpsuit/8062085?origin=category-personalizedsort&breadcrumb=Home%2FWomen%2FClothing%2FJumpsuits+%26+Rompers&fashioncolor=White&color=444444X6KX",
        imageUrl: "https://n.nordstrommedia.com/it/445a7b3a-ed5e-4f47-b132-8a41d3d67d8f.jpeg?w=780&h=1170&crop=pad&dpr=2",
        price: 100.00,
        inStock: true,
        isAffiliate: false,
      },
    ],
  },

  "Tactical Vest": {
    id: 2,
    name: "Tactical Vest",
    type: "Clothing",
    imageUrl: "https://m.media-amazon.com/images/I/61RHDxMFNCL._AC_SY300_SX300_QL70_ML2_.jpg",
    estimatedCostMin: 19.99,
    estimatedCostMax: 29.99,
    purchaseLinks: [
      {
        id: 3,
        vendor: "Amazon",
        url: "https://www.amazon.ca/Tacticals-Harness-Capacity-Holsters-Outdoor/dp/B0FQDQ9N7H/ref=asc_df_B0FQDQ9N7H?mcid=aa1f088c239c357b8e640a115519ace1&tag=googleshopc0c-20&linkCode=df0&hvadid=716152277972&hvpos=&hvnetw=g&hvrand=2857449367752975648&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9001493&hvtargid=pla-2451584371098&hvcampaign=21504504133&psc=1&hvocijid=2857449367752975648-B0FQDQ9N7H-&hvexpln=0&gad_source=1",
        imageUrl: "https://m.media-amazon.com/images/I/61RHDxMFNCL._AC_SY300_SX300_QL70_ML2_.jpg",
        price: 29.99,
        inStock: true,
        isAffiliate: false,
      },
      {
        id: 4,
        vendor: "Amazon",
        url: "https://www.amazon.ca/Outdoor-Breathable-Multiple-Pockets-Fishing/dp/B0GKG41T9Y",
        imageUrl: "https://m.media-amazon.com/images/I/614lPahkh+L._AC_AIweblab1392912,T2_FMavif_SF1358,1358_PQ60_.jpg?aicid=detailPage-mediaBlock",
        price: 29.99,
        inStock: true,
        isAffiliate: false,
      },
    ],
  },

  "Utility Belt": {
    id: 3,
    name: "Utility Belt",
    type: "Accessory",
    imageUrl: "https://images-na.ssl-images-amazon.com/images/I/712fJPcerRL._AC_UL330_SR330,330_.jpg",
    estimatedCostMin: 15.99,
    estimatedCostMax: 19.18,
    purchaseLinks: [
      {
        id: 5,
        vendor: "Amazon",
        url: "https://www.amazon.ca/Tactical-Outdoor-Security-Utility-Activity/dp/B09WQXN16M/ref=asc_df_B09WQXN16M?mcid=fed3c10d46b83cb4b736a2f15a3679a7&tag=googleshopc0c-20&linkCode=df0&hvadid=706747243165&hvpos=&hvnetw=g&hvrand=5518723975814187485&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9001493&hvtargid=pla-2454854601021&psc=1&hvocijid=5518723975814187485-B09WQXN16M-&hvexpln=0&gad_source=1",
        imageUrl: "https://m.media-amazon.com/images/I/81xexzHUqfL._AC_SY300_SX300_QL70_ML2_.jpg",
        price: 15.99,
        inStock: true,
        isAffiliate: false,
      },
      {
        id: 6,
        vendor: "Amazon",
        url: "https://www.amazon.ca/JUKMO-Release-Tactical-Military-Seatbelt/dp/B09Y63BR7Z/ref=pd_rhf_dp_s_ci_mcx_mr__d_sccl_2_1/135-5340499-5287358?pd_rd_w=xpmCM&content-id=amzn1.sym.55479b01-18bc-4a84-9dea-c4e3f49fa64c:amzn1.symc.d3391730-f670-41da-8b34-61787b3edb82&pf_rd_p=55479b01-18bc-4a84-9dea-c4e3f49fa64c&pf_rd_r=AZQ7AVJC429RBB5V6WTA&pd_rd_wg=b9mh9&pd_rd_r=b332e629-4266-47e4-95ac-d9a1c96c01d1&pd_rd_i=B09Y63BR7Z&psc=1",
        imageUrl: "https://images-na.ssl-images-amazon.com/images/I/712fJPcerRL._AC_UL330_SR330,330_.jpg",
        price: 19.18,
        inStock: true,
        isAffiliate: false,
      },
    ],
  },

  "White Lace-up Boots": {
    id: 4,
    name: "White Lace-up Boots",
    type: "Footwear",
    imageUrl: "https://m.media-amazon.com/images/I/51s7EsLVgEL._AC_SY695_.jpg",
    estimatedCostMin: 35.99,
    estimatedCostMax: 79.99,
    purchaseLinks: [
      {
        id: 7,
        vendor: "Amazon",
        url: "https://www.amazon.ca/ZJWBB-Lace-up-Fashion-Booties-Waterproof/dp/B0D9C3Z9JB/ref=asc_df_B0D9C3Z9JB?mcid=dc1edb6ea47f3645bba0878dd36e4629&tag=googleshopc0c-20&linkCode=df0&hvadid=824557572855&hvpos=&hvnetw=g&hvrand=5212311427709969549&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9001493&hvtargid=pla-2502361460585&hvocijid=5212311427709969549-B0D9C3Z9JB-&hvexpln=0&gad_source=1&th=1&psc=1",
        imageUrl: "https://m.media-amazon.com/images/I/51s7EsLVgEL._AC_SY695_.jpg",
        price: 35.99,
        inStock: true,
        isAffiliate: false,
      },
      {
        id: 8,
        vendor: "Zappos",
        url: "https://zappos.com/white-boots",
        price: 79.99,
        inStock: true,
        isAffiliate: false,
      },
    ],
  },

  "Fingerless Gloves": {
    id: 5,
    name: "Fingerless Gloves",
    type: "Accessory",
    imageUrl: "https://cdn11.bigcommerce.com/s-6kqqhi4p7y/images/stencil/1280x1280/attribute_rule_images/2280_source_1738964857.png",
    estimatedCostMin: 12.99,
    estimatedCostMax: 18.99,
    purchaseLinks: [
      {
        id: 9,
        vendor: "IronClad Gear",
        url: "https://ironclad.com/products/tactical-impact-fingerless.html",
        imageUrl: "https://cdn11.bigcommerce.com/s-6kqqhi4p7y/images/stencil/1280x1280/attribute_rule_images/2280_source_1738964857.png",
        price: 19.99,
        inStock: true,
        isAffiliate: false,
      },
      {
        id: 10,
        vendor: "Etsy",
        url: "https://etsy.com/search?q=fingerless+gloves",
        price: 18.99,
        inStock: true,
        isAffiliate: false,
      },
    ],
  },

  "Holster": {
    id: 6,
    name: "Holster",
    type: "Accessory",
    imageUrl: "https://m.media-amazon.com/images/I/81xexzHUqfL._AC_SY300_SX300_QL70_ML2_.jpg",
    estimatedCostMin: 19.99,
    estimatedCostMax: 32.99,
    purchaseLinks: [
      {
        id: 11,
        vendor: "Amazon",
        url: "https://www.amazon.ca/Tactical-Universal-Military-Adjustable-Magazine/dp/B0CSFQCJZ1/ref=asc_df_B0CSFQCJZ1?mcid=67d2101880f63d84a55feeeb56a3c7f1&tag=googleshopc0c-20&linkCode=df0&hvadid=706747243165&hvpos=&hvnetw=g&hvrand=12234905644336438792&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9001493&hvtargid=pla-2299187020073&psc=1&hvocijid=12234905644336438792-B0CSFQCJZ1-&hvexpln=0&gad_source=1",
        imageUrl: "https://m.media-amazon.com/images/I/81xexzHUqfL._AC_SY300_SX300_QL70_ML2_.jpg",
        price: 19.99,
        inStock: true,
        isAffiliate: false,
      },
    ],
  },

  "Wig": {
    id: 7,
    name: "Long Blonde Wig",
    type: "Hairpiece",
    imageUrl: "https://m.media-amazon.com/images/I/61621YkNiGL._AC_SX679_.jpg",
    estimatedCostMin: 22.00,
    estimatedCostMax: 42.99,
    purchaseLinks: [
      {
        id: 13,
        vendor: "Amazon",
        url: "https://www.amazon.ca/Zerone-Straight-Synthetic-Glueless-Resistant/dp/B0CLS56WTW/ref=asc_df_B0CLS56WTW?mcid=fdcfc43cbe6736e39138f8998d21a6cb&tag=googleshopc0c-20&linkCode=df0&hvadid=729703374147&hvpos=&hvnetw=g&hvrand=2659978347531934937&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9001493&hvtargid=pla-2336852555207&psc=1&hvocijid=2659978347531934937-B0CLS56WTW-&hvexpln=0&gad_source=1",
        imageUrl: "https://m.media-amazon.com/images/I/81xexzHUqfL._AC_SY300_SX300_QL70_ML2_.jpg",
        price: 22.00,
        inStock: true,
        isAffiliate: false,
      },
      {
        id: 14,
        vendor: "Arda Wigs",
        url: "https://arda-wigs.com/",
        price: 42.99,
        inStock: true,
        isAffiliate: false,
      },
    ],
  },

  "Black Bodysuit": {
    id: 8,
    name: "Black Bodysuit",
    type: "Clothing",
    imageUrl: null,
    estimatedCostMin: 29.99,
    estimatedCostMax: 75.99,
    purchaseLinks: [
      {
        id: 15,
        vendor: "Amazon",
        url: "https://amazon.com/search?q=black+bodysuit",
        price: 29.99,
        inStock: true,
        isAffiliate: false,
      },
      {
        id: 16,
        vendor: "Etsy",
        url: "https://etsy.com/search?q=black+tactical+bodysuit",
        price: 75.99,
        inStock: true,
        isAffiliate: false,
      },
    ],
  },

  "Black Boots": {
    id: 9,
    name: "Black Boots",
    type: "Footwear",
    imageUrl: null,
    estimatedCostMin: 49.99,
    estimatedCostMax: 89.99,
    purchaseLinks: [
      {
        id: 17,
        vendor: "Amazon",
        url: "https://amazon.com/search?q=black+tactical+boots",
        price: 49.99,
        inStock: true,
        isAffiliate: false,
      },
      {
        id: 18,
        vendor: "Zappos",
        url: "https://zappos.com/black-boots",
        price: 89.99,
        inStock: true,
        isAffiliate: false,
      },
    ],
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getCostumePiece(pieceName) {
  return costumePiecesData[pieceName] || null;
}

/**
 * Resolve the best preview image for a piece:
 * 1) piece.imageUrl
 * 2) first purchaseLink that has imageUrl
 */
export function getPiecePreviewImage(piece) {
  if (!piece) return null;
  if (piece.imageUrl) return piece.imageUrl;
  const linkWithImage = piece.purchaseLinks?.find((link) => link.imageUrl);
  return linkWithImage?.imageUrl || null;
}

export function hasImage(pieceName) {
  const piece = costumePiecesData[pieceName];
  return Boolean(getPiecePreviewImage(piece));
}

export function getAllCostumePieces() {
  return Object.values(costumePiecesData);
}

export function getCostumePiecesByAppearance(appearanceId) {
  // In real API: GET /api/appearances/:appearanceId/outfit-pieces
  return Object.values(costumePiecesData);
}

export default costumePiecesData;
