// ============================================
// COSTUME BUILDER - Appearances & Pieces
// ============================================
import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
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
  CardMedia,
  Grid,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ImageIcon from "@mui/icons-material/Image";
import { getCostumePiece, hasImage } from "../data/outfitPieceImages";

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

          {/* COSTUME PIECES TABLE (Desktop) */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'background.default' }}>
                    <TableCell>Preview</TableCell>
                    <TableCell>Piece Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Estimated Cost</TableCell>
                    <TableCell>Purchase Links</TableCell>
                  </TableRow>
                </TableHead>
              <TableBody>
                {selectedAppearance.outfitPieces.map((pieceName, index) => {
                  // Get complete piece data (simulates database row)
                  const pieceData = getCostumePiece(pieceName);
                  
                  if (!pieceData) return null; // Skip if piece not found
                  
                  // Get lowest price from purchase links
                  const lowestPrice = pieceData.purchaseLinks.length > 0 
                    ? Math.min(...pieceData.purchaseLinks.map(link => link.price))
                    : 29.99;

                  return (
                    <TableRow
                      key={index}
                      sx={{
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                    >
                      {/* PREVIEW IMAGE */}
                      <TableCell>
                        <Box
                          sx={{
                            width: 80,
                            height: 80,
                            bgcolor: 'background.default',
                            borderRadius: 1,
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {pieceData.imageUrl ? (
                            <CardMedia
                              component="img"
                              image={pieceData.imageUrl}
                              alt={pieceData.name}
                              sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                          ) : (
                            <Box sx={{ textAlign: 'center', p: 1 }}>
                              <ImageIcon sx={{ fontSize: 28, color: 'text.secondary', mb: 0.5 }} />
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem' }}>
                                Coming Soon
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </TableCell>

                      {/* PIECE NAME */}
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {pieceData.name}
                        </Typography>
                      </TableCell>

                      {/* TYPE */}
                      <TableCell>
                        <Chip label={pieceData.type} size="small" variant="outlined" />
                      </TableCell>

                      {/* COST RANGE */}
                      <TableCell>
                        {pieceData.purchaseLinks.length > 0 ? (
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              ${lowestPrice.toFixed(2)}+
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {pieceData.purchaseLinks.length} {pieceData.purchaseLinks.length === 1 ? 'option' : 'options'}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Price varies
                          </Typography>
                        )}
                      </TableCell>

                      {/* PURCHASE LINKS */}
                      <TableCell>
                        {pieceData.purchaseLinks.length > 0 ? (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {pieceData.purchaseLinks.map((link, linkIndex) => (
                              <Button
                                key={link.id}
                                variant={linkIndex === 0 ? "contained" : "outlined"}
                                size="small"
                                startIcon={<ShoppingCartIcon />}
                                component={Link}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  textTransform: 'none',
                                  textDecoration: 'none',
                                  minWidth: 140,
                                }}
                              >
                                {link.vendor} - ${link.price.toFixed(2)}
                              </Button>
                            ))}
                          </Box>
                        ) : (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<ShoppingCartIcon />}
                            component={Link}
                            href={`https://amazon.com/s?k=${encodeURIComponent(pieceData.name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              textTransform: 'none',
                              textDecoration: 'none',
                            }}
                          >
                            Search Amazon
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          </Box>

          {/* COSTUME PIECES CARDS (Mobile) */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <Grid container spacing={2}>
              {selectedAppearance.outfitPieces.map((pieceName, index) => {
                // Get complete piece data (simulates database row)
                const pieceData = getCostumePiece(pieceName);
                
                if (!pieceData) return null; // Skip if piece not found
                
                const lowestPrice = pieceData.purchaseLinks.length > 0 
                  ? Math.min(...pieceData.purchaseLinks.map(link => link.price))
                  : 29.99;

                return (
                  <Grid item xs={12} key={index}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                          {/* IMAGE */}
                          <Box
                            sx={{
                              width: 80,
                              height: 80,
                              bgcolor: 'background.default',
                              borderRadius: 1,
                              overflow: 'hidden',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {pieceData.imageUrl ? (
                              <CardMedia
                                component="img"
                                image={pieceData.imageUrl}
                                alt={pieceData.name}
                                sx={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                }}
                              />
                            ) : (
                              <Box sx={{ textAlign: 'center', p: 1 }}>
                                <ImageIcon sx={{ fontSize: 28, color: 'text.secondary', mb: 0.5 }} />
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem' }}>
                                  Coming Soon
                                </Typography>
                              </Box>
                            )}
                          </Box>

                          {/* INFO */}
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {pieceData.name}
                            </Typography>
                            <Chip label={pieceData.type} size="small" variant="outlined" sx={{ mb: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              From ${lowestPrice.toFixed(2)}
                              {pieceData.purchaseLinks.length > 1 && ` • ${pieceData.purchaseLinks.length} options`}
                            </Typography>
                          </Box>
                        </Box>

                        {/* PURCHASE BUTTONS */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {pieceData.purchaseLinks.length > 0 ? (
                            pieceData.purchaseLinks.map((link, linkIndex) => (
                              <Button
                                key={link.id}
                                variant={linkIndex === 0 ? "contained" : "outlined"}
                                size="small"
                                startIcon={<ShoppingCartIcon />}
                                component={Link}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                fullWidth
                                sx={{
                                  textTransform: 'none',
                                  textDecoration: 'none',
                                }}
                              >
                                {link.vendor} - ${link.price.toFixed(2)}
                              </Button>
                            ))
                          ) : (
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<ShoppingCartIcon />}
                              component={Link}
                              href={`https://amazon.com/s?k=${encodeURIComponent(pieceData.name)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              fullWidth
                              sx={{
                                textTransform: 'none',
                                textDecoration: 'none',
                              }}
                            >
                              Search Amazon
                            </Button>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>

          {/* TOTAL ESTIMATE */}
          <Card sx={{ mt: 3, p: 3, bgcolor: 'primary.main' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h6">
                  Estimated Total Cost:
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Based on lowest available prices
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                ${selectedAppearance.outfitPieces.reduce((total, pieceName) => {
                  const pieceData = getCostumePiece(pieceName);
                  if (!pieceData) return total;
                  const lowestPrice = pieceData.purchaseLinks.length > 0 
                    ? Math.min(...pieceData.purchaseLinks.map(link => link.price))
                    : 29.99;
                  return total + lowestPrice;
                }, 0).toFixed(2)}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mt: 2, opacity: 0.9 }}>
              * Prices are estimates and may vary by vendor and availability
            </Typography>
          </Card>
        </Box>
      )}
    </Container>
  );
}

export default CostumeBuilder;
