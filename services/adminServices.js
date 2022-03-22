const responseFile = require('../utils/response');
const wordCollection = require('../model/word');
const user = require('../model/user');

exports.setWord = async (req, res) => {
    try {
        const { word } = req.body;
        //  mm/dd/yyyy date format
        const dateTime = new Date().toLocaleString("en-US", {timeZone:
            "Asia/Kolkata"});
        const date = dateTime.split(',')[0];
        const wordDetails = await wordCollection.findOne({ date });
        if (!wordDetails) {
            const newWord = new wordCollection({
                word,
                date
            })
            await newWord.save();
            return newWord
        } else {
            const updateWord = await wordCollection.updateOne({ date }, { word });
            return true
        }

    } catch (error) {
        console.log(error);
        return responseFile.errorResponse(res, 'something went wrong..', 500);
    }
}


exports.getUserDetails = async (req, res) => {
    try {
        const date = req.query.date;
        if (!date) {
            const userDetails = await user.find({}, { __v: 0 });
            return userDetails
        } else {
            const userDetails = await user.find({ date }, { __v: 0 });
            return userDetails
        }



    } catch (error) {
        console.log(error);
        return responseFile.errorResponse(res, 'something went wrong..', 500);
    }
}