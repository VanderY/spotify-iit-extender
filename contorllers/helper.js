

exports.getUserInfo = function(spotifyApi){
    return new Promise((resolve, reject) => {
        spotifyApi.getMe().then((data) => {
                resolve(data.body)
            },
            (err) => {
                reject(err.body)
            })
    })
}

//return new Promise((resolve, reject) => {
//         //this.data.push({status: "false"})
//         this.data['status'] = false
//         ordersCollection.insertOne(this.data).then(
//             resolve("Your drink will be done soon")
//         ).catch(() => {
//                 reject("Something went wrong")
//             }
//         )
//     })