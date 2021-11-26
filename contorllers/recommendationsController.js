const SpotifyWebApi = require("spotify-web-api-node");
const loginController = require("./loginController")


exports.getRecommendations = async (req, res) => {
    if (req.session.access_token) {
        let user;
        const spotifyApi = new SpotifyWebApi();
        spotifyApi.setAccessToken(req.session.access_token);
        user = await spotifyApi.getMe()

        let topArtistsOptions = {"limit": 10, "offset": 0};
        let topArtists = [];
        let topArtistsData

        do {
            topArtistsData = await spotifyApi.getMyTopArtists(topArtistsOptions)
            topArtistsData.body['items'].forEach((artist) => {
                topArtists.push(artist)
            })
            topArtistsOptions = {"limit": 10, "offset": topArtistsData.body.offset + topArtistsData.body.limit};


        } while (topArtistsData.body.next != null)

        let options = {"limit": 10, "offset": 0};
        let recommendations = [];
        let data
        do {
            data = await spotifyApi.getRecommendations({
                min_energy: 0.4,
                seed_artists: [topArtistsData.body["items"][0]["id"], topArtistsData.body["items"][1]["id"]],
                min_popularity: 50
            })
            data.body['tracks'].forEach((track) => {
                recommendations.push(track)
            })
            options = {"limit": 10, "offset": data.body.offset + data.body.limit};

        } while (data.body.next != null)

        console.log(user)
        res.render("recommendations", {data: {user: user.body, recommendations: recommendations}})
    } else {
        loginController.getLoginPage(req, res);
    }
}
