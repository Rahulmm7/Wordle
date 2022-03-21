const jwt = require('jsonwebtoken');
const user = require('../model/user');
const wordCollection = require('../model/word');
const responseFile = require('../utils/response');
const mailer = require('../utils/email');
const generateOTP = require('../utils/otp');
const jwtString = process.env.JWTSTRING;
const client = require('../utils/redis');
const { closing } = require('../utils/redis');

exports.signUp = async (req, res) => {
    try {
        const email = req.body.email;
        // mm/dd/yyyy date format
        const dateTime = new Date().toLocaleString("en-US", {timeZone:
            "Asia/Kolkata"});
        const date =  dateTime.split(',')[0];
        console.log( date);
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
exports.userDetails = async (req, res) => {
    try {
        const  email  = req.query.email;
      
        const dateTime = new Date().toLocaleString("en-US", {timeZone:
            "Asia/Kolkata"});
        const date = dateTime.split(',')[0];
          
        const userDetails = await user.findOne({ email,date });
       return userDetails;
       
    } catch (error) {
        console.log(error);
        return responseFile.errorResponse(res, 'Something went wrong !', 500);
    }
}


exports.userStatus = async (req, res) => {
    try {
        const { email, completed, gameStatus, attempt, score, wordArray, gameOver, currAttempt } = req.body;
        
        // mm/dd/yyyy date format
        const dateTime = new Date().toLocaleString("en-US", {timeZone:
            "Asia/Kolkata"});
        const date = dateTime.split(',')[0];
        const time = dateTime.split(',')[1];
       
            const userUpdateResult = await user.updateOne({ email, date }, { time, completed, gameStatus, attempt, score, wordArray, gameOver, currAttempt });
            console.log(userUpdateResult)
            if (userUpdateResult.modifiedCount) {
                return 'sucess';
            } return 'failed';
        

    } catch (error) {
        console.log(error);
        return responseFile.errorResponse(res, 'Something went wrong !', 500);
    }
}

exports.getWord = async (req, res) => {
    try {
        const date = req.query.date;
        const wordDetails = await wordCollection.findOne({ date }, { __v: 0 });
        console.log(wordDetails);
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
