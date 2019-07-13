var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var schema = new Schema({
    name: {
        type: String,
        unique: true,
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
});

const model = mongoose.model("Category", schema);

export default model