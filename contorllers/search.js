const SpotifyWebApi = require("spotify-web-api-node");
const loginController = require("./loginController")


exports.getSearchResults = async (req, res) => {
    if (req.session.access_token) {
        const query = req.query
        let user;
        const spotifyApi = new SpotifyWebApi();
        spotifyApi.setAccessToken(req.session.access_token);
        user = await spotifyApi.getMe()
        let searchParam;
        let searchResult = [];

        let options = {"limit": 10, "offset": 0};
        if (query['searchParam'] === "byTrackName" ||
            query['searchParam'] === "byAlbumName" ||
            query['searchParam'] === "byArtistName"){
            searchParam = query['searchParam'];
        }

        if (searchParam === "byTrackName") {
            // let options = {"limit": 10, "offset": 0};
            let data
            data = await spotifyApi.searchTracks(query['search'])
            data.body['tracks']['items'].forEach((track) => {
                searchResult.push(track)
            })
            // options = {"limit": 10, "offset": data.body.offset + data.body.limit};
        }
        else if (searchParam === "byAlbumName") {
            let data
            data = await spotifyApi.searchTracks("album:" + query['search'])
            data.body['tracks']['items'].forEach((track) => {
                searchResult.push(track)
            })
        }
        else if (searchParam === "byArtistName") {
            let data
            data = await spotifyApi.searchTracks("artist:" + query['search'])
            data.body['tracks']['items'].forEach((track) => {
                searchResult.push(track)
            })
        }


        console.log(user)
        res.render("search", {data: {user: user.body, searchResult: searchResult}})
    } else {
        loginController.getLoginPage(req, res);
    }
}
