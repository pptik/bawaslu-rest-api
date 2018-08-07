const router = require('koa-router')();
const { requestResponse } = require('../setup');
const materialsModel = require('../models/materials_models');
const usersModel = require('../models/users_models');
const dashboardLogModel = require('../models/dashboard_logs_models');
const { checkToken } = require('../utilities/token_helper');
const { activities } = require('../setup');
const { parseCreatedDateToString } = require('../utilities/date_parser');
const { parseDataListMaterial } = require('../utilities/data_modify');
let moment = require('moment');
const { sorter } = require('../setup');
const activityLogModel = require('../models/activity_logs_models');
const { poins } = require('../setup');
const tagsModel = require('../models/tags_model')
const challengeModel = require('../models/challenge_models')
const { broadcastNotification } = require('../services/notification');


router.post('/material/update', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token', 'Title', 'Desc', 'Files', 'Type', 'MaterialID'], query)) {
        try {
            let result={};
            let user = await checkToken(query.access_token);
            if (user === false) result = Object.assign(requestResponse.token_invalid);
            else {
                query.UserID = user._id;
                query.Username = user.username;

                result = Object.assign(requestResponse.common_update_success);
                result.materialDetail = await materialsModel.update(query);
                dashboardLogModel.updateTitleAndDescMaterial(query)
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/material/create', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token', 'Title', 'Desc', 'Files', 'Type', 'Tags'], query)) {
        try {
            let result = {};
            let user = await checkToken(query.access_token);
            if (user === false) result = Object.assign(requestResponse.token_invalid);
            else {
                query.UserID = user._id;
                query.Username = user.username;
                switch (user.role) {
                    case 0:
                        /*add point to self*/
                        usersModel.calculatePoinToUser(user._id, poins.create_material);
                        usersModel.calculatePoinToLeader(user._id, poins.create_material);
                        break;
                    case 1:
                        /*add point to self*/
                        usersModel.calculatePoinToUser(user._id, poins.create_material);
                        usersModel.calculatePoinToLeader(user._id, poins.create_material);

                        break;
                    case 2:
                        /*add point to leader and self*/
                        usersModel.calculatePoinToUser(user._id, poins.create_material);
                        usersModel.calculatePoinToLeader(user.referenced_by.UserID, poins.create_material);
                        break;

                }
                result = Object.assign(requestResponse.common_create_success);
                query.Files = JSON.parse(query.Files);
                let now = new Date()
                query.CreatedAt = now
                query.Challenge = false;
                let IsChallenge = (query.IsChallenge === "true");
                if (IsChallenge) {
                    query.Challenge = true;
                    let poin = { poin: parseInt(query.ChallengePoin) }
                    let expire = { expire: moment(query.ChallengeExpire, "DD-MM-YYYY").toDate() }
                    let created_at = { created_at: now }
                    query.ChallengeDetail = Object.assign(created_at, expire, poin)
                    challengeModel.create(query)
                }
                result.materialDetail = await materialsModel.create(query);

                let tags = query.Tags;
                if (tags.length > 0) {
                    for (let i = 0; i < tags.length; i++) {
                        if (await tagsModel.checkTag(tags[i])) {
                            tagsModel.addCountToTags(tags[i]);
                        } else {
                            tagsModel.create(query, tags[i]);
                        }
                    }
                }

                query.ContentCode = activities.create_material.content_code;
                query.ContentText = activities.create_material.content;
                query.ActivityCode = activities.create_material.activity_code;
                query.ActivityText = activities.create_material.activity_text;
                query.ContentID = result.materialDetail._id;
                dashboardLogModel.create(query);
                broadcastNotification("Materi Terbaru dari " + user.username, query.Title, query.ContentText, query.ContentID)
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/material/list', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token', 'Skip'], query)) {
        try {
            let result={};
            let user = await checkToken(query.access_token);
            if (user === false) result = Object.assign(requestResponse.token_invalid);
            else {
                let materialList = await materialsModel.getListWithUserPicture(query.Skip);
                materialList = await parseDataListMaterial(materialList);
                result = Object.assign(requestResponse.common_success);

                let promises = materialList.map(async material => {
                    let userActivity = await activityLogModel.getUserLogActivity(user._id, material._id);
                    //console.log(userActivity)
                    let dateNow = moment(new Date());
                    dateNow.locale('id');
                    material.upvoted = false;
                    material.downvoted = false;
                    material.favorited = false;
                    try {
                        let expireDate = moment(material.challenge_detail.expire)
                        material.challenge_detail.challenge_time_remaining = dateNow.to(expireDate)
                    } catch (error) {
                        console.log('Error ' + error);
                    }
                    await userActivity.forEach(function (index) {
                        switch (parseInt(index.activity_code)) {
                            case 2:
                                material.upvoted = true;
                                break;
                            case 3:
                                material.downvoted = true;
                                break;
                            case 4:
                                material.favorited = true;
                                break;
                        }
                    });
                    return {
                        "_id": material._id,
                        "title": material.title,
                        "desc": material.desc,
                        "type": material.type,
                        "post_by": material.post_by,
                        "files": material.files,
                        "upvote": material.upvote,
                        "downvote": material.downvote,
                        "favorite": material.favorite,
                        "comment": material.comment,
                        "challenge": material.challenge,
                        "challenge_detail": material.challenge_detail,
                        "created_at": material.created_at,
                        "updated_at": material.updated_at,
                        "user_detail": material.user_detail,
                        "index": material.index,
                        "created_at_string": material.created_at_string,
                        "synopsis": material.synopsis,
                        "loadmore": material.loadmore,
                        "created_at_from_now": material.created_at_from_now,
                        "upvoted": material.upvoted,
                        "downvoted": material.downvoted,
                        "favorited": material.favorited
                    }
                });
                result.results = await Promise.all(promises);

            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/material/list/all', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token'], query)) {
        try {
            let result={};
            let user = await checkToken(query.access_token);
            if (user === false) result = Object.assign(requestResponse.token_invalid);
            else {
                let materialList = await materialsModel.getAllList();
                result = Object.assign(requestResponse.common_success);
                result.results = materialList;
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/material/delete', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token', 'MaterialID'], query)) {
        try {
            let result={};
            let user = await checkToken(query.access_token);
            if (user === false) result = Object.assign(requestResponse.token_invalid);
            else {
                if (await usersModel.checkIfUserIsAdmin(user._id)) {
                    await materialsModel.setStatusAsDeleted(query.MaterialID);
                    await dashboardLogModel.setStatusAsDeleted(query.MaterialID);
                    result = Object.assign(requestResponse.common_delete_success);
                } else {
                    result = Object.assign(requestResponse.account_not_admin)
                }
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/material/detail', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token', 'MaterialID'], query)) {
        try {
            let result = {};
            let user = await checkToken(query.access_token);
            if (user === false) result = Object.assign(requestResponse.token_invalid);
            else {
                let detailMaterial = await materialsModel.getDetailMaterial(query.MaterialID);
                result = Object.assign(requestResponse.common_success);
                let dateNow = moment(new Date());
                dateNow.locale('id');
                let newDate = moment(detailMaterial.created_at);
                newDate.locale('id');
                detailMaterial.created_at_string = newDate.format('LLLL');
                detailMaterial.synopsis = detailMaterial.desc.slice(0, detailMaterial.desc.length / 10);
                detailMaterial.created_at_from_now = dateNow.to(newDate);

                let userActivity = await activityLogModel.getUserLogActivity(user._id, query.MaterialID);
                detailMaterial.upvoted = false;
                detailMaterial.downvoted = false;
                detailMaterial.favorited = false;
                try {
                    let expireDate = moment(detailMaterial.challenge_detail.expire)
                    detailMaterial.challenge_detail.challenge_time_remaining = dateNow.to(expireDate)
                } catch (error) {
                    console.log('Error ' + error);
                }

                await userActivity.forEach(function (index) {
                    switch (parseInt(index.activity_code)) {
                        case 2:
                            detailMaterial.upvoted = true;
                            break;
                        case 3:
                            detailMaterial.downvoted = true;
                            break;
                        case 4:
                            detailMaterial.favorited = true;
                            break;
                    }
                });
                result.results = detailMaterial;

            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/material/filter/content', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token', 'Skip', 'Type'], query)) {
        try {
            let result={};
            let user = await checkToken(query.access_token);
            if (user === false) result = Object.assign(requestResponse.token_invalid);
            else {
                let materialList = await materialsModel.filterListByType(query.Skip, query.Type);
                materialList = await parseDataListDashboard(materialList);
                result = Object.assign(requestResponse.common_success);
                result.results = materialList;
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/material/search/title', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token', 'Skip', 'SearchString'], query)) {
        try {
            let result={};
            let user = await checkToken(query.access_token);
            if (user === false) result = Object.assign(requestResponse.token_invalid);
            else {
                let materialList = await materialsModel.searchListByTitle(query.Skip, query.SearchString);
                materialList = await parseDataListDashboard(materialList);
                result = Object.assign(requestResponse.common_success);
                result.results = materialList;
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});

router.post('/material/sort/by', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token', 'Skip', 'SortType'], query)) {
        try {
            let result={};
            let user = await checkToken(query.access_token);
            if (user === false) result = Object.assign(requestResponse.token_invalid);
            else {
                let SortBy = {};
                switch (parseInt(query.SortType)) {
                    case 0:
                        SortBy = sorter.date_descending;
                        break;
                    case 1:
                        SortBy = sorter.upvote_descending;
                        break;
                    case 2:
                        SortBy = sorter.downvote_descending;
                        break;
                    case 3:
                        SortBy = sorter.favorite_descending;
                        break;
                    case 4:
                        SortBy = sorter.comment_descending;
                        break;
                }

                let dashboardList = await dashboardLogModel.filterListSortBy(query.Skip, SortBy);
                dashboardList = await parseDataListDashboard(dashboardList);
                result = Object.assign(requestResponse.common_success);
                result.results = dashboardList;
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});

module.exports = router;