const router = require('koa-router')();
const {requestResponse}=require('../setup');
const usersModel=require('../models/users_models');
const regionsModel=require('../models/regions_models');
const { checkBody } = require('../utilities/body_checker');
const { validateEmail, validatePhone } = require('../utilities/body_checker');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { parseBoolean } = require('../utilities/parse_boolean');
const { generateReferenceCode } = require('../utilities/reference_code');
const { checkToken } = require('../utilities/token_helper');
const randomstring = require("randomstring");
const activityLogModel=require('../models/activity_logs_models');
const {usersLogActivityDataModify}=require('../utilities/data_modify');
const {sendNotification}=require('../services/notification');

router.post('/users/signin', async (ctx, next) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['field', 'password','app_id', 'force', 'current_device', 'current_number', 'carrier'], query)) {
        try {
            let isEmail=validateEmail(query.field);
            let isPhone = validatePhone(query.field);
            let profile={};
            let result;
            if(isEmail)profile=await usersModel.findUserProfileByEmail(query.field);
            else if (isPhone)profile=await usersModel.findUserProfileByPhone(query.field);
            else profile=await usersModel.findUserProfileByUsername(query.field);

            if(!profile){
            result=Object.assign({}, requestResponse.account_not_found);
            }else {
                if(await bcrypt.compare(query.password,profile.password)){
                    if(!profile.verified)result=Object.assign({}, requestResponse.account_not_verified_by_admin);
                    else {
                        let alreadyLogin = profile.access.some(a => a.app_id === parseInt(query.app_id));
                        let access = {};
                        for (let i = 0; i < profile.access.length; i++) {
                            if (profile.access[i].app_id=== parseInt(query.app_id))
                                access = profile.access[i]
                        }
                        if (access['current_device'] === query['current_device']) query['force'] = true;

                        if (alreadyLogin && !parseBoolean(query.force) ) {
                           result = Object.assign({}, requestResponse.account_already_login);
                           result.rm = 'Anda telah masuk sebelumnya menggunakan perangkat ' + access.current_device + ', Lanjutkan?'
                        } else  {
                            profile = await usersModel.regenerateToken(access.token, profile.username, query);
                            result=Object.assign({}, requestResponse.common_success);
                            result.results = profile;
                        }
                    }
                }else result=requestResponse.account_not_found;
            }
            ctx.body=result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});

router.post('/users/signup', async (ctx, next) => {
    if (checkBody(['identificationNumber','name', 'username', 'password', 'phoneNumber','address',
            'email', 'villageID', 'signupType'], ctx.request.body)) {
        try {
            let query=ctx.request.body;
            let checkDuplication=false;
            let result={};
            if(await usersModel.checkPhoneNumber(query.phoneNumber)){
                checkDuplication=true;
                result=Object.assign(requestResponse.phone_number_already_use);
            }
            if(await usersModel.checkEmail(query.email)){
                checkDuplication=true;
                result=Object.assign(requestResponse.email_already_use);
            }
            if(await usersModel.checkIdentificationNumber(query.identificationNumber)){
                checkDuplication=true;
                result=Object.assign(requestResponse.identification_number_already_use);
            }
            query.village=await regionsModel.getVillageDetail(query.villageID);
            query.district=await regionsModel.getDistrictDetail(query.village.district_code);
            query.regency=await regionsModel.getRegencyDetail(query.district.regency_code);
            query.province=await regionsModel.getProvinceDetail(query.regency.province_code);

            if(!checkDuplication){
                await usersModel.signup(query);
                result=Object.assign(requestResponse.common_success);
                result.rm="Berhasil Melakukan Pendaftaran,Selamat Bergabung :), Silahkan Melakukan Login Untuk Menggunakan Aplikasi";
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/users/list/all', async (ctx, next) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                let users=await usersModel.getListAllUser();
                result=Object.assign(requestResponse.common_success);
                result.results=users;
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/users/list/verified', async (ctx, next) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                let users=await usersModel.getListVerifiedUser();
                result=Object.assign(requestResponse.common_success);
                result.results=users;
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/users/list/not/verified', async (ctx, next) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                let users=await usersModel.getListNotVerifiedUser();
                result=Object.assign(requestResponse.common_success);
                result.results=users;
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/users/verify', async (ctx, next) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','UserID'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                await usersModel.verifyUser(query.UserID);
                result=Object.assign(requestResponse.common_success);
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});

router.post('/users/simple/signup', async (ctx) => {
    if (checkBody(['Email','Username','PhoneNumber','Password','ReferenceCode','SignupType'], ctx.request.body)) {
        try {
            let query=ctx.request.body;
            let checkDuplication=false;
            let result=null;

            if(await usersModel.checkEmail(query.Email)){
                checkDuplication=true;
                result=Object.assign(requestResponse.email_already_use);
            }
            if(await usersModel.checkPhoneNumber(query.phoneNumber)){
                checkDuplication=true;
                result=Object.assign(requestResponse.phone_number_already_use);
            }
            if(await usersModel.checkUsername(query.Username)){
                checkDuplication=true;
                result=Object.assign(requestResponse.username_already_use);
            }
            query.ReferencedBy=await usersModel.checkUserReferenceCode(query.ReferenceCode);
            if(!query.ReferencedBy){
               checkDuplication=true;
                result=Object.assign(requestResponse.reference_code_not_found);
            }

            if(!checkDuplication){
                let detailUser= await usersModel.signupSimple(query);
                await usersModel.updateReferenceUser(query.ReferenceCode,detailUser._id,detailUser.username);
                result=Object.assign(requestResponse.signup_success);


            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/users/register/leader', async (ctx) => {
    if (checkBody(['Email','Username','PhoneNumber','Password','SignupType'], ctx.request.body)) {
        try {
            let query=ctx.request.body;
            let checkDuplication=false;
            let result=null;

            if(await usersModel.checkEmail(query.Email)){
                checkDuplication=true;
                result=Object.assign(requestResponse.email_already_use);
            }
            if(await usersModel.checkPhoneNumber(query.PhoneNumber)){
                checkDuplication=true;
                result=Object.assign(requestResponse.phone_number_already_use);
            }
            if(await usersModel.checkUsername(query.Username)){
                checkDuplication=true;
                result=Object.assign(requestResponse.username_already_use);
            }
            if(!checkDuplication){
                query.ReferenceCode=await generateReferenceCode();
                await usersModel.registerLeader(query);
              result=Object.assign(requestResponse.register_leader_success);
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/users/leaderboards', async (ctx, next) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                result=Object.assign(requestResponse.common_success);
                result.results=await usersModel.getListLeaderBoardName();
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});

router.post('/users/profile', async (ctx, next) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                result=Object.assign(requestResponse.common_success);
                result.results=await usersModel.findUserProfileByUserID(user._id);
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/users/personal/logactivity', async (ctx, next) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                result=Object.assign(requestResponse.common_success);
                result.results=await usersLogActivityDataModify(await activityLogModel.getAllLogActivityByUserID(user._id));
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/users/update/fcmid', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','FCM_ID'], query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                result=Object.assign(requestResponse.common_success);
                await usersModel.updateFCMID(user._id,query.FCM_ID)
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/users/update/dp', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','DP'], query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                result=Object.assign(requestResponse.common_success);
                await usersModel.updateDisplayPicture(user._id,query.DP)
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/users/broadcast/notification', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','Title','Message'], query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                result=Object.assign(requestResponse.common_success);
                let payload = {
                    notification: {
                        title: query.Title,
                        body: query.Message
                    },
                    data: {
                        type:"0"
                    }
                };
                usersFCMID=await usersModel.getAllFCMID();
                for(i=0;i<usersFCMID.length;i++){
                    sendNotification(payload, usersFCMID[i].fcm_id)
                }
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});


router.post('/users/referenced/user/list', async (ctx, next) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                result=Object.assign(requestResponse.common_success);
                if(user.role===1){
                    let referenceList=await usersModel.getReferencedUserListForLeader(user._id);
                    let promises=referenceList.map(async reference=>{
                        let userProfile=await usersModel.findUserProfileByUserID(reference.user_id);
                        if(userProfile){
                            reference.display_picture=userProfile.display_picture;
                            reference.email=userProfile.email;
                        }else {
                            reference.display_picture=null;
                            reference.email=null;
                        }
                        let email=reference.email;
                        let display_picture=reference.display_picture;
                        let user_id=reference.user_id;
                        let username=reference.username;

                        return{
                            user_id,
                            username,
                            email,
                            display_picture
                        }
                    });
                    result.results=Object.assign({});
                    result.results.user_id=user._id;
                    result.results.username=user.username;
                    result.results.display_picture=user.display_picture;
                    result.results.email=user.email;
                    result.results.teammates=await Promise.all(promises);
                }else if(user.role===2){
                    let teamLeader=await usersModel.getReferencedUserListForParticipant(user._id)
                    teamLeader=await usersModel.findUserProfileByUserID(teamLeader.UserID)
                    result.results=Object.assign({});
                    result.results.user_id=teamLeader._id;
                    result.results.username=teamLeader.username;
                    result.results.display_picture=teamLeader.display_picture;
                    result.results.email=teamLeader.email;
                    let referenceList=await usersModel.getReferencedUserListForLeader(teamLeader._id);
                    let promises=referenceList.map(async reference=>{
                        let userProfile=await usersModel.findUserProfileByUserID(reference.user_id);
                        if(userProfile){
                            reference.display_picture=userProfile.display_picture;
                            reference.email=userProfile.email;
                        }else {
                            reference.display_picture=null;
                            reference.email=null;
                        }
                        let email=reference.email;
                        let display_picture=reference.display_picture;
                        let user_id=reference.user_id;
                        let username=reference.username;
                        return{
                            user_id,
                            username,
                            email,
                            display_picture
                        }
                    });
                    result.results.teammates=await Promise.all(promises);
                }

            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});

router.post('/users/change_password', async(ctx, next) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token', 'old_password', 'new_password'],query)) {
        try {
            let result = {};
            let query = ctx.request.body;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign({}, requestResponse.token_invalid);
            else {
                query.UserID=user._id;
                user = await usersModel.findUserProfileByUserID(query.UserID)
                if(await bcrypt.compare(query.old_password,user.password)){
                    usersModel.changePassword(query)
                    result=Object.assign({}, requestResponse.common_success);  
                }else{
                    result=Object.assign({}, requestResponse.common_error);  
                }
            }
            ctx.body=result
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});


module.exports = router;