const user = require('../model/user');
const wordCollection = require('../model/word');
const userService = require('../services/userServices');
const responseFile = require('../utils/response');

exports.signupStatus = async (req, res) => {
    try {
        const email = req.body.email;
        // const userExist = await user.findOne({ email });
        // if (userExist) { return responseFile.errorResponse(res, 'User Already Exist', 403); }

        let response = await userService.signUpStatus(req, res);
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


exports.userStatus = async (req, res) => {
    try {
        const email = req.body.email;

        let response = await userService.userStatus(req, res);
        if (response) {
            return responseFile.successResponse(res, "Updatedsucessful");
        }

    } catch (error) {
        console.log(error);
        return responseFile.errorResponse(res, 'Something went wrong !', 500);
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