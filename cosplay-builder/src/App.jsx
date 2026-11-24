// ============================================
// APP.JSX - Main Component with Material UI
// ============================================
import { useState } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Badge,
} from "@mui/material";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import CharacterSelection from "./components/CharacterSelection";
import CostumeBuilder from "./components/CostumeBuilder";
import SavedBuilds from "./components/SavedBuilds";
import { getSavedBuilds } from "./services/savedBuilds";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#9c27b0",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  // null | character object
  const [confirmedCharacter, setConfirmedCharacter] = useState(null);
  // "select" | "build" | "saved"
  const [view, setView] = useState("select");
  const [savedCount, setSavedCount] = useState(() => getSavedBuilds().length);

  const refreshSavedCount = () => {
    setSavedCount(getSavedBuilds().length);
  };

  const handleConfirmCharacter = (character) => {
    setConfirmedCharacter(character);
    setView("build");
  };

  const handleBackToCharacters = () => {
    setConfirmedCharacter(null);
    setView("select");
    refreshSavedCount();
  };

  const handleViewSavedBuilds = () => {
    refreshSavedCount();
    setView("saved");
  };

  const handleBackFromSaved = () => {
    if (confirmedCharacter) {
      setView("build");
    } else {
      setView("select");
    }
    refreshSavedCount();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Toolbar sx={{ gap: 2 }}>
            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
                fontWeight: 700,
                cursor: "pointer",
              }}
              onClick={handleBackToCharacters}
            >
              Cosplay Builder
            </Typography>
            <Button
              color="inherit"
              startIcon={
                <Badge badgeContent={savedCount} color="secondary" max={99}>
                  <BookmarkAddedIcon />
                </Badge>
              }
              onClick={handleViewSavedBuilds}
            >
              My Outfits
            </Button>
          </Toolbar>
        </AppBar>

        {view === "select" && (
          <CharacterSelection onConfirmCharacter={handleConfirmCharacter} />
        )}

        {view === "build" && confirmedCharacter && (
          <CostumeBuilder
            character={confirmedCharacter}
            onBack={handleBackToCharacters}
            onViewSavedBuilds={handleViewSavedBuilds}
            onBuildSaved={refreshSavedCount}
          />
        )}

        {view === "saved" && (
          <SavedBuilds
            onBack={handleBackFromSaved}
            onBuildsChanged={refreshSavedCount}
          />
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
