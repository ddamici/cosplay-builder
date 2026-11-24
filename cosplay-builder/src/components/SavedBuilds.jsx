// ============================================
// SAVED BUILDS - User's saved outfits
// ============================================
// Mimics a future "My Profile > Saved Outfits" page
import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Chip,
  Grid,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import { getSavedBuilds, deleteSavedBuild } from "../services/savedBuilds";

function SavedBuilds({ onBack, onBuildsChanged }) {
  const [builds, setBuilds] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    setBuilds(getSavedBuilds());
  }, []);

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteSavedBuild(deleteTarget.id);
    setBuilds(getSavedBuilds());
    onBuildsChanged?.();
    setDeleteTarget(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={onBack}
        variant="outlined"
        sx={{ mb: 3 }}
      >
        Back to Characters
      </Button>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          My Saved Outfits
        </Typography>
        <Typography color="text.secondary">
          Builds you save here will later sync to your FanCon profile.
        </Typography>
      </Box>

      {builds.length === 0 ? (
        <Card sx={{ p: 4, textAlign: "center" }}>
          <CheckroomIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            No saved outfits yet
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Pick a character, choose an appearance, select pieces, then hit Save Outfit.
          </Typography>
          <Button variant="contained" onClick={onBack}>
            Start Building
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {builds.map((build) => (
            <Grid item xs={12} md={6} key={build.id}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Avatar
                      src={build.characterImage}
                      alt={build.characterName}
                      sx={{ width: 64, height: 64 }}
                    />
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }} noWrap>
                        {build.buildName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {build.characterName}
                      </Typography>
                      <Chip
                        size="small"
                        label={build.appearanceTitle}
                        sx={{ mt: 1 }}
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                    <IconButton
                      aria-label="Delete build"
                      color="error"
                      onClick={() => setDeleteTarget(build)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                    Selected pieces ({build.selectedPieces.length})
                  </Typography>

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                    {build.selectedPieces.map((piece) => (
                      <Box
                        key={piece.id}
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 1,
                          overflow: "hidden",
                          bgcolor: "grey.900",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          p: 0.5,
                        }}
                        title={piece.name}
                      >
                        {piece.imageUrl ? (
                          <CardMedia
                            component="img"
                            image={piece.imageUrl}
                            alt={piece.name}
                            sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                          />
                        ) : (
                          <CheckroomIcon fontSize="small" color="disabled" />
                        )}
                      </Box>
                    ))}
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Saved {new Date(build.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      ${Number(build.estimatedTotal).toFixed(2)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete this outfit?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {deleteTarget
              ? `“${deleteTarget.buildName}” will be removed from your saved outfits.`
              : ""}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default SavedBuilds;
