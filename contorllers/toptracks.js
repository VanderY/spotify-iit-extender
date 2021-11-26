const SpotifyWebApi = require("spotify-web-api-node");
const loginController = require("./loginController")


exports.getToptracks = async (req, res) => {
    if (req.session.access_token) {
        let user;
        const spotifyApi = new SpotifyWebApi();
        spotifyApi.setAccessToken(req.session.access_token);
        user = await spotifyApi.getMe()

        let options = {"limit": 10, "offset": 0};
        let topTracks = [];
        let data
        do {
            data = await spotifyApi.getMyTopTracks(options)
            data.body['items'].forEach((track) => {
                topTracks.push(track)
            })
            options = {"limit": 10, "offset": data.body.offset + data.body.limit};

        } while (data.body.next != null)

        console.log(user)
        res.render("top-tracks", {data: {user: user.body, topTracks: topTracks}})
    } else {
        loginController.getLoginPage(req, res);
    }
}
