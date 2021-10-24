const SpotifyWebApi = require("spotify-web-api-node");
const helper = require("./helper");


exports.toptracks = (req, res) => {
    if (req.session.access_token) {
        let topTracks;
        let user;
        const spotifyApi = new SpotifyWebApi();
        spotifyApi.setAccessToken(req.session.access_token);
        spotifyApi.getMyTopTracks()
            .then(function (data) {
                topTracks = data.body.items;
                user = helper.getUserInfo(spotifyApi).then((user) => {
                    res.render("top-tracks", {data: {user: user, topTracks: topTracks}})
                }).catch((err) => {
                    console.log('Something went wrong!', err);
                })
                console.log(topTracks);
            }, function (err) {
                console.log('Something went wrong!', err);
            });
    } else {
        let scopes = ['user-read-private', 'user-read-email', 'playlist-read-private', 'user-top-read'],
            redirectUri = 'http://localhost:3000/callback',
            clientId = '',
            state = 'some-state-of-my-choice';

        let spotifyApi = new SpotifyWebApi({
            redirectUri: redirectUri,
            clientId: clientId
        });
        let authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
        res.render("login", {url: authorizeURL})
    }
}
