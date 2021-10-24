const SpotifyWebApi = require('spotify-web-api-node');
const helper = require('./helper')

exports.home = function (req, res) {
    let user;
    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(req.session.access_token);
    if (req.session.access_token) {
        user = helper.getUserInfo(spotifyApi).then((user) => {
            res.render("index", {data: {user: user}})
        }).catch((err) => {
            console.log('Something went wrong!', err);
        })
        //res.render("index")
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