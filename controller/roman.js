const helper = require('../helpers/roman')

exports.convert = async (req, res) => {

    if(!req.params.number) res.status(500).send({error : "Invalid Input"})

    let response = await helper.convert(req.params.number)

    res.send({response})
}