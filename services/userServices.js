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
        const dateTime = new Date;
        //yyyy-mm-dd date format
        const date = dateTime.toISOString().split('T')[0];
        console.log(typeof date);
        const userExist = await user.findOne({ email, date: date });
        if (!userExist) {
            console.log("check")
            const newUser = new user({
                email,
                date: date,
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
        const { email, completed, gameStatus, attempt, score, wordArray, gameOver, currAttempt } = req.body;
        const dateTime = new Date;
        //yyyy-mm-dd date format
        const date = dateTime.toISOString().split('T')[0];
        const time = dateTime.toISOString().split('T')[1].slice(0, 8);
        console.log(time)
        if (!completed) {
            const userUpdateResult = await user.updateOne({ email, date }, { time, completed, gameStatus, attempt, score, wordArray, gameOver, currAttempt });
            if (userUpdateResult) {
                return true;
            } return false;
        }
        else {
            return false
        }


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
