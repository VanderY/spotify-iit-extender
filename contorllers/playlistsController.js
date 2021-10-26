const SpotifyWebApi = require("spotify-web-api-node");
const loginController = require("./loginController")


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

        let tracks = []
        let trackData
        let trackOptions = {"limit": 50, "offset": 0};
        do {
            trackData = await spotifyApi.getPlaylistTracks(query['playlistId'], trackOptions)
            trackData.body['items'].forEach((track) => {
                tracks.push(track)
            })
            trackOptions = {"limit": 50, "offset": trackData.body.offset + trackData.body.limit};
        } while (trackData.body.next != null);
        let playlist = await spotifyApi.getPlaylist(query['playlistId'])
        res.render("playlistTracks", {data: {user: user.body, tracks: tracks, playlist: playlist.body}})

    } else {
        loginController.getLoginPage(req, res);
    }
}
