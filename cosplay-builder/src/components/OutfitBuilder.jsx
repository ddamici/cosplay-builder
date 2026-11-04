// ============================================
// OUTFIT BUILDER COMPONENT
// ============================================
// This component lets users build their custom outfit by:
// 1. Selecting which outfit pieces they want to include
// 2. Displaying their selected pieces

// Import useState hook for managing local state
import { useState } from "react";

// FUNCTION COMPONENT with PROPS
function OutfitBuilder({ appearance }) {
  // Props:
  // - appearance: The selected appearance object with outfit pieces

  // ==================== LOCAL STATE ====================
  // Track which outfit pieces the user has selected
  // Initial value: empty array (nothing selected yet)
  const [selectedOutfitPieces, setSelectedOutfitPieces] = useState([]);

  // ==================== EVENT HANDLER ====================
  // This function handles toggling outfit pieces on/off
  function handleOutfitPieceChange(outfitPiece) {
    // Check if the piece is already in the selected array
    if (selectedOutfitPieces.includes(outfitPiece)) {
      // REMOVE: If already selected, filter it out (uncheck)
      setSelectedOutfitPieces(
        selectedOutfitPieces.filter((piece) => piece !== outfitPiece)
      );
    } else {
      // ADD: If not selected, add it to the array (check)
      // Spread operator (...) creates a new array with existing items + new item
      setSelectedOutfitPieces([...selectedOutfitPieces, outfitPiece]);
    }
    
    // NOTE: We create a NEW array instead of modifying the existing one
    // This is important in React - state should be immutable
  }

  // ==================== RENDER (JSX) ====================
  return (
    <section>
      <h2>Build Your Outfit</h2>
      <p>Choose the outfit pieces you want to include.</p>

      {/* ==================== CHECKBOXES FOR OUTFIT PIECES ==================== */}
      {/* Loop through all available outfit pieces */}
      {appearance.outfitPieces.map((outfitPiece) => (
        // Wrap each checkbox in a label for better UX (can click text to toggle)
        <label key={outfitPiece} style={{ display: "block" }}>
          {/* CONTROLLED CHECKBOX */}
          <input
            type="checkbox"
            // CHECKED state is controlled by React state
            // Check if this piece is in the selectedOutfitPieces array
            checked={selectedOutfitPieces.includes(outfitPiece)}
            // When checkbox changes, call our handler function
            onChange={() => handleOutfitPieceChange(outfitPiece)}
          />
          
          {/* Display the outfit piece name next to checkbox */}
          {outfitPiece}
        </label>
      ))}

      {/* ==================== DISPLAY SELECTED PIECES ==================== */}
      <h3>Parts of Your Outfit</h3>
      <ul>
        {/* Loop through selected pieces and display them */}
        {selectedOutfitPieces.map((outfitPiece) => (
          <li key={outfitPiece}>{outfitPiece}</li>
        ))}
      </ul>
      
      {/* If nothing is selected, the list will be empty */}
    </section>
  );
}

// Export this component
export default OutfitBuilder;
