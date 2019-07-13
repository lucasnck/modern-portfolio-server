var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var schema = new Schema({
    name: {
        type: String,
        unique: true,
    },
    level: {
        type: String,
        enum: ['Native', 'Intermediate', 'Fluent']
    }
});

const model = mongoose.model("Language", schema);

export default model