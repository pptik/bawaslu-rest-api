const router = require('koa-router')();
const {requestResponse}=require('../setup');
const regionsModel=require('../models/regions_models');
const tpsModel=require('../models/tps_models');
const { checkToken } = require('../utilities/token_helper');

router.post('/tps/create', async (ctx, next) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','TPSNumber', 'TPSCode','VillageID','Latitude','Longitude','Address'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                query.UserID=user._id;
                query.Username=user.username;
                query.village=await regionsModel.getVillageDetail(query.VillageID);
                query.district=await regionsModel.getDistrictDetail(query.village.district_code);
                query.regency=await regionsModel.getRegencyDetail(query.district.regency_code);
                query.province=await regionsModel.getProvinceDetail(query.regency.province_code);
                let tpsDetail=await tpsModel.create(query);
                result=Object.assign(requestResponse.common_create_success);
                result.tpsdetail=tpsDetail;
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});

module.exports = router;