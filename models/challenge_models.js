const ObjectId = require('mongodb').ObjectID;

exports.create=function(query){
    return new Promise(async(resolve, reject)=>{
        try {
            let challenge = {
                content: query.Content,
                expire: query.ChallengeDetail.expire,
                poin: query.ChallengeDetail.poin,
                created_at: query.ChallengeDetail.created_at
            }

            let database = require('../app').database;
            let challengeColl = database.collection('challenges');
            let result = await challengeColl.insertOne(challenge);
            resolve(result['ops'][0])
        } catch (error) {
            reject(error)
        }
    })
}

exports.getChallengeList=function(){
    return new Promise(async(resolve, reject)=>{
        try {
            let database = require('../app').database;
            let challengeColl = database.collection('challenges');
            let list = await challengeColl.find({}).toArray();
            resolve(list)
        } catch (error) {
            reject(error)
        }
    })
}