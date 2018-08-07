const config = require('../config.json');
const validAppIds = config.valid_app_id;

checkBody = (params, body) => {
    let valid = true;
    for(let i = 0; i < params.length; i++){
        if(!(params[i] in body)) valid = false
    }

    if(valid && body.hasOwnProperty('app_id')){
        valid = checkValidAppID(parseInt(body['app_id']))
    }
    
    return valid
};


simpleCheckBody = (params, body) => {
    let valid = true;
    for(let i = 0; i < params.length; i++){
        if(!(params[i] in body)) valid = false
    }
    return valid
};

checkValidAppID = (appId) => {
    return validAppIds.some(a => a.id === appId)
};

validateEmail = (email) => {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

validatePhone = (phonenumer) => {
    let re = /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/img;
    return re.test(phonenumer);
};


module.exports = { checkBody, validateEmail, validatePhone, simpleCheckBody };