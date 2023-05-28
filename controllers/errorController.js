const errorController = {}

errorController.throwInternalError = async function(req, res) {
    throw new Error('Oops! It seems this error is from our side.')
}

module.exports = errorController