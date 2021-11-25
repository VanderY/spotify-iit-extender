const SpotifyWebApi = require("spotify-web-api-node");
const loginController = require("./loginController")


exports.getTopArtists = async (req, res) => {
    if (req.session.access_token) {
        const query = req.params
        let user;
        const spotifyApi = new SpotifyWebApi();
        spotifyApi.setAccessToken(req.session.access_token);
        user = await spotifyApi.getMe()
        let time_range = "medium_term"

        if (query['timeRange'] === "short_term" ||
            query['timeRange'] === "medium_term" ||
            query['timeRange'] === "long_term"){
            time_range = query['timeRange'];
        }
        let options = {"limit": 10, "offset": 0, "time_range": time_range};
        let topArtists = [];
        let data
        do {
            data = await spotifyApi.getMyTopArtists(options)
            data.body['items'].forEach((artist) => {
                topArtists.push(artist)
            })
            options = {"limit": 10, "offset": data.body.offset + data.body.limit, "time_range": time_range};

        } while (data.body.next != null)

        console.log(user)

        res.render("top-artists", {data: {user: user.body, topArtists: topArtists}})
    } else {
        loginController.getLoginPage(req, res);
    }
}
