const responseFile = require('../utils/response');
const adminServices = require('../services/adminServices');

exports.setWord = async (req, res) => {
    try {
        const response = await adminServices.setWord(req, res);
        if (response) {
            return responseFile.successResponse(res, "word added sucesffully!!!");
        } return responseFile.errorResponse(res, 'someting went wrong', 500);

    } catch (error) {
        console.log(error);
        return responseFile.errorResponse(res, 'someting went wrong', 500);
    }
}

exports.userDetails = async (req, res) => {
    try {
        const response = await adminServices.getUserDetails(req, res);
        if (response) {
            return responseFile.successResponse(res, "list of users in given date !!!", response);
        } return responseFile.errorResponse(res, 'someting went wrong', 500);

    } catch (error) {
        console.log(error);
        return responseFile.errorResponse(res, 'someting went wrong', 500);
    }
}