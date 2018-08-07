const router = require('koa-router')();
const {requestResponse}=require('../setup');
const regionsModel=require('../models/regions_models');

router.post('/regions/provinces', async (ctx, next) => {
    try {
        let query=ctx.request.body;
        let result=result=Object.assign(requestResponse.common_create_success);
        result.results=await regionsModel.getListProvinces();
        ctx.body = result;
    } catch (error) {
        console.log("Error : ", error);
        ctx.body = Object.assign(requestResponse.common_error)
    }
});
router.post('/regions/regencies/by/province', async (ctx, next) => {
    if (checkBody(['provinceCode'], ctx.request.body)) {
        try {
            let query=ctx.request.body;
            let result=result=Object.assign(requestResponse.common_create_success);
            result.results=await regionsModel.getListRegenciesByProvinceCode(query.provinceCode);
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/regions/districts/by/regency', async (ctx, next) => {
    if (checkBody(['regencyCode'], ctx.request.body)) {
        try {
            let query=ctx.request.body;
            let result=result=Object.assign(requestResponse.common_create_success);
            result.results=await regionsModel.getListDistrictsByRegencyCode(query.regencyCode);
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/regions/villages/by/district', async (ctx, next) => {
    if (checkBody(['districtCode'], ctx.request.body)) {
        try {
            let query=ctx.request.body;
            let result=result=Object.assign(requestResponse.common_create_success);
            result.results=await regionsModel.getListVillagesByDistrictCode(query.districtCode);
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
module.exports = router;