
// ============================================
// APP.JSX - The Main Component
// ============================================
// This is the root component of your application.
// It manages the overall state and coordinates child components.

// Import the useState hook - lets you add state to function components
import { useState } from "react";

// Import child components (these are custom components you created)
import CharacterSelection from "./components/CharacterSelection";
import AppearanceSelection from "./components/AppearanceSelection";
import OutfitBuilder from "./components/OutfitBuilder";

// FUNCTION COMPONENT: A JavaScript function that returns JSX
function App() {
  // ==================== STATE MANAGEMENT ====================
  // STATE: Data that can change over time and triggers re-renders
  // useState returns [currentValue, functionToUpdateValue]
  // Initially, both are null (nothing selected yet)
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedAppearance, setSelectedAppearance] = useState(null);
  const [selectedOutfitPieces, setSelectedOutfitPieces] = useState([]);

  // When state changes, React re-renders this component
  // and all its children with the new data

  // ==================== RENDER (JSX) ====================
  // JSX: Looks like HTML but it's actually JavaScript
  // React transforms this into actual DOM elements
  return (
    <div>
      <h1>Cosplay Builder</h1>

      {/* INLINE STYLES: Not recommended for production, but works */}
      <style>{`
        h1 {
          text-align: left;
          margin-left: 50px;
          margin-right: 25px;
          margin-top: 25px;
          margin-bottom: 25px;
        }
      `}</style>

      {/* ==================== COMPONENT 1: Character Selection ==================== */}
      {/* PROPS: Data passed from parent to child (like function arguments) */}
      <CharacterSelection
        selectedCharacter={selectedCharacter}
        onSelectCharacter={(character) => {
          // When state changes, reset dependent selections
          setSelectedCharacter(character);
          setSelectedAppearance(null);
          setSelectedOutfitPieces([]);
        }}
      />

      {/* ==================== CONDITIONAL RENDERING ==================== */}
      {/* The && operator: Only render if condition is true */}
      {/* If selectedCharacter exists (not null), show the paragraph */}
      {selectedCharacter && (
        <p>
          Selected character: {selectedCharacter.name}
        </p>
      )}

      {/* ==================== COMPONENT 2: Appearance Selection ==================== */}
      {/* Only show AppearanceSelection if a character is selected */}
      {selectedCharacter && (
        <AppearanceSelection
          character={selectedCharacter}
          selectedAppearance={selectedAppearance}
          onSelectAppearance={(appearance) => {
            setSelectedAppearance(appearance);
            setSelectedOutfitPieces([]);
          }}
        />
      )}

      {/* ==================== COMPONENT 3: Outfit Builder ==================== */}
      {/* Only show OutfitBuilder if an appearance is selected */}
      {selectedAppearance && (
        <OutfitBuilder
          appearance={selectedAppearance}
          selectedOutfitPieces={selectedOutfitPieces}
          setSelectedOutfitPieces={setSelectedOutfitPieces}
        />
      )}
    </div>
  );
}

// Export so other files can import this component
export default App;
