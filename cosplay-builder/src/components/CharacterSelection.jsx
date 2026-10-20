
import characters from "../data/characters";
import CharacterCard from "./CharacterCard";
import { useState } from "react";

function CharacterSelection({
  selectedCharacter,
  onSelectCharacter,
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const filteredCharacters = characters.filter((character) =>
        character.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return (
    <section>
      <h2>Choose Your Character</h2>
     

     <label htmlFor="character-search">
  Search for a character: <span></span>
  <input
    id="character-search"
    type="text"
    style={{ fontFamily: "sans-serif", fontSize: "16px" }}
    placeholder="e.g. Yelena Belova"
    value={searchTerm}
    onChange={(event) => setSearchTerm(event.target.value)}
  />
    </label>

      <div>
        {filteredCharacters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            isSelected={selectedCharacter?.id === character.id}
            onSelect={() => onSelectCharacter(character)}
          />
        ))}
      </div>
    </section>
  );
}

export default CharacterSelection;