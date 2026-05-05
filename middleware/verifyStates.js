const statesData = require('../statesData.json');

// pull just the codes into an array
const stateCodes = statesData.map(state => state.code);

const verifyStates = (req, res, next) => {
    // uppercase whatever comes in so ks, Ks, KS all work
    const stateCode = req.params.state.toUpperCase();

    // check if it exists in our codes array
    if (!stateCodes.includes(stateCode)) {
        return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
    }

    // attach verified code to req and move on
    req.code = stateCode;
    next();
};

module.exports = verifyStates;