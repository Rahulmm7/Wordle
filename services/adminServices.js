const responseFile = require('../utils/response');
const wordCollection = require('../model/word');
const user = require('../model/user');

exports.setWord = async (req, res) => {
    try {
        const { word, date } = req.body;
        const newWord = new wordCollection({
            word,
            date
        })
        await newWord.save();
        return newWord
    } catch (error) {
        console.log(error);
        return responseFile.errorResponse(res, 'something went wrong..', 500);
    }
}


exports.getUserDetails = async (req, res) => {
    try {
        const date = req.body.date;
        if (!date) {
            const userDetails = await user.find({}, { __v: 0 });
            return userDetails
        } else {
            const userDetails = await user.find({ date: date }, { __v: 0 });
            return userDetails
        }



    } catch (error) {
        console.log(error);
        return responseFile.errorResponse(res, 'something went wrong..', 500);
    }
}