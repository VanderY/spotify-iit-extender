const SpotifyWebApi = require("spotify-web-api-node");


exports.loginCallback = function (req, res) {
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000/callback',
        clientId: 'e068dd1d33924b759f511834699cc6ba',
        clientSecret: ''
    });

    const error = req.query.error;
    const code = req.query.code;

    if (error) {
        console.error('Callback Error:', error);
        res.send(`Callback Error: ${error}`);
        return;
    }

    spotifyApi
        .authorizationCodeGrant(code)
        .then(data => {
            const access_token = data.body['access_token'];
            const refresh_token = data.body['refresh_token'];
            const expires_in = data.body['expires_in'];

            spotifyApi.setAccessToken(access_token);

            spotifyApi.setRefreshToken(refresh_token);

            console.log('access_token:', access_token);
            console.log('refresh_token:', refresh_token);

            console.log(
                `Sucessfully retreived access token. Expires in ${expires_in} s.`
            );
            setInterval(async () => {
                const data = await spotifyApi.refreshAccessToken();
                const access_token = data.body['access_token'];

                console.log('The access token has been refreshed!');
                console.log('access_token:', access_token);
                spotifyApi.setAccessToken(access_token);
            }, expires_in / 2 * 1000);

            req.session.access_token = access_token;
            req.session.save(() => {
                res.redirect('/')
            })
        })
        .catch(error => {
            console.error('Error getting Tokens:', error);
            res.send(`Error getting Tokens: ${error}`);
        });
}

exports.getLoginPage = (req, res) => {
    let scopes = ['user-read-private', 'user-read-email', 'playlist-read-private', 'user-top-read', 'user-library-read'],
        redirectUri = 'http://localhost:3000/callback',
        clientId = 'e068dd1d33924b759f511834699cc6ba',
        state = 'some-state-of-my-choice';

    let spotifyApi = new SpotifyWebApi({
        redirectUri: redirectUri,
        clientId: clientId
    });
    let authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
    res.render("login", {url: authorizeURL})
}