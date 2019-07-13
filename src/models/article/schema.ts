import model from './model'
// import Category from '../category/model'

export const typeDef = `
    type Article {
        _id: ID!
        title: String
        description: String
        university: String 
        imageURL: String
        linkURL: String
        location: String
        date: String
    }
`

export const query = `
    articles: [Article]
    readArticle(_id: ID): Article
`

export const mutation = `
    createArticle(name: String, description: String, imageURL: String, linkURL: String, university: String, location: String, date: String): Article
    updateArticle(_id: ID!, name: String, description: String, imageURL: String, linkURL: String, university: String, location: String, date: String): Article
    deleteArticle(_id: ID!): String
`

export const resolvers = {
    Query: {
        async articles(_, { }) {
            return await model.find({})
        },
        async readArticle(_, { name }) {
            return await model.findOne({ name: name })
        }
    },
    Mutation: {
        async createArticle(_, { name, description, imageURL, linkURL, university, location, date }, { user }) {
            if (!user) {
                throw new Error('You are not authenticated!')
            }
            const created = await model.create({
                name, description, imageURL, linkURL, university, location, date
            })
            return created
        },
        async updateArticle(_, { _id, name, description, imageURL, linkURL, university, location, date }, { user }) {
            if (!user) {
                throw new Error('You are not authenticated!')
            }
            const updated = await new Promise((resolve, reject) => {
                model.findOneAndUpdate({ _id: _id }, { name: name, description: description, imageURL: imageURL, linkURL: linkURL, university, location, date }, { omitUndefined: true, new: true }, (err, doc) => {
                    if (err) {
                        return reject(err);
                    }
                    console.log(doc)
                    resolve(doc);
                })
            })
            return updated
        },
        async deleteArticle(_, { _id }, { user }) {
            if (!user) {
                throw new Error('You are not authenticated!')
            }
            const deleted = await model.find({ _id: _id }).remove().exec();
            if (deleted)
                return _id
        },

    }
};