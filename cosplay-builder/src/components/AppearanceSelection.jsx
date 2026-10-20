
function AppearanceSelection({ character }) {
    return (
      <section>
        <h2>Choose an Appearance</h2>
  
        <p>Character Selected: {character.name}</p>
  
        {character.appearances?.length > 0 ? (
          <div>
            {character.appearances.map((appearance) => (
              <div key={appearance.id}>
                <h3>{appearance.title}</h3>
                <p>{appearance.outfitName}</p>
                <p>{appearance.description}</p>
  
                <p>Components:</p>
  
                <ul>
                  {appearance.components.map((component) => (
                    <li key={component}>{component}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p>Appearances haven't been added for this character yet.</p>
        )}
      </section>
    );
  }
  
  export default AppearanceSelection;