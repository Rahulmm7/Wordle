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
                completed: false,
                wordArray: [
                    ["", "", "", "", ""],
                    ["", "", "", "", ""],
                    ["", "", "", "", ""],
                    ["", "", "", "", ""],
                    ["", "", "", "", ""],
                    ["", "", "", "", ""]
                ],
                gameOver: { gameOver: false, guessedWord: false },
                currAttempt: { row: 0, column: 0 }
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
            console.log(userUpdateResult)
            if (userUpdateResult.modifiedCount) {
                return 'sucess';
            } return 'failed';
        }
        else {
            return 'gameOver';
        }


    } catch (error) {
        console.log(error);
        return responseFile.errorResponse(res, 'Something went wrong !', 500);
    }
}

exports.getWord = async (req, res) => {
    try {
        const date = req.body.date;
        const wordDetails = await wordCollection.findOne({ date }, { __v: 0 });
        const letter = wordDetails.word;
        const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        let newLetter = "";
        const key = 12;

        for (let i = 0; i < letter.length; i++) {
            let eachLetter = alphabet.indexOf(letter[i].toLowerCase());
            if (eachLetter + key > 25) {
                newLetter += alphabet[key - (26 - eachLetter)]
            } else {
                newLetter += alphabet[eachLetter + key]
            }
        }
        return newLetter;


    } catch (error) {
        console.log(error);
        return responseFile.errorResponse(res, 'Something went wrong !', 500);
    }
}
