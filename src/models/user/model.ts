var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var schema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true,
    }, 
    password: String,
});

const model = mongoose.model("User", schema);

export default model