const ObjectId = require('mongodb').ObjectID;


exports.createQuestion=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let question = {
                question:query.Question,
                poin:query.Poin,
                post_by:{
                    user_id:new ObjectId(query.UserID),
                    username:query.Username
                },
                status:0,
                answer:query.Answer,
                created_at: new Date(),
                updated_at:[]
            };
            let database = require('../app').database;
            let questionColl = database.collection('question');
            let result = await questionColl.insertOne(question);
            resolve(result['ops'][0])
        } catch (err) {
            reject(err)
        }
    })
};
exports.create=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let quiz = {
                title:query.Title,
                desc:query.Desc,
                post_by:{
                    user_id:new ObjectId(query.UserID),
                    username:query.Username
                },
                status:0,
                level:parseInt(query.Level),
                created_at: new Date(),
                updated_at:[]
            };
            let database = require('../app').database;
            let quizColl = database.collection('quizzes');
            let result = await quizColl.insertOne(quiz);
            resolve(result['ops'][0])
        } catch (err) {
            reject(err)
        }
    })
};
exports.createQuestion=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let quizQuestion = {
                quiz_id:new ObjectId(query.QuizID),
                question:query.Question,
                post_by:{
                    user_id:new ObjectId(query.UserID),
                    username:query.Username
                },
                status:0,
                poin:parseInt(query.Poin),
                multiple_choice:query.MultipleChoice,
                created_at: new Date(),
                updated_at:[]
            };
            let database = require('../app').database;
            let quizQuestionColl = database.collection('quiz_question');
            let result = await quizQuestionColl.insertOne(quizQuestion);
            resolve(result['ops'][0])
        } catch (err) {
            reject(err)
        }
    })
};
exports.editQuestion=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let quizQuestion = {
                question:query.Question,
                poin:parseInt(query.Poin),
                multiple_choice:query.MultipleChoice,
            };
            let updatedBy={
                date:new Date(),
                user_id:new ObjectId(query.UserID),
                username:query.Username
            };
            let database = require('../app').database;
            let quizQuestionColl = database.collection('quiz_question');
            let result = await quizQuestionColl.findOneAndUpdate({_id:new ObjectId(query.QuestionID)},{$set:quizQuestion,$push:{updated_at:updatedBy}},{returnOriginal:false});
            resolve(result.value)
        } catch (err) {
            reject(err)
        }
    })
};
exports.questionsList=function(QuizID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let quizzesQuestionColl = database.collection('quiz_question');
            let questions = await quizzesQuestionColl.find({quiz_id:new ObjectId(QuizID)}).toArray();
            resolve(questions);
        } catch (err) {
            reject(err)
        }
    })
};
exports.quizScore=function(QuizID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let quizzesQuestionColl = database.collection('quiz_question');
            let quiz= await quizzesQuestionColl.aggregate([
                {
                    $match:{
                        quiz_id:new ObjectId(QuizID)
                    }
                },
                {
                    $group: {
                        _id: '$quiz_id',
                        total: { $sum: "$poin" }
                    }
                }
            ]).toArray();
            if(quiz.length>0){
                resolve(quiz[0].total);
            }else {
                resolve(0)
            }
        } catch (err) {
            reject(err)
        }
    })
};
exports.deleteQuestion=function(QuestionID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let quizzesQuestionColl = database.collection('quiz_question');
            await quizzesQuestionColl.deleteOne({_id:new ObjectId(QuestionID)});
            resolve(true);
        } catch (err) {
            reject(err)
        }
    })
};
exports.listAllQuiz=function() {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let quizzesColl = database.collection('quizzes');
            quizzesColl.aggregate([
                {
                    $lookup:{
                        from:"users",
                        localField:"post_by.user_id",
                        foreignField:"_id",
                        as:"user_detail"
                    }
                },
                {$unwind:"$user_detail"},
                {
                    $project:{
                        'user_detail.display_picture':1,
                        title:1,
                        desc:1,
                        post_by:1,
                        status:1,
                        level:1,
                        created_at:1,
                        updated_at:1
                    }
                }
            ]).sort({created_at:-1}).toArray(function (err,results) {
                if(err)reject(err);
                else resolve(results);
            });
        } catch (err) {
            reject(err)
        }
    })
};
exports.publishedQuizList=function() {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let quizzesColl = database.collection('quizzes');
            quizzesColl.aggregate([
                {
                    $match:{
                        status:1
                    }
                },
                {
                    $project:{
                        title:1,
                        desc:1,
                        status:1,
                        level:1,
                        created_at:1
                    }
                }
            ]).sort({created_at:-1}).toArray(function (err,results) {
                if(err)reject(err);
                else resolve(results);
            });
        } catch (err) {
            reject(err)
        }
    })
};
exports.detailQuiz=function(QuizID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let quizzesColl = database.collection('quizzes');
            quizzesColl.aggregate([
                {
                  $match:{_id:new ObjectId(QuizID)}
                },
                {
                    $lookup:{
                        from:"users",
                        localField:"post_by.user_id",
                        foreignField:"_id",
                        as:"user_detail"
                    }
                },
                {$unwind:"$user_detail"},
                {
                    $lookup:{
                        from:"quiz_question",
                        localField:"_id",
                        foreignField:"quiz_id",
                        as:"question_list"
                    }
                },
                {
                    $project:{
                        question_list:1,
                        'user_detail.display_picture':1,
                        title:1,
                        desc:1,
                        post_by:1,
                        status:1,
                        level:1,
                        created_at:1,
                        updated_at:1
                    }
                }
            ]).sort({created_at:-1}).toArray(function (err,results) {
                if(err)reject(err);
                else {
                    if(results.length>0){
                        resolve(results[0])
                    }else resolve(false)
                }
            });
        } catch (err) {
            reject(err)
        }
    })
};
exports.listPublishedQuiz=function() {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let quizzesColl = database.collection('quizzes');
            let quizzes = await quizzesColl.find({status:1}).sort({created_at:-1}).toArray();
            resolve(quizzes);
        } catch (err) {
            reject(err)
        }
    })
};
exports.activateQuiz=function(QuizID) {
    return new Promise(async (resolve, reject) => {
        try {
            let quiz = {
                status:1
            };
            let database = require('../app').database;
            let quizColl = database.collection('quizzes');
            let result=await quizColl.findOneAndUpdate({_id:new ObjectId(QuizID)},{$set:quiz},{returnOriginal:false});
            resolve(result)
        } catch (err) {
            reject(err)
        }
    })
};
exports.updateQuiz=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let quiz = {
                title:query.Title,
                desc:query.Desc,
                level:parseInt(query.Level)
            };
            let updatedBy={
                date:new Date(),
                user_id:new ObjectId(query.UserID),
                username:query.Username
            };
            let database = require('../app').database;
            let quizColl = database.collection('quizzes');
            let result=await quizColl.findOneAndUpdate({_id:new ObjectId(query.QuizID)},{$set:quiz,$push:{updated_at:updatedBy}},{returnOriginal:false});
            resolve(result.value)
        } catch (err) {
            reject(err)
        }
    })
};
exports.publishQuiz=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let quiz = {
                status:1
            };
            let updatedBy={
                date:new Date(),
                user_id:new ObjectId(query.UserID),
                username:query.Username
            };
            let database = require('../app').database;
            let quizColl = database.collection('quizzes');
            let result=await quizColl.findOneAndUpdate({_id:new ObjectId(query.QuizID)},{$set:quiz,$push:{updated_at:updatedBy}},{returnOriginal:false});
            resolve(result.value)
        } catch (err) {
            reject(err)
        }
    })
};
exports.unpublishQuiz=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let quiz = {
                status:0
            };
            let updatedBy={
                date:new Date(),
                user_id:new ObjectId(query.UserID),
                username:query.Username
            };
            let database = require('../app').database;
            let quizColl = database.collection('quizzes');
            let result=await quizColl.findOneAndUpdate({_id:new ObjectId(query.QuizID)},{$set:quiz,$push:{updated_at:updatedBy}},{returnOriginal:false});
            resolve(result.value)
        } catch (err) {
            reject(err)
        }
    })
};
exports.createUserQuizActivity=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let quizActivity = {
                quiz_id:new ObjectId(query.QuizID),
                post_by:{
                    user_id:new ObjectId(query.UserID),
                    username:query.Username
                },
                score:parseInt(query.Score),
                attempt_duration:parseInt(query.AttemptDuration),
                date_taken: new Date(),
                total_question:parseInt(query.TotalQuestion),
                correct_answer:parseInt(query.CorrectAnswer),
                wrong_answer:parseInt(query.WrongAnswer),
                no_answer:parseInt(query.NoAnswer),
                attempt:parseInt(query.Attempt)
            };
            let database = require('../app').database;
            let quizActivityColl = database.collection('quiz_activity');
            let result = await quizActivityColl.insertOne(quizActivity);
            resolve(result['ops'][0])
        } catch (err) {
            reject(err)
        }
    })
};

exports.userBiggestScore=function(UserID,QuizID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let quizActivityColl = database.collection('quiz_activity');
            let quizActiity = await quizActivityColl.find({quiz_id:new ObjectId(QuizID),"post_by.user_id":new ObjectId(UserID)}).sort({score:-1}).limit(1).toArray();
            if(quizActiity.length>0){
                resolve(quizActiity[0].score);
            }else resolve(0);
        } catch (err) {
            reject(err)
        }
    })
};
exports.countAttemptUserQuizActivity=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let quizActivityColl = database.collection('quiz_activity');
            let result = await quizActivityColl.find({quiz_id:new ObjectId(query.QuizID),"post_by.user_id":new ObjectId(query.UserID)}).count();
            resolve(result + 1)
        } catch (err) {
            reject(err)
        }
    })
};