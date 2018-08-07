const router = require('koa-router')();
const {requestResponse}=require('../setup');
const classesModel=require('../models/classes_models');
const { checkToken } = require('../utilities/token_helper');
const randomstring = require("randomstring");

router.post('/class/create', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','ClassName', 'Desc'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                query.UserID=user._id;
                query.Username=user.username;
                let CheckKode=true;
                while (CheckKode){
                    query.ClassCode=await randomstring.generate({
                        length: 5,
                        charset: 'alphanumeric',
                        capitalization:'uppercase'
                    });
                    CheckKode=await classesModel.checkClassCode(query.ClassCode);
                }
                result=Object.assign(requestResponse.common_success);
                result.classDetail=await classesModel.create(query);
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/class/join', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','ClassCode'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                if(await classesModel.checkClassCode(query.ClassCode)){
                    query.UserID=user._id;
                    query.Username=user.username;
                    let checkIfUserAlreadyJoin=await classesModel.checkParticipantInClass(query);
                    if(checkIfUserAlreadyJoin){
                        result=Object.assign(requestResponse.class_already_taken);
                    }else {
                        await classesModel.participantJoinClass(query);
                        result=Object.assign(requestResponse.common_success);
                    }
                }else {
                    result=Object.assign(requestResponse.class_not_exist);
                }

            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/class/list', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                let classList=await classesModel.getClassList();
                result=Object.assign(requestResponse.common_success);
                result.results=classList;
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});

module.exports = router;