// ============================================
// CHARACTER SELECTION - Material UI Version
// ============================================
import { useState } from "react";
import {
  Container,
  TextField,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Fade,
  InputAdornment,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import characters from "../data/characters";

function CharacterSelection({ onConfirmCharacter }) {
  // STATE: Search term for filtering
  const [searchTerm, setSearchTerm] = useState("");
  
  // STATE: Currently selected character (before confirmation)
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  // FILTER: Characters based on search term
  const filteredCharacters = characters.filter((character) =>
    character.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // HANDLER: Select a character card
  const handleSelectCharacter = (character) => {
    setSelectedCharacter(character);
  };

  // HANDLER: Confirm character selection
  const handleConfirm = () => {
    if (selectedCharacter) {
      onConfirmCharacter(selectedCharacter);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* HEADER */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 1,
            background: 'linear-gradient(45deg, #9c27b0 30%, #f50057 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Cosplay Builder
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Choose your character to start building
        </Typography>
      </Box>

      {/* SEARCH BAR */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for a character..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ maxWidth: 600 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* SELECTED CHARACTER INDICATOR */}
      {selectedCharacter && (
        <Fade in={true}>
          <Box
            sx={{
              mb: 3,
              p: 2,
              bgcolor: 'primary.main',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CheckCircleIcon sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h6">
                  Selected: {selectedCharacter.name}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Ready to build your costume?
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              size="large"
              onClick={handleConfirm}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': { bgcolor: 'grey.200' },
                fontWeight: 600,
              }}
            >
              Continue with {selectedCharacter.name}
            </Button>
          </Box>
        </Fade>
      )}

      {/* CHARACTER GRID */}
      <Grid container spacing={3}>
        {filteredCharacters.map((character) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={character.id}>
            <Card
              onClick={() => handleSelectCharacter(character)}
              sx={{
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                border: selectedCharacter?.id === character.id ? 3 : 0,
                borderColor: 'primary.main',
                transform: selectedCharacter?.id === character.id ? 'scale(1.02)' : 'scale(1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                },
              }}
            >
              {/* CHARACTER IMAGE */}
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  image={character.image}
                  alt={character.name}
                  sx={{
                    height: 300,
                    objectFit: 'cover',
                  }}
                />
                {/* SELECTED BADGE */}
                {selectedCharacter?.id === character.id && (
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="Selected"
                    color="primary"
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      fontWeight: 600,
                    }}
                  />
                )}
              </Box>

              {/* CHARACTER NAME */}
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ fontWeight: 600 }}
                >
                  {character.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* NO RESULTS MESSAGE */}
      {filteredCharacters.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No characters found matching "{searchTerm}"
          </Typography>
        </Box>
      )}
    </Container>
  );
}

export default CharacterSelection;
