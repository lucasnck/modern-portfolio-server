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
    categories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
        }
    ]
});

const model = mongoose.model("Technology", schema);

export default model