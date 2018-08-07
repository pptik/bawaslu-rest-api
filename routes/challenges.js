const router = require('koa-router')()
const { checkToken } = require('../utilities/token_helper')
const { requestResponse } = require('../setup')
const challengeModel = require('../models/challenge_models')

router.post('/challenges/list', async(ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header)
    if(checkBody(['access_token'], query)){
        try {
            let user = await checkToken(query.access_token)
            let result={}
            if(user===false) result=Object.assign(requestResponse.token_invalid)
            else{
                result=Object.assign(requestResponse.common_success)
                result.results=await challengeModel.getChallengeList();
            } 
            ctx.body=result
            
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});

module.exports = router;