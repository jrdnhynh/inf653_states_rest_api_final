require('dotenv').config();
const mongoose = require('mongoose');
const State = require('./model/States');

const connectDB = async () => {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log('connected to mongodb');
};

const seedStates = [
    {
        stateCode: 'KS',
        funfacts: [
            'Kansas is the geographic center of the contiguous United States.',
            'Dodge City, Kansas is the windiest city in the United States.',
            'Kansas produces enough wheat annually to feed everyone in the world for about two weeks.',
            'The state of Kansas was named after the Kaw or Kansa Native American tribe.'
        ]
    },
    {
        stateCode: 'MO',
        funfacts: [
            'Missouri is the only state that has two Federal Reserve Banks.',
            'The ice cream cone was invented in St. Louis at the 1904 World Fair.',
            'Missouri is known as the Cave State with over 6,000 caves.',
            'Mark Twain was born in Missouri.'
        ]
    },
    {
        stateCode: 'OK',
        funfacts: [
            'Oklahoma has more man-made lakes than any other state with over 200.',
            'The shopping cart was invented in Oklahoma City in 1937.',
            'Oklahoma is one of only two states that have a state meal.',
            'Oklahoma has the most tornadoes per square mile of any state.'
        ]
    },
    {
        stateCode: 'NE',
        funfacts: [
            'Nebraska has more miles of river than any other state.',
            'Kool-Aid was invented in Hastings, Nebraska in 1927.',
            'Nebraska is the only state with a unicameral legislature.',
            'Arbor Day was founded in Nebraska City, Nebraska in 1872.'
        ]
    },
    {
        stateCode: 'CO',
        funfacts: [
            'Colorado is the only state to turn down the Olympics.',
            'Colorado has the highest average elevation of any state at 6,800 feet.',
            'The cheeseburger was allegedly invented in Denver, Colorado in 1935.',
            'Colorado is home to the largest flat-top mountain in the world, Grand Mesa.'
        ]
    },
    {
        // ri needs empty array for /states/RI direct request
        stateCode: 'RI',
        funfacts: []
    }
];

const seed = async () => {
    await connectDB();

    // wipe everything
    await State.deleteMany({});
    console.log('cleared all data');

    // insert only what we need
    await State.insertMany(seedStates);
    console.log('seeded successfully');

    process.exit(0);
};

seed();