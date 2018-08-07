const router = require('koa-router')();
const {requestResponse}=require('../setup');
const quizzesModel=require('../models/quizzes_models');
const usersModel=require('../models/users_models');
const dashboardLogModel=require('../models/dashboard_logs_models');
const {parseDataQuiz}=require('../utilities/data_modify');
const { checkToken } = require('../utilities/token_helper');
const {broadcastNotificationToLeader}=require('../services/notification');
let moment 	= require('moment');

router.post('/quizzes/create', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','Title', 'Level','Desc'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                query.UserID=user._id;
                query.Username=user.username;
                result=Object.assign(requestResponse.common_create_success);
                result.results=await quizzesModel.create(query);
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/quizzes/update', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','QuizID','Title', 'Level','Desc'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                query.UserID=user._id;
                query.Username=user.username;
                result=Object.assign(requestResponse.common_update_success);
                result.results=await quizzesModel.updateQuiz(query);
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/quizzes/update/question', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','QuestionID','Question', 'Poin','MultipleChoice'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                query.UserID=user._id;
                query.Username=user.username;
                result=Object.assign(requestResponse.common_update_success);
                result.results=await quizzesModel.editQuestion(query);
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/quizzes/publish', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','QuizID'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                query.UserID=user._id;
                query.Username=user.username;
                result=Object.assign(requestResponse.common_update_success);
                result.results=await quizzesModel.publishQuiz(query);
                broadcastNotificationToLeader("Kuis Terbaru dari "+user.username,result.results.desc,"Kuis",query.QuizID)
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/quizzes/unpublish', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','QuizID'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                query.UserID=user._id;
                query.Username=user.username;
                result=Object.assign(requestResponse.common_update_success);
                result.results=await quizzesModel.unpublishQuiz(query);
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});

router.post('/quizzes/create/question', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','QuizID','Question', 'Poin','MultipleChoice'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                query.UserID=user._id;
                query.Username=user.username;
                result=Object.assign(requestResponse.common_create_success);
                result.results=await quizzesModel.createQuestion(query);
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/quizzes/list/question', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','QuizID'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                result=Object.assign(requestResponse.common_success);
                result.results=await quizzesModel.questionsList(query.QuizID);
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/quizzes/delete/question', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','QuestionID'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                if(await usersModel.checkIfUserIsAdmin(user._id)){
                    result=Object.assign(requestResponse.common_delete_success);
                    result.results=await quizzesModel.deleteQuestion(query.QuestionID);
                }else {
                    result=Object.assign(requestResponse.account_not_admin)
                }
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/quizzes/all/list', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                result=Object.assign(requestResponse.common_success);
                result.results=await parseDataQuiz(await quizzesModel.listAllQuiz());
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/quizzes/list/for/user', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                query.UserID=user._id;
                query.Username=user.username;
                result=Object.assign(requestResponse.common_success);
                let quizList=await quizzesModel.publishedQuizList();
                quizList=await parseDataQuiz(quizList);
                let promises=quizList.map(async quiz=>{
                    quiz.UserScore=await quizzesModel.userBiggestScore(query.UserID,quiz._id);
                    quiz.TotalScore=await quizzesModel.quizScore(quiz._id);
                    return quiz;
                });
                result.results=await Promise.all(promises);
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/quizzes/detail', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','QuizID'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                result=Object.assign(requestResponse.common_success);
                result.results=await quizzesModel.detailQuiz(query.QuizID);
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/quizzes/user/answer', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','QuizID','Score','AttemptDuration','TotalQuestion','CorrectAnswer','WrongAnswer','NoAnswer','UserBiggestScore'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                query.UserID=user._id;
                query.Username=user.username;
                query.Attempt=await quizzesModel.countAttemptUserQuizActivity(query);
                result=Object.assign(requestResponse.common_success);
                result.results=await quizzesModel.createUserQuizActivity(query);
                if(query.Score>query.UserBiggestScore){
                    await usersModel.calculatePoinToLeaderAndUser(query.UserID,parseInt(query.Score)-parseInt(query.UserBiggestScore));
                }
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});

module.exports = router;