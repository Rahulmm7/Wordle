const jwt = require('jsonwebtoken');
const user = require('../model/user');
const wordCollection = require('../model/word');
const responseFile = require('../utils/response');
const mailer = require('../utils/email');
const generateOTP = require('../utils/otp');
const jwtString = process.env.JWTSTRING;

exports.signUpStatus = async (req, res) => {
    try {
        const email = req.body.email;
        const newUser = new user({
            email
        });
        await newUser.save();


        const payload = {
            user: {
                id: newUser.id
            }
        };
        const token = jwt.sign(payload, jwtString, { expiresIn: 10000 }, { algorithm: 'RS256' });

        const otp = generateOTP();
        const message = `Your OTP for verification is ${otp}`;
        // mailer(email, message);

        const returnObject = {
            token,
            otp
        }

        return returnObject;

    } catch (error) {
        console.log(error);
        return responseFile.errorResponse(res, 'Something went wrong !', 500);
    }
}

exports.userStatus = async (req, res) => {
    try {
        const { email, gameStatus, word } = req.body;
        const currentTime = new Date;
        const userUpdateResult = await user.updateOne({ email }, { date: currentTime, gameStatus, word });
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
        const date = req.body.date;
        const userDetails = await wordCollection.find({ date }, { __v: 0 });
        return userDetails;
    } catch (error) {
        console.log(error);
        return responseFile.errorResponse(res, 'Something went wrong !', 500);
    }
}