const router = require('koa-router')();
const {requestResponse}=require('../setup');
const dashboardLogModel=require('../models/dashboard_logs_models');
const activityLogModel=require('../models/activity_logs_models');
const { checkToken } = require('../utilities/token_helper');


router.post('/userlog/byid/all', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','UserID'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                result=Object.assign(requestResponse.common_create_success);
                result.results=activityLogModel.getAllLogActivityByUserID(query.UserID);
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/userlog/byid', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','UserID','Skip'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                result=Object.assign(requestResponse.common_create_success);
                result.results=activityLogModel.getAllLogActivityByUserID(query.UserID);
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
module.exports = router;