// ============================================
// COSTUME BUILDER - Appearances & Pieces
// ============================================
import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  IconButton,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ImageIcon from "@mui/icons-material/Image";

function CostumeBuilder({ character, onBack }) {
  // STATE: Selected appearance
  const [selectedAppearance, setSelectedAppearance] = useState(null);

  // Check if character has appearances
  const hasAppearances = character.appearances && character.appearances.length > 0;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* HEADER WITH BACK BUTTON */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ mb: 2 }}
          variant="outlined"
        >
          Back to Characters
        </Button>

        {/* CHARACTER INFO */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
          <Avatar
            src={character.image}
            alt={character.name}
            sx={{ width: 100, height: 100 }}
          />
          <Box>
            <Typography variant="overline" color="text.secondary">
              Selected Character
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {character.name}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* APPEARANCES SECTION */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Choose an Appearance
        </Typography>

        {hasAppearances ? (
          <Grid container spacing={3}>
            {character.appearances.map((appearance) => {
              const isSelected = selectedAppearance?.id === appearance.id;

              return (
                <Grid item xs={12} md={6} key={appearance.id}>
                  <Card
                    onClick={() => setSelectedAppearance(appearance)}
                    sx={{
                      cursor: 'pointer',
                      border: isSelected ? 2 : 0,
                      borderColor: 'secondary.main',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: 4,
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        {/* SELECT INDICATOR */}
                        <Box>
                          {isSelected ? (
                            <CheckCircleIcon color="secondary" sx={{ fontSize: 32 }} />
                          ) : (
                            <RadioButtonUncheckedIcon sx={{ fontSize: 32, color: 'text.secondary' }} />
                          )}
                        </Box>

                        {/* APPEARANCE INFO */}
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {appearance.title}
                          </Typography>
                          <Chip
                            label={appearance.outfitName}
                            size="small"
                            color="primary"
                            sx={{ mb: 1 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {appearance.description}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Card sx={{ bgcolor: 'background.paper', p: 3 }}>
            <Typography color="text.secondary">
              No appearances available for this character yet.
            </Typography>
          </Card>
        )}
      </Box>

      {/* COSTUME PIECES SECTION (Only show if appearance is selected) */}
      {selectedAppearance && (
        <Box>
          <Divider sx={{ mb: 4 }} />
          
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Outfit Components
          </Typography>

          <Card sx={{ bgcolor: 'background.paper', mb: 2, p: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Selected Appearance:</strong> {selectedAppearance.title} - {selectedAppearance.outfitName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Choose which pieces you want to include in your costume
            </Typography>
          </Card>

          {/* COSTUME PIECES TABLE */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'background.default' }}>
                  <TableCell>Preview</TableCell>
                  <TableCell>Piece Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Estimated Cost</TableCell>
                  <TableCell>Purchase Link</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedAppearance.outfitPieces.map((piece, index) => {
                  // Generate mock data for demonstration
                  const pieceTypes = {
                    'White Jumpsuit': 'Clothing',
                    'Tactical Vest': 'Clothing',
                    'Utility Belt': 'Accessory',
                    'White Lace-up Boots': 'Footwear',
                    'Fingerless Gloves': 'Accessory',
                    'Holster': 'Accessory',
                    'Wig': 'Wig',
                    'Black Bodysuit': 'Clothing',
                    'Black Boots': 'Footwear',
                  };

                  const mockCosts = {
                    'White Jumpsuit': '$89.99',
                    'Tactical Vest': '$45.00',
                    'Utility Belt': '$25.00',
                    'White Lace-up Boots': '$65.00',
                    'Fingerless Gloves': '$15.00',
                    'Holster': '$20.00',
                    'Wig': '$35.00',
                    'Black Bodysuit': '$75.00',
                    'Black Boots': '$55.00',
                  };

                  const mockVendors = {
                    'White Jumpsuit': 'Amazon',
                    'Tactical Vest': 'Etsy',
                    'Utility Belt': 'Amazon',
                    'White Lace-up Boots': 'Amazon',
                    'Fingerless Gloves': 'Amazon',
                    'Holster': 'Spirit Halloween',
                    'Wig': 'Amazon',
                    'Black Bodysuit': 'Amazon',
                    'Black Boots': 'Amazon',
                  };

                  const pieceType = pieceTypes[piece] || 'Item';
                  const cost = mockCosts[piece] || '$29.99';
                  const vendor = mockVendors[piece] || 'Amazon';

                  return (
                    <TableRow
                      key={index}
                      sx={{
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                    >
                      {/* PREVIEW (Mock image) */}
                      <TableCell>
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            bgcolor: 'background.default',
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <ImageIcon sx={{ fontSize: 32, color: 'text.secondary' }} />
                        </Box>
                      </TableCell>

                      {/* PIECE NAME */}
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {piece}
                        </Typography>
                      </TableCell>

                      {/* TYPE */}
                      <TableCell>
                        <Chip label={pieceType} size="small" variant="outlined" />
                      </TableCell>

                      {/* COST */}
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {cost}
                        </Typography>
                      </TableCell>

                      {/* PURCHASE LINK */}
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<ShoppingCartIcon />}
                          component={Link}
                          href={`https://amazon.com/s?k=${encodeURIComponent(piece)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            textTransform: 'none',
                            textDecoration: 'none',
                          }}
                        >
                          Buy on {vendor}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* TOTAL ESTIMATE */}
          <Card sx={{ mt: 3, p: 3, bgcolor: 'primary.main' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                Estimated Total Cost:
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                $295.00
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
              * Prices are estimates and may vary
            </Typography>
          </Card>
        </Box>
      )}
    </Container>
  );
}

export default CostumeBuilder;
