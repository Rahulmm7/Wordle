const responseFile = require('../utils/response');
const wordCollection = require('../model/word');
const user = require('../model/user');

exports.setWord = async (req, res) => {
    try {
        const { word, day } = req.body;
        const newWord = new wordCollection({
            word,
            day
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
        const day = req.body.day;
        if (!day) {
            const userDetails = await user.find({}, { __v: 0 });
            return userDetails
        } else {
            const userDetails = await user.find({ day }, { __v: 0 });
            return userDetails
        }



    } catch (error) {
        console.log(error);
        return responseFile.errorResponse(res, 'something went wrong..', 500);
    }
}