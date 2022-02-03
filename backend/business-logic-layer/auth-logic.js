const jwt = require("jsonwebtoken");
const dal = require("../data-access-layer/dal");

async function loginAsync(credentials) {
    const user = await dal.executeQueryAsync(
        `
            select * from users where userName=? and password=?
        `,
        [credentials.username, credentials.password]
    );
    if (!user || user.length<1) return null;
    delete user[0].password;

    user[0].token = jwt.sign({user:user[0]} , "welcome to oron's vacations project", { expiresIn: "5 minutes" });
    return user[0];
}

module.exports = {
    loginAsync
};