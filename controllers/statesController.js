const statesData = require('../statesData.json');
const State = require('../model/States');

// helper: merge mongo funfacts into a state object
const mergeState = (stateData, mongoState) => {
    if (mongoState?.funfacts?.length > 0) {
        return { ...stateData, funfacts: mongoState.funfacts };
    }
    return stateData;
};

// GET /states/
const getAllStates = async (req, res) => {
    // grab all mongo funfacts at once
    const mongoStates = await State.find();

    let states = statesData;

    // handle ?contig query param
    const { contig } = req.query;
    if (contig === 'true') {
        states = states.filter(s => s.code !== 'AK' && s.code !== 'HI');
    } else if (contig === 'false') {
        states = states.filter(s => s.code === 'AK' || s.code === 'HI');
    }

    // merge funfacts into each state
    const result = states.map(state => {
        const mongoState = mongoStates.find(m => m.stateCode === state.code);
        return mergeState(state, mongoState);
    });

    res.json(result);
};

// GET /states/:state
const getState = async (req, res) => {
    const stateData = statesData.find(s => s.code === req.code);
    const mongoState = await State.findOne({ stateCode: req.code });
    res.json(mergeState(stateData, mongoState));
};

// GET /states/:state/funfact
const getFunFact = async (req, res) => {
    const mongoState = await State.findOne({ stateCode: req.code });

    // no funfacts found
    if (!mongoState || !mongoState.funfacts || mongoState.funfacts.length === 0) {
        const stateData = statesData.find(s => s.code === req.code);
        return res.status(404).json({ message: `No Fun Facts found for ${stateData.state}` });
    }

    // pick a random one
    const randomIndex = Math.floor(Math.random() * mongoState.funfacts.length);
    res.json({ funfact: mongoState.funfacts[randomIndex] });
};

// GET /states/:state/capital
const getCapital = (req, res) => {
    const stateData = statesData.find(s => s.code === req.code);
    res.json({ state: stateData.state, capital: stateData.capital_city });
};

// GET /states/:state/nickname
const getNickname = (req, res) => {
    const stateData = statesData.find(s => s.code === req.code);
    res.json({ state: stateData.state, nickname: stateData.nickname });
};

// GET /states/:state/population
const getPopulation = (req, res) => {
    const stateData = statesData.find(s => s.code === req.code);
    res.json({ state: stateData.state, population: stateData.population.toLocaleString('en-US') });
};

// GET /states/:state/admission
const getAdmission = (req, res) => {
    const stateData = statesData.find(s => s.code === req.code);
    res.json({ state: stateData.state, admitted: stateData.admission_date });
};

// POST /states/:state/funfact
const addFunFact = async (req, res) => {
    const { funfacts } = req.body;

    // must send funfacts array
    if (!funfacts) {
        return res.status(400).json({ message: 'State fun facts value required' });
    }
    if (!Array.isArray(funfacts)) {
        return res.status(400).json({ message: 'State fun facts value must be an array' });
    }

    // find existing or create new, then push new facts in
    const mongoState = await State.findOne({ stateCode: req.code });

    if (mongoState) {
        mongoState.funfacts.push(...funfacts);
        const result = await mongoState.save();
        return res.json(result);
    }

    // no existing doc, create one
    const result = await State.create({ stateCode: req.code, funfacts });
    res.json(result);
};

// PATCH /states/:state/funfact
const updateFunFact = async (req, res) => {
    const { index, funfact } = req.body;
    const stateData = statesData.find(s => s.code === req.code);

    // both fields required
    if (!index) {
        return res.status(400).json({ message: 'State fun fact index value required' });
    }
    if (!funfact) {
        return res.status(400).json({ message: 'State fun fact value required' });
    }

    const mongoState = await State.findOne({ stateCode: req.code });

    // no funfacts at all
    if (!mongoState || !mongoState.funfacts || mongoState.funfacts.length === 0) {
        return res.status(404).json({ message: `No Fun Facts found for ${stateData.state}` });
    }

    // adjust from 1-based to 0-based
    const adjustedIndex = index - 1;

    // index out of range
    if (adjustedIndex < 0 || adjustedIndex >= mongoState.funfacts.length) {
        return res.status(404).json({ message: `No Fun Fact found at that index for ${stateData.state}` });
    }

    mongoState.funfacts[adjustedIndex] = funfact;
    const result = await mongoState.save();
    res.json(result);
};

// DELETE /states/:state/funfact
const deleteFunFact = async (req, res) => {
    const { index } = req.body;
    const stateData = statesData.find(s => s.code === req.code);

    // index required
    if (!index) {
        return res.status(400).json({ message: 'State fun fact index value required' });
    }

    const mongoState = await State.findOne({ stateCode: req.code });

    // no funfacts at all
    if (!mongoState || !mongoState.funfacts || mongoState.funfacts.length === 0) {
        return res.status(404).json({ message: `No Fun Facts found for ${stateData.state}` });
    }

    // adjust from 1-based to 0-based
    const adjustedIndex = index - 1;

    // index out of range
    if (adjustedIndex < 0 || adjustedIndex >= mongoState.funfacts.length) {
        return res.status(404).json({ message: `No Fun Fact found at that index for ${stateData.state}` });
    }

    // splice removes 1 item at the adjusted index
    mongoState.funfacts.splice(adjustedIndex, 1);
    const result = await mongoState.save();
    res.json(result);
};

module.exports = {
    getAllStates,
    getState,
    getFunFact,
    getCapital,
    getNickname,
    getPopulation,
    getAdmission,
    addFunFact,
    updateFunFact,
    deleteFunFact
};