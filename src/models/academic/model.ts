var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var schema = new Schema({
    name: {
        type: String,
        unique: true,
    },
    description: String,
    imageURL: String,
    linkURL: String,
    school: String,
    type: {
        type: String,
        enum: ['Course', 'HighSchool', 'Undergraduate']
    },
    status: {
        type: String,
        enum: ['Finished', 'InProgress', 'FuturePlanning']
    },
    startDate: Date,
    endDate: Date,
    technologies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Technology'
        }
    ]
});

const model = mongoose.model("Academic", schema);

export default model