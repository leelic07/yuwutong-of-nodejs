/**
 * Created by Administrator on 2018/3/2/002.
 */
const Strategy = require('passport-http-bearer').Strategy;
const db = require('../model');

module.exports = function (passport) {
    passport.use(new Strategy(
        function (token, done) {
            db.getUsers().find({
                token: token
            }).then(user => {
                if (!user.length) return done(null, false);
                return done(null, user[0]);
            }).catch(err => done(err));
        }
    ));
};