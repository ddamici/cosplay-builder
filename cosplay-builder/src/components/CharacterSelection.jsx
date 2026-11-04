// ============================================
// CHARACTER SELECTION COMPONENT
// ============================================
// This component displays a list of characters and lets users:
// 1. Search/filter characters by name
// 2. Select a character by clicking on their card

// Import the characters data (array of character objects)
import characters from "../data/characters";

// Import the CharacterCard component (used to display each character)
import CharacterCard from "./CharacterCard";

// Import useState hook for managing component state
import { useState } from "react";

// FUNCTION COMPONENT with PROPS
// Props are received as an object parameter (destructured here)
function CharacterSelection({
  selectedCharacter,  // Current selected character (from parent)
  onSelectCharacter,  // Callback function to update parent's state
}) {
  // ==================== LOCAL STATE ====================
  // This state belongs ONLY to this component (not shared with parent)
  // It tracks what the user types in the search box
  const [searchTerm, setSearchTerm] = useState(""); // Initial value: empty string

  // ==================== EVENT HANDLER ====================
  // This function runs every time the user types in the search input
  function handleSearchChange(event) {
    // event.target is the input element
    // event.target.value is what the user typed
    const newValue = event.target.value;

    // Log to browser console (open DevTools to see this)
    console.log("User typed:", newValue);

    // Update state with the new value
    // This causes React to re-render the component
    setSearchTerm(newValue);
  }

  // ==================== DERIVED STATE ====================
  // Filter the characters array based on searchTerm
  // This recalculates every time searchTerm changes (on every render)
  const filteredCharacters = characters.filter((character) =>
    // Check if character name includes the search term (case-insensitive)
    character.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ==================== RENDER (JSX) ====================
  return (
    <section>
      <h2>Choose Your Character</h2>

      {/* Inline styles for the h2 */}
      <style>{`
        h2 {
          text-align: left;
          margin-left: 50px;
          margin-right: 10px;
          margin-top: 10px;
          margin-bottom: 10px;
        }
      `}</style>

      {/* FORM INPUT: Search box */}
      {/* htmlFor connects the label to the input (accessibility) */}
      <label htmlFor="character-search">
        <style>{`
          label {
            display: flex;
            align-items: right;
            justify-content: right;
            padding-left: 60px;
            padding-right: 100px;
            padding-bottom: 25px;
          }
        `}</style>

        {/* CONTROLLED COMPONENT: Input value is controlled by React state */}
        <input
          id="character-search"
          type="text"
          style={{
            fontFamily: "sans-serif",
            fontSize: "18px",
          }}
          placeholder="🔍 Search for a character"
          value={searchTerm}              // Value comes from state
          onChange={handleSearchChange}   // Update state when user types
        />
        {/* This is a CONTROLLED INPUT because React controls its value */}
      </label>

      <div>
        {/* ==================== RENDERING LISTS ==================== */}
        {/* .map() creates a new array by transforming each element */}
        {/* In React, we use .map() to render a list of components */}
        
        {filteredCharacters.map((character) => (
          // For each character, render a CharacterCard component
          <CharacterCard
            key={character.id}  // KEY is required for lists (helps React track items)
            character={character}  // Pass character data as prop
            style={{ textAlign: "center" }}
            // Check if this card's character is the selected one
            isSelected={selectedCharacter?.id === character.id}
            // When card is clicked, call parent's callback with this character
            onSelect={() => onSelectCharacter(character)}
          />
        ))}
      </div>
    </section>
  );
}

// Export this component so it can be imported elsewhere
export default CharacterSelection;
