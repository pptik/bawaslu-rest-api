const router = require('koa-router')();
const {requestResponse}=require('../setup');
const newsModel=require('../models/news_models');
const usersModel=require('../models/users_models');
const dashboardLogModel=require('../models/dashboard_logs_models');
const activityLogModel=require('../models/activity_logs_models');
const userLogModel=require('../models/activity_logs_models');
const { checkToken } = require('../utilities/token_helper');
const {activities}=require('../setup');
const {poins}=require('../setup');
const {broadcastNotification}=require('../services/notification');
const tagsModel=require('../models/tags_model');
let moment 	= require('moment');
let dateFormat="DD/MM/YYYY H:m";
const debug = require('debug')('demo:server');
const challengeModel=require('../models/challenge_models');


router.post('/news/create', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','Title', 'Content','Desc', 'Tags'],query)) {
        try {
            let result = {};
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                let now = new Date();
                query.CreatedAt = now;
                query.UserID=user._id;
                query.Username=user.username;

                result=Object.assign(requestResponse.common_create_success);
                //insert news
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
                result.newsDetail=await newsModel.create(query);

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

                query.ContentCode=activities.create_news.content_code;
                query.ContentText=activities.create_news.content;
                query.ActivityCode=activities.create_news.activity_code;
                query.ActivityText=activities.create_news.activity_text;
                query.ContentID=result.newsDetail._id;
                query.NewsType=0;
                switch (user.role){
                    case 0:
                        /*add point to self*/
                        usersModel.calculatePoinToUser(user._id,poins.create_material);
                        usersModel.calculatePoinToLeader(user._id,poins.create_material);
                        break;
                    case 1:
                        /*add point to self*/
                        usersModel.calculatePoinToUser(user._id,poins.create_material);
                        usersModel.calculatePoinToLeader(user._id,poins.create_material);

                        break;
                    case 2:
                        /*add point to leader and self*/
                        usersModel.calculatePoinToUser(user._id,poins.create_material);
                        usersModel.calculatePoinToLeader(user.referenced_by.UserID,poins.create_material);
                        break;

                }
                dashboardLogModel.createNews(query);
                userLogModel.create(query);
                broadcastNotification("Berita Terbaru dari "+user.username,query.Title,query.ContentText,query.ContentID)
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/news/create/activities', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token', 'Content','Files', 'Tags'],query)) {
        try {
            let result = {};
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                let now = new Date();
                query.CreatedAt = now;
                query.UserID=user._id;
                query.Username=user.username;

                result=Object.assign(requestResponse.common_create_success);
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
                result.newsDetail=await newsModel.createUsersActivitiesWithMedia(query);
                
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
                //dashboard logging
                if(IsChallenge){
                    query.Title="Challenge";
                    query.Challenge=true;
                }else{
                    query.Title="Aktivitas Relawan";
                }
                query.Desc=query.Content;
                query.ContentCode=activities.create_news.content_code;
                query.ContentText=activities.create_news.content;
                query.ActivityCode=activities.create_news.activity_code;
                query.ActivityText=activities.create_news.activity_text;
                query.ContentID=result.newsDetail._id;
                query.NewsType=1;
                switch (user.role){
                    case 0:
                        /*add point to self*/
                        usersModel.calculatePoinToUser(user._id,poins.create_material);
                        usersModel.calculatePoinToLeader(user._id,poins.create_material);
                        break;
                    case 1:
                        /*add point to self*/
                        usersModel.calculatePoinToUser(user._id,poins.create_material);
                        usersModel.calculatePoinToLeader(user._id,poins.create_material);

                        break;
                    case 2:
                        /*add point to leader and self*/
                        usersModel.calculatePoinToUser(user._id,poins.create_material);
                        usersModel.calculatePoinToLeader(user.referenced_by.UserID,poins.create_material);
                        break;

                }
                dashboardLogModel.createMediaNews(query);
                userLogModel.create(query);
                if(query.Challenge_id != null){
                    query.NewsID = result.newsDetail._id
                    challengeModel.answerChallenge(query);
                }
                broadcastNotification("Aktivitas Terbaru dari "+user.username,query.Content,query.ContentText,query.ContentID)
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/news/create/activities2', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token', 'Content','Files', 'Tags'],query)) {
        try {
            let result = {};
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                let now = new Date();
                query.CreatedAt;
                query.UserID=user._id;
                query.Username=user.username;
                //console.log(query.Files);
                query.Files=JSON.parse(query.Files);
                result=Object.assign(requestResponse.common_create_success);
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
                result.newsDetail=await newsModel.createUsersActivitiesWithMedia(query);

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
                //dashboard logging
                if(IsChallenge){
                    query.Title="Challenge";
                    query.Challenge=true;
                }else{
                    query.Title="Aktivitas Relawan";
                }
                query.Desc=query.Content;
                query.ContentCode=activities.create_news.content_code;
                query.ContentText=activities.create_news.content;
                query.ActivityCode=activities.create_news.activity_code;
                query.ActivityText=activities.create_news.activity_text;
                query.ContentID=result.newsDetail._id;
                query.NewsType=1;
                switch (user.role){
                    case 0:
                        /*add point to self*/
                        usersModel.calculatePoinToUser(user._id,poins.create_material);
                        usersModel.calculatePoinToLeader(user._id,poins.create_material);
                        break;
                    case 1:
                        /*add point to self*/
                        usersModel.calculatePoinToUser(user._id,poins.create_material);
                        usersModel.calculatePoinToLeader(user._id,poins.create_material);

                        break;
                    case 2:
                        /*add point to leader and self*/
                        usersModel.calculatePoinToUser(user._id,poins.create_material);
                        usersModel.calculatePoinToLeader(user.referenced_by.UserID,poins.create_material);
                        break;

                }
                dashboardLogModel.createMediaNews(query);
                userLogModel.create(query);
                if(query.Challenge_id != null){
                    query.NewsID = result.newsDetail._id
                    challengeModel.answerChallenge(query);
                }
                broadcastNotification("Aktivitas Terbaru dari "+user.username,query.Content,query.ContentText,query.ContentID)
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/news/create/text', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token', 'Content', 'Tags'],query)) {
        try {
            let result = {};
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign({}, requestResponse.token_invalid);
            else {
                let now = new Date();
                query.CreatedAt=now;
                query.UserID=user._id;
                query.Username=user.username;
                
                result=Object.assign({}, requestResponse.common_create_success);
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
                result.newsDetail=await newsModel.createUsersActivitiesWithText(query);
                
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

                //dashboard logging
                if(IsChallenge){
                    query.Title="Challenge";
                    query.Challenge=true;
                }else{
                    query.Title="Aktivitas Relawan";
                }
                query.Desc=query.Content;
                query.ContentCode=activities.create_news.content_code;
                query.ContentText=activities.create_news.content;
                query.ActivityCode=activities.create_news.activity_code;
                query.ActivityText=activities.create_news.activity_text;
                query.ContentID=result.newsDetail._id;
                query.NewsType=2;
                switch (user.role){
                    case 0:
                        /*add point to self*/
                        usersModel.calculatePoinToUser(user._id,poins.create_material);
                        usersModel.calculatePoinToLeader(user._id,poins.create_material);
                        break;
                    case 1:
                        /*add point to self*/
                        usersModel.calculatePoinToUser(user._id,poins.create_material);
                        usersModel.calculatePoinToLeader(user._id,poins.create_material);

                        break;
                    case 2:
                        /*add point to leader and self*/
                        usersModel.calculatePoinToUser(user._id,poins.create_material);
                        usersModel.calculatePoinToLeader(user.referenced_by.UserID,poins.create_material);
                        break;

                }
                dashboardLogModel.createNews(query);
                userLogModel.create(query);
                if(query.Challenge_id != null){
                    query.NewsID = result.newsDetail._id
                    challengeModel.answerChallenge(query);
                }
                broadcastNotification("Aktivitas Terbaru dari "+user.username,query.Content,query.ContentText,query.ContentID)
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign({}, requestResponse.common_error)
        }
    } else ctx.body = Object.assign({}, requestResponse.body_incomplte)
});

router.post('/news/detail', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token', 'NewsID'],query)) {
        try {
            let result = {};
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                result=Object.assign(requestResponse.common_create_success);
                query.UserID=user._id;
                let results=await newsModel.getNewsDetail(query.NewsID);
                //console.log(results)
                let dateNow=moment(new Date());
                dateNow.locale('id');
                let newDate=moment(results.created_at);
                newDate.locale('id');
                results.created_at_string=newDate.format('LLLL');
                results.created_at_from_now=dateNow.to(newDate);
                let userActivity=await activityLogModel.getUserLogActivity(query.UserID,query.NewsID);
                results.upvoted=false;
                results.downvoted=false;
                results.favorited=false;
                try {
                    let expireDate=moment(results.challenge_detail.expire)
                    results.challenge_detail.challenge_time_remaining=dateNow.to(expireDate)
                } catch (error) {
                    debug('Error ' + error);
                }
                await userActivity.forEach(function (index) {
                    switch (parseInt(index.activity_code)){
                        case 2:
                            results.upvoted=true;
                            break;
                        case 3:
                            results.downvoted=true;
                            break;
                        case 4:
                            results.favorited=true;
                            break;
                    }
                });
                result.results=results
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/news/list', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','Skip'],query)) {
        try {
            let result = {};
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                result=Object.assign(requestResponse.common_success);
                result.results=await parseDataListForums(await newsModel.getListWithUserPicture2(query.Skip));
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/news/aktivasi', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','NewsID'],query)) {
        try {
            let result = {};
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                result=Object.assign(requestResponse.common_success);
                dashboardLogModel.setStatusAsActivated(query.NewsID);
                result.results=await newsModel.aktivasiNews(query);
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/news/deaktivasi', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','NewsID'],query)) {
        try {
            let result = {};
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                result=Object.assign(requestResponse.common_success);
                dashboardLogModel.setStatusAsDeleted(query.NewsID)
                result.results=await newsModel.deaktivasiNews(query);
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
module.exports = router;