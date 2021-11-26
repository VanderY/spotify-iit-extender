const SpotifyWebApi = require("spotify-web-api-node");
const loginController = require("./loginController")


exports.addPlaylistToFavorite = async (req, res) => {
    if (req.session.access_token) {
        const spotifyApi = new SpotifyWebApi();
        spotifyApi.setAccessToken(req.session.access_token);
        let playlistId = req.params['playlistId']
        user = await spotifyApi.getMe()
        let tracks = await getTracksByPlaylistId(playlistId, req.session.access_token)
        let playlist = await spotifyApi.getPlaylist(playlistId)
        let tracksInFavorites = [];
        let trackIds = [];
        tracks.forEach((track) => {
            trackIds.push(track.track.id)
        })
        let unLikedTracks = []
        let unLikedTracksIds = []
        let temp, chunk = 50;
        for (let i = 0; i < trackIds.length; i += chunk) {
            temp = trackIds.slice(i, i + chunk);
            tracksInFavorites.push((await spotifyApi.containsMySavedTracks(temp)).body);
        }
        let currentTrackNumber = 0;
        tracksInFavorites.forEach((isInFavoriteArray) => {
            for (let i = 0; i < isInFavoriteArray.length; i++) {
                if (!isInFavoriteArray[i]) {
                    unLikedTracks.push(tracks[currentTrackNumber]);
                    unLikedTracksIds.push(trackIds[currentTrackNumber]);
                }
                currentTrackNumber++;
            }
        })
        if (unLikedTracksIds.length !== 0) {
            let temp, chunk = 50;
            for (let i = 0; i < unLikedTracksIds.length; i += chunk) {
                temp = unLikedTracksIds.slice(i, i + chunk);
                await spotifyApi.addToMySavedTracks(temp);
            }
            res.render("playlistToFavorite", {
                data: {
                    user: user.body, tracks: unLikedTracks, playlist: playlist.body,
                    message: unLikedTracksIds.length + " Tracks was added"
                }
            })
        } else {
            res.render("playlistTracks", {
                data: {
                    user: user.body, tracks: tracks, playlist: playlist.body,
                    message: unLikedTracksIds.length + " Tracks was added"
                }
            })
        }
    } else {
        loginController.getLoginPage(req, res);
    }
}

exports.getPlaylists = async (req, res) => {
    if (req.session.access_token) {
        let user;
        const spotifyApi = new SpotifyWebApi();
        spotifyApi.setAccessToken(req.session.access_token);
        user = await spotifyApi.getMe()
        let options = {"limit": 50, "offset": 0};
        let playlists = [];
        let data
        do {
            data = await spotifyApi.getUserPlaylists(user.body.id, options)
            data.body['items'].forEach((playlist) => {
                playlists.push(playlist)
            })
            options = {"limit": 50, "offset": data.body.offset + data.body.limit};

        } while (data.body.next != null)
        res.render("playlists", {data: {user: user.body, playlists: playlists}})
    } else {
        loginController.getLoginPage(req, res);
    }
}

exports.getPlaylistTracks = async (req, res) => {
    if (req.session.access_token) {
        const query = req.params
        let user;
        const spotifyApi = new SpotifyWebApi();
        spotifyApi.setAccessToken(req.session.access_token);
        user = await spotifyApi.getMe()
        let tracks = await getTracksByPlaylistId(query['playlistId'], req.session.access_token)
        let playlist = await spotifyApi.getPlaylist(query['playlistId'])
        res.render("playlistTracks", {data: {user: user.body, tracks: tracks, playlist: playlist.body}})
    } else {
        loginController.getLoginPage(req, res);
    }
}

async function getTracksByPlaylistId(playlistId, access_token) {
    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(access_token);

    let tracks = []
    let trackData
    let trackOptions = {"limit": 50, "offset": 0};
    do {
        trackData = await spotifyApi.getPlaylistTracks(playlistId, trackOptions)
        trackData.body['items'].forEach((track) => {
            tracks.push(track)
        })
        trackOptions = {"limit": 50, "offset": trackData.body.offset + trackData.body.limit};
    } while (trackData.body.next != null);
    return tracks;
}