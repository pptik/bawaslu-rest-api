const usersModel=require('../models/users_models');
exports.sendNotification = (payload, token) => {
    //console.log("token", token);
    return new Promise(async (resolve, reject) => {
        try {
            let admin = require('../app').admin;
            // admin.messaging().sendToDevice(token, payload)
            //     .then(function (response) {
            //         resolve(true);
            //         console.log("Successfully sent message:", response);
            //     })
            //     .catch(function (error) {
            //         console.log("[FCM] Error sending message to: "+token, error)
            //         resolve(false)
            //     })
        } catch (error) {
            //console.log(payload);
            //console.log(token);
            console.log("[FCM] error ", error);
            resolve(false)
        }
    })
};
exports.broadcastNotification=(Title,Message,Type,ContentID)=>{
    console.log("Payload : "+Title+" "+Message+" "+Type+" "+ContentID);
    return new Promise(async (resolve, reject) => {
        try {
            let payload = {
                notification: {
                    title: Title,
                    body: Message
                },
                data: {
                    type:Type,
                    content_id:ContentID.toString()
                }
            };
            usersFCMID=await usersModel.getAllFCMID();
            for(i=0;i<usersFCMID.length;i++){
                this.sendNotification(payload, usersFCMID[i].fcm_id)
            }
        } catch (error) {
            console.log("[FCM] error ", error);
            resolve(false)
        }
    })

};
exports.broadcastNotificationToLeader=(Title,Message,Type,ContentID)=>{
    console.log("Payload : "+Title+" "+Message+" "+Type+" "+ContentID);
    return new Promise(async (resolve, reject) => {
        try {
            let payload = {
                notification: {
                    title: Title,
                    body: Message
                },
                data: {
                    type:Type,
                    content_id:ContentID.toString()
                }
            };
            usersFCMID=await usersModel.getAllFCMIDLeader();
            for(i=0;i<usersFCMID.length;i++){
                this.sendNotification(payload, usersFCMID[i].fcm_id)
            }
        } catch (error) {
            console.log("[FCM] error ", error);
            resolve(false)
        }
    })

};