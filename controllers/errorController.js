const errorController = {}

errorController.throwInternalError = async function(req, res) {
    const err = new Error('Oops! It seems this error is from our side.');
    err.status = 500;
    throw err;
}

module.exports = errorController