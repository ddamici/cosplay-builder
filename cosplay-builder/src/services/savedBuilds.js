// ============================================
// SAVED BUILDS SERVICE (Mock Backend)
// ============================================
// Simulates what the backend API will do later:
//   POST   /api/v1/user-builds
//   GET    /api/v1/user-builds
//   GET    /api/v1/user-builds/:id
//   DELETE /api/v1/user-builds/:id
//
// For now we persist to localStorage so builds survive refresh.
// When FanCon auth is ready, swap these functions for fetch() calls.

const STORAGE_KEY = "cosplayBuilder.savedBuilds";

function readBuilds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeBuilds(builds) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(builds));
}

/**
 * Create a saved outfit build
 * Mimics: POST /api/v1/user-builds
 */
export function createSavedBuild({
  buildName,
  character,
  appearance,
  selectedPieces,
  estimatedTotal,
  notes = "",
}) {
  const builds = readBuilds();

  const newBuild = {
    id: Date.now(), // temporary id; backend will return a real id
    userId: null, // anonymous for now — FanCon user id later
    buildName: buildName?.trim() || `${character.name} – ${appearance.title}`,
    notes,
    characterId: character.id,
    characterName: character.name,
    characterImage: character.image,
    appearanceId: appearance.id,
    appearanceTitle: appearance.title,
    appearanceOutfitName: appearance.outfitName,
    selectedPieces: selectedPieces.map((piece) => ({
      id: piece.id,
      name: piece.name,
      type: piece.type,
      // Prefer piece image, then first purchase-link image (remote URL)
      imageUrl:
        piece.imageUrl ||
        piece.purchaseLinks?.find((link) => link.imageUrl)?.imageUrl ||
        null,
      estimatedCostMin: piece.estimatedCostMin,
      estimatedCostMax: piece.estimatedCostMax,
    })),
    estimatedTotal,
    isPublic: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  builds.unshift(newBuild);
  writeBuilds(builds);
  return newBuild;
}

/**
 * Get all saved builds for the current user/session
 * Mimics: GET /api/v1/user-builds
 */
export function getSavedBuilds() {
  return readBuilds();
}

/**
 * Get one saved build by id
 * Mimics: GET /api/v1/user-builds/:id
 */
export function getSavedBuildById(id) {
  return readBuilds().find((build) => build.id === Number(id)) || null;
}

/**
 * Delete a saved build
 * Mimics: DELETE /api/v1/user-builds/:id
 */
export function deleteSavedBuild(id) {
  const builds = readBuilds().filter((build) => build.id !== Number(id));
  writeBuilds(builds);
  return true;
}

/**
 * Update build name / notes
 * Mimics: PUT /api/v1/user-builds/:id
 */
export function updateSavedBuild(id, updates) {
  const builds = readBuilds();
  const index = builds.findIndex((build) => build.id === Number(id));
  if (index === -1) return null;

  builds[index] = {
    ...builds[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  writeBuilds(builds);
  return builds[index];
}
