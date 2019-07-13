import model from './model'

export const typeDef = `
    type Skill {
        _id: ID!
        description: String
        level: String
        technology: Technology
    }
`

export const query = `
    skills: [Skill]
    readSkill(name: String!): Skill
`

export const mutation = `
    createSkill(name: String, description: String, level: String, technology: ID): Skill
    updateSkill(_id: ID!, name: String, description: String, level: String, technology: ID): Skill
    deleteSkill(_id: ID!): String
`

export const resolvers = {
    Query: {
        async skills(_, { }) {
            return await model.find({})
        },
        async readSkill(_, { name }) {
            return await model.findOne({ name: name })
        }
    },
    Mutation: {
        async createSkill(_, { description, level, technology }, { user }) {
            if (!user) {
                throw new Error('You are not authenticated!')
            }
            const created = await model.create({
                description, level, technology: technology
            })
            return created
        },
        async updateSkill(_, { _id, description, level, technology  }, { user }) {
            if (!user) {
                throw new Error('You are not authenticated!')
            }
            const updated = await new Promise((resolve, reject) => {
                model.findOneAndUpdate({ _id: _id }, { description: description, level: level, technology: technology }, { omitUndefined: true, new: true }, (err, doc) => {
                    if (err) {
                        return reject(err);
                    }
                    console.log(doc)
                    resolve(doc);
                })
            })
            return updated
        },
        async deleteSkill(_, { _id }, { user }) {
            if (!user) {
                throw new Error('You are not authenticated!')
            }
            const deleted = await model.find({ _id: _id }).remove().exec();
            if (deleted)
                return _id
        }

    }
};