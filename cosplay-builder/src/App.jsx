
import { useState } from "react";
import CharacterSelection from "./components/CharacterSelection";
import AppearanceSelection from "./components/AppearanceSelection";

function App() {
  const [selectedCharacter, setSelectedCharacter] = useState(null);


  return (
    <div>
      <h1>Cosplay Builder</h1>

      <CharacterSelection
        selectedCharacter={selectedCharacter}
        onSelectCharacter={setSelectedCharacter}
      />

      {selectedCharacter && (
        <p>
          Selected character: {selectedCharacter.name}
        </p>
      )}
      
       {selectedCharacter && (
    <AppearanceSelection character={selectedCharacter} />
  )}
    </div>
  );
}

export default App;