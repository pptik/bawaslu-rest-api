const router = require('koa-router')();
const {requestResponse}=require('../setup');
const tasksModel=require('../models/tasks_models');
const { checkToken } = require('../utilities/token_helper');
const randomstring = require("randomstring");

router.post('/task/create', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','Title', 'Desc','Attachment'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=requestResponse.token_invalid;
            else {
                query.UserID=user._id;
                query.Username=user.username;
                result=Object.assign(requestResponse.common_create_success);
                result.taskDetail=await tasksModel.create(query);
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/task/update', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','TaskID','Title', 'Desc','Attachment'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=requestResponse.token_invalid;
            else {
                query.UserID=user._id;
                query.Username=user.username;
                result=Object.assign(requestResponse.common_create_success);
                await tasksModel.updateTask(query);
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/task/submit', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','TaskID','Title', 'Desc','Attachment'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=requestResponse.token_invalid;
            else {
                query.UserID=user._id;
                query.Username=user.username;
                result=Object.assign(requestResponse.common_create_success);
                let checkUserSubmittedAnswer=await tasksModel.checkUserSubmittedAnswer(query);
                if(checkUserSubmittedAnswer){
                    result=requestResponse.already_submit_task_answer;
                    result.taskDetail=checkUserSubmittedAnswer;
                }else {
                    result.taskDetail=await tasksModel.submitTaskAnswer(query);
                }

            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/task/update/answer', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','AnswerID','Title', 'Desc','Attachment'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=requestResponse.token_invalid;
            else {
                query.UserID=user._id;
                query.Username=user.username;
                result=Object.assign(requestResponse.common_create_success);
                await tasksModel.updateSubmitedTaskAnswer(query);
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
module.exports = router;