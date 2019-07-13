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
    technologies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Technology'
        }
    ],
    state: String,
    date: Date, 
});

const model = mongoose.model("Project", schema);

export default model