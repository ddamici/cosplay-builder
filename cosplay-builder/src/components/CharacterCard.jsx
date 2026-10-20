
function CharacterCard({ character, isSelected, onSelect }) {
    return (
      <div
        onClick={onSelect}
        style={{
          border: isSelected ? "3px solid blue" : "1px solid gray",
          padding: "10px",
          cursor: "pointer",
        }}
      >
        <img
          src={character.image}
          alt={character.name}
          width="150"
        />
  
        <h3>{character.name}</h3>
      </div>
    );
  }
  
  export default CharacterCard;