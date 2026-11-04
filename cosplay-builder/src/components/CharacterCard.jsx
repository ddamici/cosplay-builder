// ============================================
// CHARACTER CARD COMPONENT
// ============================================
// This is a "presentational" or "dumb" component
// It receives data via props and displays it
// It doesn't manage its own state - just shows what it's told to show

// FUNCTION COMPONENT with DESTRUCTURED PROPS
function CharacterCard({ character, isSelected, onSelect }) {
  // Props explained:
  // - character: Object with character data (name, image, etc.)
  // - isSelected: Boolean - is this card currently selected?
  // - onSelect: Function - what to do when this card is clicked

  // ==================== RENDER (JSX) ====================
  return (
    <div
      // EVENT HANDLER: When div is clicked, call the onSelect function
      onClick={onSelect}
      
      // INLINE STYLES: Style object passed directly to element
      style={{
        display: "inline-block",     // Cards sit side-by-side
        flexDirection: "column",
        alignItems: "left",
        justifyContent: "left",
        
        // CONDITIONAL STYLING: Change border based on isSelected
        // Ternary operator: condition ? valueIfTrue : valueIfFalse
        border: isSelected ? "3px solid purple" : "1px solid gray",
        
        padding: "5px",
        margin: "10px",
        cursor: "pointer",           // Show hand cursor on hover
      }}
    >
      {/* Display character image */}
      <img
        src={character.image}        // Image URL from character object
        alt={character.name}         // Alt text for accessibility
        width="300"
      />

      {/* Display character name */}
      {/* Curly braces {} let you embed JavaScript expressions in JSX */}
      <h3>{character.name}</h3>
    </div>
  );
}

// Export this component
export default CharacterCard;
