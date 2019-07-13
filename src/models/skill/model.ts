var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var schema = new Schema({
    description: String,
    level: String,
    technology: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Technology'
    }
});

const model = mongoose.model("Skill", schema);

export default model