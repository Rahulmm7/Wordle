const mailer = require('../utils/email');
const otp = require('../utils/otp');
const responseFile = require('../utils/response')

exports.signUpStatus = (req, res) => {
    try {
        const email = req.body.email;
        const message = `Your OTP for verification is ${otp}`;
        mailer(email, message);
        return otp;

    } catch (error) {
        console.log(error);
        return responseFile.errorResponse(res, 'Something went wrong !', 500);
    }
}