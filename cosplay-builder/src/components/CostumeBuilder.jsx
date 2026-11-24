// ============================================
// COSTUME BUILDER - Appearances, Pieces & Save
// ============================================
import { useEffect, useMemo, useState } from "react";
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
  Divider,
  CardMedia,
  Grid,
  Checkbox,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ImageIcon from "@mui/icons-material/Image";
import SaveIcon from "@mui/icons-material/Save";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import { getCostumePiece, getPiecePreviewImage } from "../data/outfitPieceImages";
import { createSavedBuild } from "../services/savedBuilds";

function getLowestPrice(pieceData) {
  if (!pieceData?.purchaseLinks?.length) return 29.99;
  return Math.min(...pieceData.purchaseLinks.map((link) => link.price));
}

function CostumeBuilder({ character, onBack, onViewSavedBuilds, onBuildSaved }) {
  const [selectedAppearance, setSelectedAppearance] = useState(null);
  const [selectedPieceIds, setSelectedPieceIds] = useState([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [buildName, setBuildName] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const hasAppearances = character.appearances && character.appearances.length > 0;

  // Resolve full piece objects for the selected appearance
  const appearancePieces = useMemo(() => {
    if (!selectedAppearance) return [];
    return selectedAppearance.outfitPieces
      .map((pieceName) => getCostumePiece(pieceName))
      .filter(Boolean);
  }, [selectedAppearance]);

  // When appearance changes, select all pieces by default
  useEffect(() => {
    if (!selectedAppearance) {
      setSelectedPieceIds([]);
      return;
    }
    const pieces = selectedAppearance.outfitPieces
      .map((pieceName) => getCostumePiece(pieceName))
      .filter(Boolean);
    setSelectedPieceIds(pieces.map((piece) => piece.id));
    setBuildName(`${character.name} – ${selectedAppearance.title}`);
  }, [selectedAppearance, character.name]);

  const selectedPieces = appearancePieces.filter((piece) =>
    selectedPieceIds.includes(piece.id)
  );

  const selectedTotal = selectedPieces.reduce(
    (total, piece) => total + getLowestPrice(piece),
    0
  );

  const allSelected =
    appearancePieces.length > 0 &&
    selectedPieceIds.length === appearancePieces.length;

  const handleTogglePiece = (pieceId) => {
    setSelectedPieceIds((prev) =>
      prev.includes(pieceId)
        ? prev.filter((id) => id !== pieceId)
        : [...prev, pieceId]
    );
  };

  const handleToggleAll = () => {
    if (allSelected) {
      setSelectedPieceIds([]);
    } else {
      setSelectedPieceIds(appearancePieces.map((piece) => piece.id));
    }
  };

  const handleSelectAppearance = (appearance) => {
    setSelectedAppearance(appearance);
  };

  const handleOpenSave = () => {
    if (selectedPieces.length === 0) {
      setSnackbar({
        open: true,
        message: "Select at least one outfit piece before saving.",
        severity: "warning",
      });
      return;
    }
    setSaveDialogOpen(true);
  };

  const handleSaveBuild = () => {
    const saved = createSavedBuild({
      buildName,
      character,
      appearance: selectedAppearance,
      selectedPieces,
      estimatedTotal: selectedTotal,
    });

    setSaveDialogOpen(false);
    onBuildSaved?.();
    setSnackbar({
      open: true,
      message: `Saved “${saved.buildName}”`,
      severity: "success",
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* HEADER */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mb: 2,
          }}
        >
          <Button startIcon={<ArrowBackIcon />} onClick={onBack} variant="outlined">
            Back to Characters
          </Button>
          {onViewSavedBuilds && (
            <Button
              startIcon={<BookmarkAddedIcon />}
              onClick={onViewSavedBuilds}
              variant="text"
            >
              My Saved Outfits
            </Button>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
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

      {/* APPEARANCES */}
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
                    onClick={() => handleSelectAppearance(appearance)}
                    sx={{
                      cursor: "pointer",
                      border: isSelected ? 2 : 0,
                      borderColor: "secondary.main",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: 4,
                        transform: "translateY(-4px)",
                      },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                        <Box>
                          {isSelected ? (
                            <CheckCircleIcon color="secondary" sx={{ fontSize: 32 }} />
                          ) : (
                            <RadioButtonUncheckedIcon
                              sx={{ fontSize: 32, color: "text.secondary" }}
                            />
                          )}
                        </Box>
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
          <Card sx={{ bgcolor: "background.paper", p: 3 }}>
            <Typography color="text.secondary">
              No appearances available for this character yet.
            </Typography>
          </Card>
        )}
      </Box>

      {/* OUTFIT PIECES */}
      {selectedAppearance && (
        <Box>
          <Divider sx={{ mb: 4 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 2,
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                Outfit Components
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Select the pieces you want to include, then save your outfit.
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button variant="outlined" onClick={handleToggleAll}>
                {allSelected ? "Clear All" : "Select All"}
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleOpenSave}
                disabled={selectedPieces.length === 0}
              >
                Save Outfit
              </Button>
            </Box>
          </Box>

          <Card sx={{ bgcolor: "background.paper", mb: 2, p: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              <strong>Selected Appearance:</strong> {selectedAppearance.title} –{" "}
              {selectedAppearance.outfitName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedPieces.length} of {appearancePieces.length} pieces selected
            </Typography>
          </Card>

          {/* DESKTOP TABLE */}
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "background.default" }}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={allSelected}
                        indeterminate={
                          selectedPieceIds.length > 0 &&
                          selectedPieceIds.length < appearancePieces.length
                        }
                        onChange={handleToggleAll}
                        inputProps={{ "aria-label": "Select all pieces" }}
                      />
                    </TableCell>
                    <TableCell>Preview</TableCell>
                    <TableCell>Piece Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Estimated Cost</TableCell>
                    <TableCell>Purchase Links</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appearancePieces.map((pieceData) => {
                    const isChecked = selectedPieceIds.includes(pieceData.id);
                    const lowestPrice = getLowestPrice(pieceData);

                    return (
                      <TableRow
                        key={pieceData.id}
                        hover
                        selected={isChecked}
                        onClick={() => handleTogglePiece(pieceData.id)}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell
                          padding="checkbox"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            checked={isChecked}
                            onChange={() => handleTogglePiece(pieceData.id)}
                            inputProps={{ "aria-label": `Select ${pieceData.name}` }}
                          />
                        </TableCell>
                        <TableCell>
                        <Box
                          sx={{
                            width: 80,
                            height: 80,
                            bgcolor: "grey.900",
                            borderRadius: 1,
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            p: 0.5,
                          }}
                        >
                            {getPiecePreviewImage(pieceData) ? (
                              <CardMedia
                                component="img"
                                image={getPiecePreviewImage(pieceData)}
                                alt={pieceData.name}
                                sx={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                }}
                              />
                            ) : (
                              <Box sx={{ textAlign: "center", p: 1 }}>
                                <ImageIcon
                                  sx={{ fontSize: 28, color: "text.secondary", mb: 0.5 }}
                                />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ display: "block", fontSize: "0.65rem" }}
                                >
                                  Coming Soon
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {pieceData.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={pieceData.type} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            ${lowestPrice.toFixed(2)}+
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {pieceData.purchaseLinks.length}{" "}
                            {pieceData.purchaseLinks.length === 1 ? "option" : "options"}
                          </Typography>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
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
                                  textTransform: "none",
                                  textDecoration: "none",
                                  minWidth: 140,
                                }}
                              >
                                {link.vendor} - ${link.price.toFixed(2)}
                              </Button>
                            ))}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* MOBILE CARDS */}
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            <Grid container spacing={2}>
              {appearancePieces.map((pieceData) => {
                const isChecked = selectedPieceIds.includes(pieceData.id);
                const lowestPrice = getLowestPrice(pieceData);

                return (
                  <Grid item xs={12} key={pieceData.id}>
                    <Card
                      onClick={() => handleTogglePiece(pieceData.id)}
                      sx={{
                        border: isChecked ? 2 : 0,
                        borderColor: "primary.main",
                        cursor: "pointer",
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                          <Box onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={isChecked}
                              onChange={() => handleTogglePiece(pieceData.id)}
                              inputProps={{ "aria-label": `Select ${pieceData.name}` }}
                              sx={{ p: 0, alignSelf: "flex-start" }}
                            />
                          </Box>
                          <Box
                            sx={{
                              width: 80,
                              height: 80,
                              bgcolor: "grey.900",
                              borderRadius: 1,
                              overflow: "hidden",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              p: 0.5,
                            }}
                          >
                            {getPiecePreviewImage(pieceData) ? (
                              <CardMedia
                                component="img"
                                image={getPiecePreviewImage(pieceData)}
                                alt={pieceData.name}
                                sx={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                }}
                              />
                            ) : (
                              <Box sx={{ textAlign: "center", p: 1 }}>
                                <ImageIcon
                                  sx={{ fontSize: 28, color: "text.secondary", mb: 0.5 }}
                                />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ display: "block", fontSize: "0.65rem" }}
                                >
                                  Coming Soon
                                </Typography>
                              </Box>
                            )}
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {pieceData.name}
                            </Typography>
                            <Chip
                              label={pieceData.type}
                              size="small"
                              variant="outlined"
                              sx={{ mb: 1 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              From ${lowestPrice.toFixed(2)}
                              {pieceData.purchaseLinks.length > 1 &&
                                ` • ${pieceData.purchaseLinks.length} options`}
                            </Typography>
                          </Box>
                        </Box>

                        <Box
                          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                          onClick={(e) => e.stopPropagation()}
                        >
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
                              fullWidth
                              sx={{
                                textTransform: "none",
                                textDecoration: "none",
                              }}
                            >
                              {link.vendor} - ${link.price.toFixed(2)}
                            </Button>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>

          {/* TOTAL + SAVE */}
          <Card sx={{ mt: 3, p: 3, bgcolor: "primary.main" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="h6">Selected Pieces Total:</Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  {selectedPieces.length} piece
                  {selectedPieces.length === 1 ? "" : "s"} · lowest available prices
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  ${selectedTotal.toFixed(2)}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleOpenSave}
                  disabled={selectedPieces.length === 0}
                  sx={{
                    bgcolor: "white",
                    color: "primary.main",
                    "&:hover": { bgcolor: "grey.200" },
                    fontWeight: 600,
                  }}
                >
                  Save Outfit
                </Button>
              </Box>
            </Box>
          </Card>
        </Box>
      )}

      {/* SAVE DIALOG */}
      <Dialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Save Outfit</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This will be stored locally for now (like a backend save). Later it will
            attach to your FanCon user profile.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            label="Outfit name"
            value={buildName}
            onChange={(e) => setBuildName(e.target.value)}
            margin="dense"
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Character:</strong> {character.name}
            </Typography>
            <Typography variant="body2">
              <strong>Appearance:</strong> {selectedAppearance?.title}
            </Typography>
            <Typography variant="body2">
              <strong>Pieces:</strong> {selectedPieces.length}
            </Typography>
            <Typography variant="body2">
              <strong>Estimated total:</strong> ${selectedTotal.toFixed(2)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveBuild}
            disabled={!buildName.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          action={
            snackbar.severity === "success" && onViewSavedBuilds ? (
              <Button color="inherit" size="small" onClick={onViewSavedBuilds}>
                View Saved
              </Button>
            ) : null
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default CostumeBuilder;
