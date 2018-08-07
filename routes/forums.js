const router = require('koa-router')();
const {requestResponse}=require('../setup');
const {activities}=require('../setup');
const forumsModel=require('../models/forums_models');
const usersModel=require('../models/users_models');
const activityLogModel=require('../models/activity_logs_models');
const tagsModel=require('../models/tags_model');
const { checkToken } = require('../utilities/token_helper');
const dashboardLogModel=require('../models/dashboard_logs_models');
const {parseDataListForums}=require('../utilities/data_modify');
const {broadcastNotification}=require('../services/notification');
let moment 	= require('moment');
const challengeModel=require('../models/challenge_models')


router.post('/forums/create', async (ctx, next) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','Title','Tags'],query)) {
        try {
            let result = {};
            let user = await checkToken(query.access_token);
            if (user === false) result=requestResponse.token_invalid;
            else {
                query.UserID=user._id;
                query.Username=user.username;
                let now = new Date()
                query.CreatedAt = now
                query.Challenge=false;
                let IsChallenge = (query.IsChallenge === "true");
                if(IsChallenge){
                    query.Challenge=true;
                    let poin = { poin : parseInt(query.ChallengePoin)}
                    let expire = { expire : moment(query.ChallengeExpire, "DD-MM-YYYY").toDate()}
                    let created_at =  { created_at: now}
                    query.ChallengeDetail = Object.assign(created_at, expire, poin)
                    challengeModel.create(query)
                }
                let forumsDetail=await forumsModel.create(query);
                let tags=query.Tags;
                if(tags.length>0){
                    for(let i=0;i<tags.length;i++){
                        if(await tagsModel.checkTag(tags[i])){
                             tagsModel.addCountToTags(tags[i]);
                        }else {
                             tagsModel.create(query,tags[i]);
                        }
                    }
                }
                query.ContentCode=activities.create_forum.content_code;
                query.ContentText=activities.create_forum.content;
                query.ActivityCode=activities.create_forum.activity_code;
                query.ActivityText="Membuat Forum ";
                query.Desc=activities.create_forum.desc+" dengan judul "+forumsDetail.title;
                query.ContentID=forumsDetail._id;

                dashboardLogModel.create(query);
                activityLogModel.create(query);
                result=Object.assign({}, requestResponse.common_create_success);
                result.results=forumsDetail;

                broadcastNotification("Topik Terbaru dari "+user.username,query.Title,query.ContentText,query.ContentID)
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign({}, requestResponse.common_error)
        }
    } else ctx.body =Object.assign({}, requestResponse.body_incomplte)
});
router.post('/forums/list', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','Skip'],query)) {
        try {
            let result = {};
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                let forumList=await parseDataListForums(await forumsModel.getListWithUserPicture(query.Skip));
                let promises=forumList.map(async forum=>{
                    let userActivity=await activityLogModel.getUserLogActivity(query.UserID,forum.content_id);
                    forum.upvoted=false;
                    forum.downvoted=false;
                    forum.favorited=false;
                    await userActivity.forEach(function (index) {
                        switch (parseInt(index.activity_code)){
                            case 2:
                                forum.upvoted=true;
                                break;
                            case 3:
                                forum.downvoted=true;
                                break;
                            case 4:
                                forum.favorited=true;
                                break;
                        }
                    });
                    return{
                        forum
                    }
                });
                result=Object.assign(requestResponse.common_success);
                result.results=await Promise.all(promises);

            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/forums/list/foradmin', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','Skip'],query)) {
        try {
            let result={};
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                let forumList=await parseDataListForums(await forumsModel.getListWithUserPicture2(query.Skip));
                result=Object.assign(requestResponse.common_success);
                result.results=forumList;
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});

router.post('/forums/list/search', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','SearchString'],query)) {
        try {
            let result={};
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                let forumList=await parseDataListForums(await forumsModel.searchListByTitleAndTag(query.SearchString));
                let promises=forumList.map(async forum=>{
                    let userActivity=await activityLogModel.getUserLogActivity(query.UserID,forum.content_id);
                    forum.upvoted=false;
                    forum.downvoted=false;
                    forum.favorited=false;
                    await userActivity.forEach(function (index) {
                        switch (parseInt(index.activity_code)){
                            case 2:
                                forum.upvoted=true;
                                break;
                            case 3:
                                forum.downvoted=true;
                                break;
                            case 4:
                                forum.favorited=true;
                                break;
                        }
                    });
                    return{
                        forum
                    }
                });
                result=Object.assign(requestResponse.common_success);
                result.results=await Promise.all(promises);

            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/forums/aktivasi', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','ForumID'],query)) {
        try {
            let result={};
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                result=Object.assign(requestResponse.common_success);
                dashboardLogModel.setStatusAsActivated(query.ForumID)
                result.results=await forumsModel.aktivasiForum(query);
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/forums/deaktivasi', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','ForumID'],query)) {
        try {
            let result={};
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                result=Object.assign(requestResponse.common_success);
                dashboardLogModel.setStatusAsDeleted(query.ForumID)
                result.results=await forumsModel.deaktivasiForum(query);
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/forums/answer', async (ctx, next) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','ForumID', 'Answer'],query)) {
        try {
            let result={};
            let user = await checkToken(query.access_token);
            if (user === false) result=requestResponse.token_invalid;
            else {
                query.UserID=user._id;
                query.Username=user.username;
                let answerDetail=await forumsModel.createAnswer(query);
                query.ContentCode=activities.answer_forum.content_code;
                query.ContentText=activities.answer_forum.content;
                query.ActivityCode=activities.answer_forum.activity_code;
                query.ActivityText=activities.answer_forum.activity_text;
                query.Desc=activities.answer_forum.desc;
                query.Title=activities.answer_forum.content;
                query.ContentID=query.ForumID;
                let activityLogDetail=await activityLogModel.create(query);
                result=Object.assign(requestResponse.common_create_success);
                result.answerDetail=answerDetail;
                result.activitylog=activityLogDetail;

                dashboardLogModel.addCommentCountToDashboardActivity(query.ForumID);
                forumsModel.addCommentCountToForum(query.ForumID);
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body =Object.assign(requestResponse.body_incomplte)
});
router.post('/forums/comment/answer', async (ctx, next) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','AnswerID','ForumID', 'Answer'],query)) {
        try {
            let result={};
            let user = await checkToken(query.access_token);
            if (user === false) result=requestResponse.token_invalid;
            else {
                query.UserID=user._id;
                query.Username=user.username;
                let answerDetail=await forumsModel.replyAnswer(query);
                query.ContentCode=activities.answer_forum.content_code;
                query.ContentText=activities.answer_forum.content;
                query.ActivityCode=activities.answer_forum.activity_code;
                query.ActivityText=activities.answer_forum.activity_text;
                query.Desc=activities.answer_forum.desc;
                query.Title=activities.answer_forum.content;
                query.ContentID=query.ForumID;
                let activityLogDetail=await activityLogModel.create(query);

                result=Object.assign(requestResponse.common_create_success);
                result.answerDetail=answerDetail;
                result.activitylog=activityLogDetail;

                dashboardLogModel.addCommentCountToDashboardActivity(query.ForumID);
                forumsModel.addCommentCountToForum(query.ForumID);
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body =Object.assign(requestResponse.body_incomplte)
});
router.post('/forums/detail', async (ctx, next) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','ForumID'],query)) {
        try {
            let result = {};
            let user = await checkToken(query.access_token);
            if (user === false) result=requestResponse.token_invalid;
            else {
                query.UserID=user._id;
                query.Username=user.username;
                result=Object.assign(requestResponse.common_success_simple);
                let detailForum=await forumsModel.getForumDetailByID(query.ForumID);
                let dateNow=moment(new Date());
                dateNow.locale('id');
                let newDate=moment(detailForum.created_at);
                newDate.locale('id');
                detailForum.created_at_string=newDate.format('LLLL');
                detailForum.created_at_from_now=dateNow.to(newDate);

                let userActivity=await activityLogModel.getUserLogActivity(query.UserID,query.ForumID);
                detailForum.upvoted=false;
                detailForum.downvoted=false;
                detailForum.favorited=false;
                await userActivity.forEach(function (index) {
                    switch (parseInt(index.activity_code)){
                        case 2:
                            detailForum.upvoted=true;
                            break;
                        case 3:
                            detailForum.downvoted=true;
                            break;
                        case 4:
                            detailForum.favorited=true;
                            break;
                    }
                });
                result.results=detailForum;
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body =Object.assign(requestResponse.body_incomplte)
});

router.post('/forums/answer/list', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','ForumID','Skip'],query)) {
        try {
            let result={};
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                query.UserID=user._id;
                query.Username=user.username;
                result=Object.assign(requestResponse.common_success);
                let answers=await forumsModel.getAnswersByForumID(query.ForumID,query.Skip);
                answers=await parseDataForumsAnswer(answers);
                let promises=answers.map(async answers=>{
                    let userActivity=await activityLogModel.getUserLogActivity(query.UserID,answers._id);
                    answers.upvoted=false;
                    answers.downvoted=false;
                    answers.favorited=false;
                    await userActivity.forEach(function (index) {
                        switch (parseInt(index.activity_code)){
                            case 2:
                                answers.upvoted=true;
                                break;
                            case 3:
                                answers.downvoted=true;
                                break;
                            case 4:
                                answers.favorited=true;
                                break;
                        }
                    });
                    let reply=await forumsModel.listCommentAnswerByAnswerID(answers._id);

                    reply=await parseDataForumsAnswer(reply);

                    let replies=reply.map(async reply=>{
                        let userActivity=await activityLogModel.getUserLogActivity(query.UserID,reply._id);
                        reply.upvoted=false;
                        reply.downvoted=false;
                        reply.favorited=false;
                        await userActivity.forEach(function (index) {
                            switch (parseInt(index.activity_code)){
                                case 2:
                                    reply.upvoted=true;
                                    break;
                                case 3:
                                    reply.downvoted=true;
                                    break;
                                case 4:
                                    reply.favorited=true;
                                    break;
                            }
                        });
                        return reply;
                    });
                    answers.reply=await Promise.all(replies);
                    return answers;

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

router.post('/forums/select/answer', async (ctx, next) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','ForumID','AnswerID'],query)) {
        try {
            let result={};
            let user = await checkToken(query.access_token);
            if (user === false) result=requestResponse.token_invalid;
            else {
                query.UserID=user._id;
                query.Username=user.username;
                let acceptedAnsweExist=await forumsModel.checkAcceptedAnswer(query);

                if(acceptedAnsweExist){
                 await forumsModel.unselectAcceptedAnswer(acceptedAnsweExist._id);
                }
                query.UserID=user._id;
                query.Username=user.username;
                result=Object.assign(requestResponse.common_success_simple);
                result.results=await forumsModel.selectAcceptedAnswer(query);

                let userDetail=await usersModel.findUserProfileByUserID(result.results.post_by.user_id);
                let poin=10;
                switch (userDetail.role){
                    case 0:
                        /*add point to self*/
                        usersModel.calculatePoinToUser(userDetail._id,poin);
                        usersModel.calculatePoinToLeader(userDetail._id,poin);
                        break;

                    case 1:
                        /*add point to self*/
                        usersModel.calculatePoinToUser(userDetail._id,poin);
                        usersModel.calculatePoinToLeader(userDetail._id,poin);
                        break;

                    case 2:
                        /*add point to leader and self*/
                        usersModel.calculatePoinToUser(userDetail._id,poin);
                        usersModel.calculatePoinToLeader(userDetail.referenced_by.UserID,poin);
                        break;
                }
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body =Object.assign(requestResponse.body_incomplte)
});
module.exports = router;