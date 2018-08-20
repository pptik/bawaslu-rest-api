const ObjectId = require('mongodb').ObjectID;

exports.create=function(query){
    return new Promise(async(resolve, reject)=>{
        try {
            let challenge = {
                title: query.Title,
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

exports.answerChallenge=function(query){
    return new Promise(async(resolve, reject)=>{
        try {
            let challengeID = query.Challenge_id
            let database = require('../app').database;
            let challengeColl = database.collection('challenges');
            let userColl = database.collection('users');
            let editChallenge = {
                participants: {
                    user_id: query.UserID,
                    news_id: query.NewsID   
                }
            }
            await challengeColl.findOneAndUpdate(
                {_id:new ObjectId(challengeID)},
                {$push:editChallenge}
            );
            let userAnswer={
                did_challenges: {
                    challenge_id: new ObjectId(query.Challenge_id),
                    news_id: new ObjectId(query.NewsID)
                }
            }
            await userColl.findOneAndUpdate(
                {_id: new ObjectId(query.UserID)},
                {$push: userAnswer}
            );

            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
}