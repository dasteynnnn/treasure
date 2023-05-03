const helper = require('../helpers/credit')

exports.cardRepayment = async (req, res) => {
    let response = await helper.cardRepayment(req.body);
    res.send(response)
}