
// ============================================
// OUTFIT SUMMARY COMPONENT
// ============================================
// This component displays a summary of the user's cosplay selections:
// 1. Selected character
// 2. Selected appearance
// 3. Number of outfit pieces selected
// 4. List of selected outfit pieces

// FUNCTION COMPONENT with PROPS
function OutfitSummary({
    character,
    appearance,
    selectedOutfitPieces,
  }) {
    // Props:
    // - character: The character selected by the user
    // - appearance: The appearance selected by the user
    // - selectedOutfitPieces: Array of selected outfit pieces
  
    // ==================== RENDER (JSX) ====================
    return (
      <section>
        <h2>Your Cosplay Summary</h2>
  
        {/* ==================== CHARACTER INFORMATION ==================== */}
        <h3>Character</h3>
        <p>{character.name}</p>
  
        {/* ==================== APPEARANCE INFORMATION ==================== */}
        <h3>Appearance</h3>
        <p>{appearance.title}</p>
        <p>{appearance.outfitName}</p>
  
        {/* ==================== SELECTED OUTFIT PIECES ==================== */}
        <h3>Selected Outfit Pieces</h3>
  
        {/* Display the total number of selected pieces */}
        <p>Total pieces: {selectedOutfitPieces.length}</p>
  
        {/* Display the selected pieces in a list */}
        {selectedOutfitPieces.length > 0 ? (
          <ul>
            {selectedOutfitPieces.map((outfitPiece) => (
              <li key={outfitPiece}>{outfitPiece}</li>
            ))}
          </ul>
        ) : (
          <p>You haven't selected any outfit pieces yet.</p>
        )}
      </section>
    );
  }
  
  // Export this component
  export default OutfitSummary;
  