const bcrypt = require('bcrypt');
const saltRounds = 10;
const md5 = require('md5');
const moment = require('moment');
const base64 = require('base-64');
const ObjectId = require('mongodb').ObjectID;

exports.checkIfUserIsAdmin=function(UserID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userColl = database.collection('users');
            let user = await userColl.findOne({ _id: new ObjectId(UserID) });
            if (user.role===0) resolve(true);
            else resolve(false)
        } catch (err) {
            reject(err)
        }
    })
};
exports.checkUserReferenceCode=function(Code) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userColl = database.collection('users');
            let users = await userColl.findOne({ reference_code: Code });
            if (users) resolve(users);
            else resolve(false)
        } catch (err) {
            reject(err)
        }
    })
};
exports.checkReferenceCode=function(Code) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userColl = database.collection('users');
            let users = await userColl.find({ reference_code: Code }).toArray();
            if (users.length > 0) resolve(true);
            else resolve(false)
        } catch (err) {
            reject(err)
        }
    })
};
exports.checkUsername=function(Username) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userColl = database.collection('users');
            let users = await userColl.find({ username: Username }).toArray();
            if (users.length > 0) resolve(true);
            else resolve(false)
        } catch (err) {
            reject(err)
        }
    })
};
exports.checkIdentificationNumber=function(identificationNumber) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userColl = database.collection('users');
            let users = await userColl.find({ identification_number: identificationNumber }).toArray();
            if (users.length > 0) resolve(true);
            else resolve(false)
        } catch (err) {
            reject(err)
        }
    })
};
exports.checkEmail=function(Email) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userColl = database.collection('users');
            let users = await userColl.find({ email: Email }).toArray();
            if (users.length > 0) resolve(true);
            else resolve(false)
        } catch (err) {
            reject(err)
        }
    })
};
exports.checkPhoneNumber=function(PhoneNumber) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userColl = database.collection('users');
            let users = await userColl.find({ phone_number: PhoneNumber }).toArray();
            if (users.length > 0) resolve(true);
            else resolve(false)
        } catch (err) {
            reject(err)
        }
    })
};
exports.signup=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let passHash = await bcrypt.hash(query.password, saltRounds);
            let user = {
                identification_number: query.identificationNumber,
                email: query.email,
                phone_number: query.phoneNumber,
                name: query.name,
                username: query.username,
                password: passHash,
                address:{
                    desc:query.address,
                    province:query.province,
                    regency:query.regency,
                    district:query.district,
                    village:query.village
                },
                location: {
                    type: "Point",
                    coordinates: [parseFloat(0), parseFloat(0)]
                },
                created_at: new Date(),
                display_picture: "",
                role: 2,
                signup_type: parseInt(query.signupType),
                verified: false,
                fcm_id:"",
                poin:0,
                following_count:0,
                follower_count:0,
                access: []
            };
            let database = require('../app').database;
            let userColl = database.collection('users');
            let result = await userColl.insertOne(user);
            resolve(result['ops'][0])
        } catch (err) {
            reject(err)
        }
    })
};
exports.signupSimple=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let passHash = await bcrypt.hash(query.Password, saltRounds);
            let user = {
                identification_number: '-',
                email: query.Email,
                phone_number: query.PhoneNumber,
                ttl:'',
                religion:'',
                degree:'',
                marital_status:'',
                job:'',
                name: '-',
                username: query.Username,
                password: passHash,
                address:'',
                location: {
                    type: "Point",
                    coordinates: [parseFloat(0), parseFloat(0)]
                },
                created_at: new Date(),
                display_picture: "http://filehosting.pptik.id/ioaa/defaultphoto.png",
                role: 2,
                signup_type: parseInt(query.SignupType),
                verified: true,
                fcm_id:"",
                poin:0,
                following_count:0,
                follower_count:0,
                reference_code:"-",
                referenced_by:{
                    UserID: query.ReferencedBy._id,
                    Username:query.ReferencedBy.username
                },
                user_reference:[],
                access: []
            };
            let database = require('../app').database;
            let userColl = database.collection('users');
            let result = await userColl.insertOne(user);
            resolve(result['ops'][0])
        } catch (err) {
            reject(err)
        }
    })
};
exports.changePassword=function(query){
    return new Promise(async(resolve, reject) => {
        try {
            let passHash = await bcrypt.hash(query.new_password, saltRounds);
            let userUpdate = {
                $set: {
                    password: passHash
                }
            }
            let database = require('../app').database;
            let userColl = database.collection('users');
            let result = await userColl.updateOne({ _id: query.UserID}, userUpdate);
            resolve(result)
        } catch (error) {
            reject(error)
        }
    });
};
exports.registerLeader=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let passHash = await bcrypt.hash(query.Password, saltRounds);
            let user = {
                identification_number: '-',
                email: query.Email,
                phone_number: query.PhoneNumber,
                ttl:'',
                religion:'',
                degree:'',
                marital_status:'',
                job:'',
                name: '-',
                username: query.Username,
                password: passHash,
                address:'',
                location: {
                    type: "Point",
                    coordinates: [parseFloat(0), parseFloat(0)]
                },
                created_at: new Date(),
                display_picture: "http://filehosting.pptik.id/ioaa/defaultphoto.png",
                role: 1,
                signup_type: parseInt(query.SignupType),
                verified: true,
                fcm_id:"",
                poin:0,
                leader_poin:0,
                following_count:0,
                follower_count:0,
                reference_code:query.ReferenceCode,
                referenced_by:{
                },
                user_reference:[],
                access: []
            };
            let database = require('../app').database;
            let userColl = database.collection('users');
            let result = await userColl.insertOne(user);
            resolve(result['ops'][0])
        } catch (err) {
            reject(err)
        }
    })
};
exports.findUserProfileByEmail=function(Email) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userColl = database.collection('users');
            let profile = await userColl.findOne({ email: Email });
            resolve(profile);
        } catch (err) {
            reject(err)
        }
    })
};
exports.findUserProfileByUserID=function(UserID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userColl = database.collection('users');
            let profile = await userColl.findOne({ _id: new ObjectId(UserID) });
            if (profile){
                resolve(profile)
            }else resolve(false)
        } catch (err) {
            reject(err)
        }
    })
};
exports.findUserProfileByPhone=function(PhoneNumber) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userColl = database.collection('users');
            let profile = await userColl.findOne({ phone_number: PhoneNumber });
            resolve(profile);
        } catch (err) {
            reject(err)
        }
    })
};
exports.findUserProfileByUsername=function(Username) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userColl = database.collection('users');
            let profile = await userColl.findOne({ username: Username });
            if(profile){
                resolve(profile);
            }else {
                resolve(false);
            }
        } catch (err) {
            reject(err)
        }
    })
};
exports.regenerateToken=function(token, username, query) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userColl = database.collection('users');
            await userColl.updateOne({ username: username }, {
                $pull: { access: { token: token } }
            });
            let newAccess = {
                created_at: new Date(),
                token: md5(username + moment().format('YYYYMMDDHHmmss')),
                current_device: query.current_device,
                current_number: query.current_number,
                carrier: query.carrier,
                app_id: parseInt(query.app_id)
            };
            await userColl.updateOne({ username: username }, {
                $push: { access: newAccess }
            });
            let user = await getUserDetailByUsername(username);
            delete user.access;
            delete user.password;
            let encodedUsername = base64.encode(username);
            user.access_token = encodedUsername+'~'+newAccess.token;
            resolve(user)
        } catch (error) {
            reject(error)
        }
    })
};
getUserDetailByUsername = (userName) => {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userColl = await database.collection('users');
            let users = await userColl.findOne({ username: userName });
            if (users) resolve(users);
            else resolve(false)
        } catch (err) {
            reject(err)
        }
    })
};

exports.getListAllUser=function() {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userColl = database.collection('users');
            let users = await userColl.find().toArray();
            resolve(users);
        } catch (err) {
            reject(err)
        }
    })
};
exports.getListVerifiedUser=function() {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userColl = database.collection('users');
            let users = await userColl.find({verified:true}).toArray();
            resolve(users);
        } catch (err) {
            reject(err)
        }
    })
};
exports.getListNotVerifiedUser=function() {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userColl = database.collection('users');
            let users = await userColl.find({verified:false}).toArray();
            resolve(users);
        } catch (err) {
            reject(err)
        }
    })
};
exports.verifyUser=function(UserID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userColl = database.collection('users');
            let userQuery={
                verified:true
            };
            await userColl.updateOne({ _id: new ObjectId(UserID) }, {$set:{userQuery}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.addPoinToUser=function(UserID,Poin) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userColl = database.collection('users');
            await userColl.findOneAndUpdate({_id:new ObjectId(UserID)},{$inc:{"poin":Poin}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.subtractPoinFromUser=function(UserID,Poin) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userColl = database.collection('users');
            await userColl.findOneAndUpdate({_id:new ObjectId(UserID)},{$inc:{"poin":-Poin}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.addFollowerCountToUser=function(UserID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userColl = database.collection('users');
            await userColl.findOneAndUpdate({_id:new ObjectId(UserID)},{$inc:{"follower_count":1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.subtractFollowerCountFromUser=function(UserID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userColl = database.collection('users');
            await userColl.findOneAndUpdate({_id:new ObjectId(UserID)},{$inc:{"follower_count":-1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.addFollowingCountToUser=function(UserID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userColl = database.collection('users');
            await userColl.findOneAndUpdate({_id:new ObjectId(UserID)},{$inc:{"following_count":1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.subtractFollowingCountFromUser=function(UserID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userColl = database.collection('users');
            await userColl.findOneAndUpdate({_id:new ObjectId(UserID)},{$inc:{"following_count":-1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};

exports.updateReferenceUser=function(ReferenceCode,UserID,Username) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userColl = database.collection('users');
            let userQuery={
                user_id: UserID,
                username:Username
            };
            await userColl.updateOne({ reference_code: ReferenceCode }, {$push:{user_reference:userQuery}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.calculatePoinToUser=function(UserID,Poin) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userColl = database.collection('users');
            await userColl.findOneAndUpdate({_id:new ObjectId(UserID)},{$inc:{"poin":Poin}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.calculatePoinToLeader=function(UserID,Poin) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userColl = database.collection('users');
            await userColl.findOneAndUpdate({_id:new ObjectId(UserID)},{$inc:{"leader_poin":Poin}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.calculatePoinToLeaderAndUser=function(UserID,Poin) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userColl = database.collection('users');
            await userColl.findOneAndUpdate({_id:new ObjectId(UserID)},{$inc:{leader_poin:Poin,poin:Poin}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.getListLeaderBoardName=function() {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userColl = database.collection('users');
            let users = await userColl.find({role:1}).sort({leader_poin:-1}).toArray();
            resolve(users);
        } catch (err) {
            reject(err)
        }
    })
};
exports.updateFCMID=function(UserID,FCMID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userColl = database.collection('users');
            await userColl.findOneAndUpdate({_id:UserID},{$set:{fcm_id:FCMID}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.updateDisplayPicture=function(UserID,DP) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userColl = database.collection('users');
            await userColl.findOneAndUpdate({_id:UserID},{$set:{display_picture:DP}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.getAllFCMID=function() {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userColl = database.collection('users');
            let users = await userColl.find({ fcm_id: {"$exists" : true, "$ne" : ""} }, {fcm_id:1}).toArray();
           resolve(users)
        } catch (err) {
            reject(err)
        }
    })
};
exports.getAllFCMIDLeader=function() {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userColl = database.collection('users');
            let users = await userColl.find({ fcm_id: {"$exists" : true, "$ne" : ""},role:1 }, {fcm_id:1}).toArray();
            resolve(users)
        } catch (err) {
            reject(err)
        }
    })
};
exports.getReferencedUserListForLeader=function(UserID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userColl = database.collection('users');
            let users = await userColl.findOne({  _id: new ObjectId(UserID)}, {user_reference:1});
            resolve(users.user_reference)
        } catch (err) {
            reject(err)
        }
    })
};
exports.getReferencedUserListForParticipant=function(UserID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userColl = database.collection('users');
            let users = await userColl.findOne({  _id: new ObjectId(UserID)}, {referenced_by:1});
            resolve(users.referenced_by)
        } catch (err) {
            reject(err)
        }
    })
};