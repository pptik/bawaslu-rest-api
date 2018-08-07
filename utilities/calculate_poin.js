const randomstring = require("randomstring");
const dashboardLogsModel=require('../models/dashboard_logs_models');
const commentsModel=require('../models/comments_models');
const usersModel=require('../models/users_models');
const {poins}=require('../setup');

exports.distributePoins=function(ContentID,Type) {
    return new Promise(async (resolve, reject) => {
        try {
            let contentDetail=await dashboardLogsModel.getDetailDashboardLogAndUserDetail(ContentID);
            let poin=0;
            switch (parseInt(Type)){
                case 0:
                    poin=poins.create_material;
                    break;

                case 1:

                    break;

                case 2:
                    poin=poins.upvote;
                    break;

                case 3:
                    poin=poins.downvote;
                    break;

                case 4:
                    poin=poins.favorite;
                    break;
            }
            switch (contentDetail.user_detail.role){
                case 0:
                    /*add point to self*/
                    usersModel.calculatePoinToUser(contentDetail.user_detail._id,poin);
                    usersModel.calculatePoinToLeader(contentDetail.user_detail._id,poin);
                    break;

                case 1:
                    /*add point to self*/
                    usersModel.calculatePoinToUser(contentDetail.user_detail._id,poin);
                    usersModel.calculatePoinToLeader(contentDetail.user_detail._id,poin);
                    break;

                case 2:
                    /*add point to leader and self*/
                    usersModel.calculatePoinToUser(contentDetail.user_detail._id,poin);
                    usersModel.calculatePoinToLeader(contentDetail.user_detail.referenced_by.UserID,poin);
                    break;
            }

            resolve(true);
        } catch (err) {
            reject(err)
        }
    })
};
exports.distributeCommentsPoins=function(ContentID,Type) {
    return new Promise(async (resolve, reject) => {
        try {
            let contentDetail=await commentsModel.getDetailCommentAndUserDetail(ContentID);
            let poin=0;
            switch (parseInt(Type)){
                case 0:
                    poin=poins.create_material;
                    break;

                case 1:

                    break;

                case 2:
                    poin=poins.upvote;
                    break;

                case 3:
                    poin=poins.downvote;
                    break;

                case 4:
                    poin=poins.favorite;
                    break;
            }
            switch (contentDetail.user_detail.role){
                case 0:
                    /*add point to self*/
                    usersModel.calculatePoinToUser(contentDetail.user_detail._id,poin);
                    usersModel.calculatePoinToLeader(contentDetail.user_detail._id,poin);
                    break;

                case 1:
                    /*add point to self*/
                    usersModel.calculatePoinToUser(contentDetail.user_detail._id,poin);
                    usersModel.calculatePoinToLeader(contentDetail.user_detail._id,poin);
                    break;

                case 2:
                    /*add point to leader and self*/
                    usersModel.calculatePoinToUser(contentDetail.user_detail._id,poin);
                    usersModel.calculatePoinToLeader(contentDetail.user_detail.referenced_by.UserID,poin);
                    break;
            }

            resolve(true);
        } catch (err) {
            reject(err)
        }
    })
};