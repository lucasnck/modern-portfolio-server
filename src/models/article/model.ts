var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var schema = new Schema({
    title: {
        type: String,
        unique: true,
    },
    university: String,
    description: String,
    imageURL: String,
    linkURL: String,
    location: String,
    date: Date
});

const model = mongoose.model("Article", schema);

export default model