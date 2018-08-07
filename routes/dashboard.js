const router = require('koa-router')();
const {requestResponse}=require('../setup');
const dashboardLogModel=require('../models/dashboard_logs_models');
const { checkToken } = require('../utilities/token_helper');
const {activities}=require('../setup');
const {sorter}=require('../setup');
const {parseDataListDashboard}=require('../utilities/data_modify');
const {distributePoins}=require('../utilities/calculate_poin');
const materialsModel=require('../models/materials_models');
const forumsModel=require('../models/forums_models');
const newsModel=require('../models/news_models');
const activityLogModel=require('../models/activity_logs_models');

router.post('/dashboard', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','Skip'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                query.UserID=user._id;
                let dashboardList=await dashboardLogModel.getListWithUserPicture(query.Skip);
                dashboardList=await parseDataListDashboard(dashboardList);
                let promises=dashboardList.map(async dashboard=>{
                    let userActivity=await activityLogModel.getUserLogActivity(query.UserID,dashboard.content_id);
                    dashboard.upvoted=false;
                    dashboard.downvoted=false;
                    dashboard.favorited=false;
                    await userActivity.forEach(function (index) {
                        switch (parseInt(index.activity_code)){
                            case 2:
                                dashboard.upvoted=true;
                                break;
                            case 3:
                                dashboard.downvoted=true;
                                break;
                            case 4:
                                dashboard.favorited=true;
                                break;
                        }
                    });
                    return{
                        dashboard
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
router.post('/dashboard/filter/content', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','Skip','ContentCode'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                let dashboardList=await dashboardLogModel.filterListByContent(query.Skip,query.ContentCode);
                dashboardList=await parseDataListDashboard(dashboardList);
                let promises=dashboardList.map(async dashboard=>{
                    let userActivity=await activityLogModel.getUserLogActivity(query.UserID,dashboard.content_id);
                    dashboard.upvoted=false;
                    dashboard.downvoted=false;
                    dashboard.favorited=false;
                    await userActivity.forEach(function (index) {
                        switch (parseInt(index.activity_code)){
                            case 2:
                                dashboard.upvoted=true;
                                break;
                            case 3:
                                dashboard.downvoted=true;
                                break;
                            case 4:
                                dashboard.favorited=true;
                                break;
                        }
                    });
                    return{
                        dashboard
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
router.post('/dashboard/search/title', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','Skip','SearchString'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                let dashboardList=await dashboardLogModel.searchListByTitle(query.Skip,query.SearchString);
                dashboardList=await parseDataListDashboard(dashboardList);

                let promises=dashboardList.map(async dashboard=>{
                    let userActivity=await activityLogModel.getUserLogActivity(query.UserID,dashboard.content_id);
                    dashboard.upvoted=false;
                    dashboard.downvoted=false;
                    dashboard.favorited=false;
                    await userActivity.forEach(function (index) {
                        switch (parseInt(index.activity_code)){
                            case 2:
                                dashboard.upvoted=true;
                                break;
                            case 3:
                                dashboard.downvoted=true;
                                break;
                            case 4:
                                dashboard.favorited=true;
                                break;
                        }
                    });
                    return{
                        dashboard
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
router.post('/dashboard/sort/by', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','Skip','SortType'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                let SortBy={};
                switch (parseInt(query.SortType)){
                    case 0:
                        SortBy=sorter.date_descending;
                        break;
                    case 1:
                        SortBy=sorter.upvote_descending;
                        break;
                    case 2:
                        SortBy=sorter.downvote_descending;
                        break;
                    case 3:
                        SortBy=sorter.favorite_descending;
                        break;
                    case 4:
                        SortBy=sorter.comment_descending;
                        break;
                }

                let dashboardList=await dashboardLogModel.filterListSortBy(query.Skip,SortBy);
                dashboardList=await parseDataListDashboard(dashboardList);
                let promises=dashboardList.map(async dashboard=>{
                    let userActivity=await activityLogModel.getUserLogActivity(query.UserID,dashboard.content_id);
                    dashboard.upvoted=false;
                    dashboard.downvoted=false;
                    dashboard.favorited=false;
                    await userActivity.forEach(function (index) {
                        switch (parseInt(index.activity_code)){
                            case 2:
                                dashboard.upvoted=true;
                                break;
                            case 3:
                                dashboard.downvoted=true;
                                break;
                            case 4:
                                dashboard.favorited=true;
                                break;
                        }
                    });
                    return{
                        dashboard
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
router.post('/dashboard/vote', async (ctx, next) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','ContentID','ActivityCode','ContentCode','Title'],query)) {
        try {
            let result;
            let ActivityContentCode=query.ContentCode +"0"+query.ActivityCode;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                query.UserID=user._id;
                query.Username=user.username;
                if(await activityLogModel.checkUserLogActivity(query)){
                    result=requestResponse.already_vote;
                }else {
                    result=Object.assign(requestResponse.common_create_success);
                    let contentActivity=null;

                    /*send content id and type and then calculate the poin*/
                    let downvoteLog=null;
                    let upvoteLog=null;
                    switch (parseInt(ActivityContentCode)){
                        case 102:
                            contentActivity=activities.upvote_material;
                            downvoteLog=await activityLogModel.checkUserLogActivity2(query,3);
                            if(downvoteLog){
                                activityLogModel.setStatusAsDeletedByID(downvoteLog._id);
                                dashboardLogModel.subtractDownvoteCountToDashboardActivity(query.ContentID);
                                materialsModel.subtractDownvoteCountToMaterial(query.ContentID);
                            }
                            dashboardLogModel.addUpvoteCountToDashboarActivity(query.ContentID);
                            materialsModel.addUpvoteCountToMaterial(query.ContentID);
                            break;
                        case 103:
                            contentActivity=activities.downvote_material;
                            upvoteLog=await activityLogModel.checkUserLogActivity2(query,2);
                            if(upvoteLog){
                                activityLogModel.setStatusAsDeletedByID(upvoteLog._id);
                                dashboardLogModel.subtractUpvoteCountToDashboarActivity(query.ContentID);
                                materialsModel.subtractUpvoteCountToMaterial(query.ContentID);
                            }
                            dashboardLogModel.addDownvoteCountToDashboarActivity(query.ContentID);
                            materialsModel.addDownvoteCountToMaterial(query.ContentID);
                            break;
                        case 104:
                            contentActivity=activities.favourite_material;
                            dashboardLogModel.addFavoriteCountToDashboardActivity(query.ContentID);
                            materialsModel.addFavoriteCountToMaterial(query.ContentID);
                            break;
                        case 202:
                            contentActivity=activities.upvote_news;
                            downvoteLog=await activityLogModel.checkUserLogActivity2(query,3);
                            if(downvoteLog){
                                activityLogModel.setStatusAsDeletedByID(downvoteLog._id);
                                dashboardLogModel.subtractDownvoteCountToDashboardActivity(query.ContentID);
                                newsModel.subDownvoteCountToNews(query.ContentID);
                            }
                            dashboardLogModel.addUpvoteCountToDashboarActivity(query.ContentID);
                            newsModel.addUpvoteCountToNews(query.ContentID);
                            break;
                        case 203:
                            contentActivity=activities.downvote_news;
                            upvoteLog=await activityLogModel.checkUserLogActivity2(query,2);
                            if(upvoteLog){
                                activityLogModel.setStatusAsDeletedByID(upvoteLog._id);
                                dashboardLogModel.subtractUpvoteCountToDashboarActivity(query.ContentID);
                                newsModel.subUpvoteCountToNews(query.ContentID);
                            }
                            dashboardLogModel.addDownvoteCountToDashboarActivity(query.ContentID);
                            newsModel.addDownvoteCountToNews(query.ContentID);
                            break;
                        case 204:
                            contentActivity=activities.favourite_news;
                            console.log("disini")
                            dashboardLogModel.addFavoriteCountToDashboardActivity(query.ContentID);
                            newsModel.addFavoriteCountToNews(query.ContentID);
                            break;
                        case 302:
                            contentActivity=activities.upvote_forum;
                            downvoteLog=await activityLogModel.checkUserLogActivity2(query,3);
                            if(downvoteLog){
                                activityLogModel.setStatusAsDeletedByID(downvoteLog._id);
                                dashboardLogModel.subtractDownvoteCountToDashboardActivity(query.ContentID);
                                forumsModel.subtractDownvoteCountToForum(query.ContentID);
                            }
                            dashboardLogModel.addUpvoteCountToDashboarActivity(query.ContentID);
                            forumsModel.addUpvoteCountToForum(query.ContentID);
                            break;
                        case 303:
                            contentActivity=activities.downvote_forum;
                            upvoteLog=await activityLogModel.checkUserLogActivity2(query,2);
                            if(upvoteLog){
                                activityLogModel.setStatusAsDeletedByID(upvoteLog._id);
                                dashboardLogModel.subtractUpvoteCountToDashboarActivity(query.ContentID);
                                forumsModel.subtractUpvoteCountToForum(query.ContentID);
                            }
                            dashboardLogModel.addDownvoteCountToDashboarActivity(query.ContentID);
                            forumsModel.addDownvoteCountToForum(query.ContentID);
                            break;
                        case 304:
                            contentActivity=activities.favourite_forum;
                            dashboardLogModel.addFavoriteCountToDashboardActivity(query.ContentID);
                            forumsModel.addFavoriteCountToForum(query.ContentID);
                            break;
                    }

                    query.ContentCode=contentActivity.content_code;
                    query.ContentText=contentActivity.content;
                    query.ActivityCode=contentActivity.activity_code;
                    query.ActivityText=contentActivity.activity_text;
                    query.Desc=contentActivity.desc;
                    activityLogModel.create(query);
                    result.results=await dashboardLogModel.getDetailDashboardLog(query.ContentID);
                    distributePoins(query.ContentID,query.ActivityCode);

                }

            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/dashboard/test', async (ctx, next) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','ContentID','ActivityCode','ContentCode','Title'],query)) {
        try {


            ctx.body = await distributePoins(query.ContentID,query.ActivityCode);
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
module.exports = router;