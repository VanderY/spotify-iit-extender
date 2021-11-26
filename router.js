const express = require('express')
const router = express.Router()
const indexController = require("./contorllers/indexController")
const loginController = require("./contorllers/loginController")
const topTracks = require("./contorllers/toptracks");
const topArtists = require("./contorllers/topArtists")
const recommendations = require("./contorllers/recommendationsController")
const recentlyPlayed = require("./contorllers/recentlyPlayed")
const playlistsController = require("./contorllers/playlistsController");
const search = require("./contorllers/search");

router.get("/callback", loginController.loginCallback)
router.get("/", indexController.getHomePage)
router.get("/top-tracks", topTracks.getToptracks)
router.get("/recommendations", recommendations.getRecommendations)
router.get("/top-artists", topArtists.getTopArtists)
router.get("/top-artists/:timeRange", topArtists.getTopArtists)
router.get("/recently-played", recentlyPlayed.getRecentlyPlayedTracks)
router.get("/playlists", playlistsController.getPlaylists)
router.get("/search", search.getSearchResults)
router.get("/playlists/:playlistId", playlistsController.getPlaylistTracks)
router.get("/add-playlist-to-favorite/:playlistId", playlistsController.addPlaylistToFavorite)



module.exports = router