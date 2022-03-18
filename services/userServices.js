const jwt = require('jsonwebtoken');
const user = require('../model/user');
const wordCollection = require('../model/word');
const responseFile = require('../utils/response');
const mailer = require('../utils/email');
const generateOTP = require('../utils/otp');
const jwtString = process.env.JWTSTRING;
const client = require('../utils/redis');

exports.signUp = async (req, res) => {
    try {
        const email = req.body.email;
        const userExist = await user.findOne({ email });
        if (!userExist) {
            const newUser = new user({
                email
            });
            await newUser.save();
        };

        const otp = generateOTP();
        const message = `Your OTP for verification is ${otp} and is valid for 5 minutes`;
        mailer(email, message);
        const redisEmail = await client.set(email, otp, 'EX', 300);

        return "otp has been sent to your registered email"

    } catch (error) {
        console.log(error);
        return responseFile.errorResponse(res, 'Something went wrong !', 500);
    }
}
exports.gameAttempt = async (req, res) => {
    try {
        const { email, array } = req.body;
        const userDetails = await user.findOne({ email });
        let wordArray = userDetails.wordArray;
        wordArray.push(array);
        const updateResult = await user.updateOne({ email }, { wordArray });
        if (updateResult) {
            return array;
        } return false;

    } catch (error) {
        console.log(error);
        return responseFile.errorResponse(res, 'Something went wrong !', 500);
    }
}

exports.userStatus = async (req, res) => {
    try {
        const { email, gameStatus, word, day, attempt, score } = req.body;
        const currentTime = new Date;
        const userUpdateResult = await user.updateOne({ email }, { date: currentTime, gameStatus, word, day, attempt, score });
        if (userUpdateResult) {
            return true;
        } return false;

    } catch (error) {
        console.log(error);
        return responseFile.errorResponse(res, 'Something went wrong !', 500);
    }
}

exports.getWord = async (req, res) => {
    try {
        const day = req.body.day;
        const userDetails = await wordCollection.find({ day }, { __v: 0 });
        return userDetails;
    } catch (error) {
        console.log(error);
        return responseFile.errorResponse(res, 'Something went wrong !', 500);
    }
}