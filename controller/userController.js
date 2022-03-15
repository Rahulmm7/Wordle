const userService = require('../services/userServices');
const responseFile = require('../utils/response');

exports.signupStatus = async (req, res) => {
    try {
        let response = await userService.signUpStatus(req, res);
        if (response) {
            return responseFile.successResponse(res, response);
        }

    } catch (error) {
        console.log(error);
        return responseFile.errorResponse(res, 'Something went wrong !', 500);

    }

}