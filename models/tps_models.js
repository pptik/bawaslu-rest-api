const ObjectId = require('mongodb').ObjectID;


exports.create=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let tps = {
                tps_code: query.TPSCode,
                tps_number: parseInt(query.TPSNumber),
                post_by:{
                    user_id:new ObjectId(query.UserID),
                    username:query.Username
                },
                address:{
                    desc:query.Address,
                    province:query.province,
                    regency:query.regency,
                    district:query.district,
                    village:query.village
                },
                location: {
                    type: "Point",
                    coordinates: [parseFloat(query.Longitude), parseFloat(query.Latitude)]
                },
                created_at: new Date(),
                updated_at:[],
                verified: false
            };
            let database = require('../app').database;
            let tpsColl = database.collection('tps');
            let result = await tpsColl.insertOne(tps);
            resolve(result['ops'][0])
        } catch (err) {
            reject(err)
        }
    })
};