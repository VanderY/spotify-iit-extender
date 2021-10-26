const SpotifyWebApi = require('spotify-web-api-node');
const loginController = require("./loginController");

exports.getHomePage = async (req, res) => {
    let user;
    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(req.session.access_token);
    if (req.session.access_token) {
        user = await spotifyApi.getMe()
        res.render("index", {data: {user: user.body}})
    } else {
        loginController.getLoginPage(req, res);
    }
}