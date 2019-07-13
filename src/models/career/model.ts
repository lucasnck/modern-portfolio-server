var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var schema = new Schema({
    enterprise: String,
    level: String,
    post: String,
    description: String,
    imageURL: String,
    linkURL: String,
    startDate: Date,
    city: String,
    endDate: Date,
    current: {
        type: Boolean,
        default: false
    },
    technologies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Technology'
        }
    ]
});

const model = mongoose.model("Career", schema);

export default model