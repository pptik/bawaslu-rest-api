const { dbConnect } = require('../setup');
const base64 = require('base-64');

checkToken = (token) => {
    return new Promise(async (resolve, reject) => {
        try {
            let db = await dbConnect();
            let userColl = db.collection('users');
            let definedToken = token.split('~');
            let usernameValid = await isUsernameValid(definedToken[0], userColl);
            db.close();
            if (!usernameValid) resolve(false);
            else {
                let tokenValid = usernameValid.access.some(a => a.token === definedToken[1]);
                if(!tokenValid) resolve(false);
                else {
                    delete usernameValid.password;
                    delete usernameValid.access;
                    resolve(usernameValid)
                }
            }
        } catch (error) {
            reject(error)
        }
    })
};

isUsernameValid = (encodedUsername, coll) => {
    //console.log(encodedUsername)
    return new Promise(async (resolve, reject) => {
        try {
            let username = base64.decode(encodedUsername);
            let users = await coll.find({ username: username }).toArray();
            if (users.length < 0) resolve(false);
            else resolve(users[0])
        } catch (error) {
            resolve(false)
            //reject(error)
        }
    })
};


module.exports = { checkToken };