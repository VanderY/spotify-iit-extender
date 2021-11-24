const SpotifyWebApi = require("spotify-web-api-node");
const loginController = require("./loginController")


exports.getTopArtists = async (req, res) => {
    if (req.session.access_token) {
        let user;
        const spotifyApi = new SpotifyWebApi();
        spotifyApi.setAccessToken(req.session.access_token);
        user = await spotifyApi.getMe()

        let options = {"limit": 10, "offset": 0};
        let topArtists = [];
        let data
        do {
            data = await spotifyApi.getMyTopArtists(options)
            data.body['items'].forEach((artist) => {
                topArtists.push(artist)
            })
            options = {"limit": 10, "offset": data.body.offset + data.body.limit};

        } while (data.body.next != null)

        console.log(user)

        res.render("top-artists", {data: {user: user.body, topArtists: topArtists}})
    } else {
        loginController.getLoginPage(req, res);
    }
}
