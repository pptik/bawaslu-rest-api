const router = require('koa-router')();
const {requestResponse}=require('../setup');
const {activities}=require('../setup');
const activityLogModel=require('../models/activity_logs_models');
const reportsModel=require('../models/reports_models');
const { checkToken } = require('../utilities/token_helper');
const { alltimeUsersReport } = require('../utilities/data_modify');
const { monthlyUsersReport } = require('../utilities/data_modify');
const { yearlyUsersReport } = require('../utilities/data_modify');
const { monthlyUsersActivityReport } = require('../utilities/data_modify');
const { alltimeUsersActivityReport } = require('../utilities/data_modify');
const { yearlyUsersActivityReport } = require('../utilities/data_modify');
const { usersLeaderListReport } = require('../utilities/data_modify');
const dashboardLogModel=require('../models/dashboard_logs_models');
let moment 	= require('moment');

router.post('/reports/users/alltime', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                result=Object.assign(requestResponse.common_success);
                result.results=await alltimeUsersReport(await reportsModel.alltimeUsersCount());
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/reports/users/yearly', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                result=Object.assign(requestResponse.common_success);
                result.results=await yearlyUsersReport(await reportsModel.yearlyUsersCount())  ;

            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/reports/users/monthly', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                result=Object.assign(requestResponse.common_success);
                result.results=await monthlyUsersReport(await reportsModel.monthlyUsersCount()) ;
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});

router.post('/reports/users/activity/alltime', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                result=Object.assign(requestResponse.common_success);
                result.results=await alltimeUsersActivityReport(await reportsModel.alltimeUsersActivityCount()) ;
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/reports/users/activity/yearly', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                result=Object.assign(requestResponse.common_success);
                result.results=await yearlyUsersActivityReport(await reportsModel.yearlyUsersActivityCount()) ;
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/reports/users/activity/monthly', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                result=Object.assign(requestResponse.common_success);
                result.results=await monthlyUsersActivityReport(await reportsModel.montlyUsersActivityCount());
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/reports/users/leader/list', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                result=Object.assign(requestResponse.common_success);
                result.results=await usersLeaderListReport(await reportsModel.userLeaderList());
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/reports/users/relawan/list', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                result=Object.assign(requestResponse.common_success);
                result.results=await usersLeaderListReport(await reportsModel.userRelawanList());
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/reports/users/search/list', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','SearchString'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                result=Object.assign(requestResponse.common_success);
                result.relawanlist=await usersLeaderListReport(await reportsModel.searchUserRelawanList(query.SearchString));
                result.leaderlist=await usersLeaderListReport(await reportsModel.searchUserLeaderList(query.SearchString));
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/reports/activity/search/list', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','StartDate','EndDate'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                result=Object.assign(requestResponse.common_success);
                result.material=await reportsModel.searchUserByContentActivityList(query.StartDate,query.EndDate,1);
                result.news=await reportsModel.searchUserByContentActivityList(query.StartDate,query.EndDate,2);
                result.forum=await reportsModel.searchUserByContentActivityList(query.StartDate,query.EndDate,3);
                result.summary=await reportsModel.countUserActivityList(query.StartDate,query.EndDate)
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
module.exports = router;