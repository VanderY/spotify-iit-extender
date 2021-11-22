const express = require('express')
const router = express.Router()
const indexController = require("./contorllers/indexController")
const loginController = require("./contorllers/loginController")
const topTracks = require("./contorllers/toptracks");
const topArtists = require("./contorllers/topArtists")
const recentlyPlayed = require("./contorllers/recentlyPlayed")
const playlistsController = require("./contorllers/playlistsController");

router.get("/callback", loginController.loginCallback)
router.get("/", indexController.getHomePage)
router.get("/top-tracks", topTracks.getToptracks)
router.get("/top-artists", topArtists.getTopArtists)
router.get("/recently-played", recentlyPlayed.getRecentlyPlayedTracks)
router.get("/playlists", playlistsController.getPlaylists)
router.get("/playlists/:playlistId", playlistsController.getPlaylistTracks)
router.get("/add-playlist-to-favorite/:playlistId", playlistsController.addPlaylistToFavorite)



module.exports = router