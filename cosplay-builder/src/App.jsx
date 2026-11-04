// ============================================
// APP.JSX - Main Component with Material UI
// ============================================
import { useState } from "react";
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";
import CharacterSelection from "./components/CharacterSelection";
import CostumeBuilder from "./components/CostumeBuilder";

// Create Material UI dark theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9c27b0', // Purple theme for cosplay
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  // STATE: Track which character is confirmed (not just selected)
  const [confirmedCharacter, setConfirmedCharacter] = useState(null);

  // HANDLER: Go back to character selection
  const handleBackToCharacters = () => {
    setConfirmedCharacter(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* PHASE 1: Character Selection (show until character is confirmed) */}
        {!confirmedCharacter && (
          <CharacterSelection onConfirmCharacter={setConfirmedCharacter} />
        )}

        {/* PHASE 2: Costume Builder (show after character is confirmed) */}
        {confirmedCharacter && (
          <CostumeBuilder
            character={confirmedCharacter}
            onBack={handleBackToCharacters}
          />
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
