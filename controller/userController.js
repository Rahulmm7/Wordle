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
    try {
        const userdata = await user.findOne({ email });
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
                return responseFile.successResponse(res, token, "token")
            } else {
                return responseFile.errorResponse(res, 'Invalid otp', 401);
            }
        });
    } catch (error) {
        console.log(error)
        return responseFile.errorResponse(res, 'server Error', 500);
    }
};

exports.gameAttempt = async (req, res) => {
    try {
        let response = await userService.gameAttempt(req, res);
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
        if (response) {
            return responseFile.successResponse(res, "Updatedsucessful");
        }
        else {
            return responseFile.errorResponse(res, "Oops..!!! game over", 500);
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