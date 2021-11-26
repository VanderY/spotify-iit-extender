const SpotifyWebApi = require("spotify-web-api-node");
const loginController = require("./loginController")


exports.getRecentlyPlayedTracks = async (req, res) => {
    if (req.session.access_token) {
        let user;
        const spotifyApi = new SpotifyWebApi();
        spotifyApi.setAccessToken(req.session.access_token);
        user = await spotifyApi.getMe()

        let options = {"limit": 50};
        let topTracks = [];
        let data
        data = await spotifyApi.getMyRecentlyPlayedTracks(options)
        data.body['items'].forEach((track) => {
            topTracks.push(track['track'])
        })



        console.log(user)
        res.render("recently-played", {data: {user: user.body, topTracks: topTracks}})
    } else {
        loginController.getLoginPage(req, res);
    }
}
