const randomstring = require("randomstring");
const usersModel=require('../models/users_models');

exports.generateReferenceCode=function() {
    return new Promise(async (resolve, reject) => {
        try {
            let checkReferenceCode=true;
            let referenceCode=null;
            while (checkReferenceCode){
                referenceCode=await randomstring.generate({
                    length: 5,
                    charset: 'alphanumeric',
                    capitalization:'uppercase'
                });
                checkReferenceCode=await usersModel.checkUserReferenceCode(referenceCode);
            }
            resolve(referenceCode);
        } catch (err) {
            reject(err)
        }
    })
};