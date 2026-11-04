// ============================================
// APPEARANCE SELECTION COMPONENT
// ============================================
// This component lets users choose a specific appearance (outfit)
// for the selected character. It displays:
// 1. List of available appearances for the character
// 2. Details of the selected appearance
// 3. Outfit pieces for that appearance

// FUNCTION COMPONENT with DESTRUCTURED PROPS
function AppearanceSelection({
  character,            // The currently selected character object
  selectedAppearance,   // The currently selected appearance (or null)
  onSelectAppearance,   // Callback to update selected appearance in parent
}) {
  // ==================== RENDER (JSX) ====================
  return (
    <section>
      <h2>Choose an Appearance</h2>

      {/* ==================== CONDITIONAL RENDERING #1 ====================*/}
      {/* Check if character has appearances AND if the array has items */}
      {/* ?. is optional chaining - safely access property that might not exist */}
      {character.appearances?.length > 0 ? (
        // TRUE BRANCH: Character has appearances, show them
        <div>
          {/* ==================== RENDER LIST OF APPEARANCES ==================== */}
          {/* Loop through each appearance and render its details */}
          {character.appearances.map((appearance) => (
            <div key={appearance.id}>
              {/* KEY prop is required when rendering lists */}
              
              {/* Display appearance information */}
              <h3>{appearance.title}</h3>
              <p>{appearance.outfitName}</p>
              <p>{appearance.description}</p>

              {/* BUTTON to select this appearance */}
              <button
                // When clicked, tell parent component about the selection
                onClick={() => onSelectAppearance(appearance)}
                
                // DISABLED state: Disable if this appearance is already selected
                // ?. checks if selectedAppearance exists before accessing .id
                disabled={selectedAppearance?.id === appearance.id}
              >
                {/* CONDITIONAL TEXT: Change button text based on selection */}
                {selectedAppearance?.id === appearance.id
                  ? "Selected"           // Show this if selected
                  : "Choose Appearance"  // Show this if not selected
                }
              </button>
            </div>
          ))}
        </div>
      ) : (
        // FALSE BRANCH: No appearances available for this character
        <p>Appearances haven't been added for this character yet.</p>
      )}

      {/* ==================== CONDITIONAL RENDERING #2 ==================== */}
      {/* Only show outfit pieces if an appearance has been selected */}
      {selectedAppearance && (
        <div>
          <h3>Outfit Pieces</h3>

          {/* Render list of outfit pieces as unordered list */}
          <ul>
            {/* Loop through outfit pieces array */}
            {selectedAppearance.outfitPieces.map((outfitPiece) => (
              <li key={outfitPiece}>{outfitPiece}</li>
              // KEY can be the string itself if values are unique
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

// Export this component
export default AppearanceSelection;
