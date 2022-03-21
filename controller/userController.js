const user = require('../model/user');
const jwt = require('jsonwebtoken');
const jwtString = process.env.JWTSTRING;
const wordCollection = require('../model/word');
const userService = require('../services/userServices');
const responseFile = require('../utils/response');
const client = require('../utils/redis');

exports.signup = async (req, res) => {
    try {
        const email = req.body.email;

        let response = await userService.signUp(req, res);
        if (response) {
            return responseFile.successResponse(res, response);
        }
        else {
            return responseFile.errorResponse(res, 'Something went wrong !!!', 500);
        }

    } catch (error) {
        console.log(error);
        return responseFile.errorResponse(res, 'Something went wrong !', 500);

    }

}

exports.emailVerify = async (req, res) => {
    const { email, otp } = req.body;
     //  mm/dd/yyyy date format
     const dateTime = new Date().toLocaleString("en-US", {timeZone:
        "Asia/Kolkata"});
    const date = dateTime.split(',')[0];
    try {
        const userdata = await user.findOne({ email, date }, { __v: 0 });
        client.get(email, async (err, data) => {
            if (err) {
                console.log('error', err);
            }

            if (data === otp) {
                const payload = {
                    user: {
                        id: userdata.id
                    }
                };
                const token = jwt.sign(payload, jwtString, { expiresIn: 10000 }, { algorithm: 'RS256' });
                return responseFile.successResponse(res, { token, gameDetails: userdata }, "login sucessfull !!!")
            } else {
                return responseFile.errorResponse(res, 'Invalid otp !!!', 401);
            }
        });
    } catch (error) {
        console.log(error)
        return responseFile.errorResponse(res, 'server Error !!!', 500);
    }
};

exports.userDetails = async (req, res) => {
    try {
        let response = await userService.userDetails(req, res);
        if (response) {
            return responseFile.successResponse(res, response, "Updatedsucessful");
        }

    } catch (error) {
        console.log(error);
        return responseFile.errorResponse(res, 'Something went wrong !', 500);
    }
}

exports.userStatus = async (req, res) => {
    try {
        const email = req.body.email;

        let response = await userService.userStatus(req, res);

        if (response === 'sucess') {
            const userDetails = await user.findOne({ email })
            return responseFile.successResponse(res, "Updatedsucessful");
        }
        else if (response === 'gameOver') {
            return responseFile.errorResponse(res, "Oops..!!! game over", 500);
        } else {
            return responseFile.errorResponse(res, "updation failed", 500);
        }

    } catch (error) {
        console.log(error);
        return responseFile.errorResponse(res, 'Something went wrong !!!', 500);
    }
}

exports.getWord = async (req, res) => {
    try {
        let response = await userService.getWord(req, res);
        if (response) {
            return responseFile.successResponse(res, response);
        }

    } catch (error) {
        console.log(error);
        return responseFile.errorResponse(res, 'Something went wrong !', 500);
    }
}