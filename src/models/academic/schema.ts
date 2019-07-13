import model from './model'
// import Category from '../category/model'

export const typeDef = `

    enum AcademicType {
        Course
        HightSchool
        Undergraduate
    }

    enum AcademicStatus {
        Finished
        InProgress
        FuturePlaning
    }

    type Academic {
        _id: ID!
        type: String
        description: String
        imageURL: String
        linkURL: String
        school: String
        type: AcademicType
        status: AcademicStatus
        startDate: String
        endDate: String
        technologies: [Technology]
    }
`

export const query = `
    academies: [Academic]
    readAcademic(_id: ID): Academic
`

export const mutation = `
    createAcademic(name: String, type: String, description: String, imageURL: String, linkURL: String, school: String, type: AcademicType, status: AcademicStatus, startDate: String, endDate: String, technologies: [ID!]): Academic
    updateAcademic(_id: ID!, name: String, description: String, imageURL: String, linkURL: String, school: String, type: AcademicType, status: AcademicStatus, startDate: String, endDate: String, technologies: [ID!]): Academic
    deleteAcademic(_id: ID!): String
`

export const resolvers = {
    Query: {
        async academies(_, { }) {
            return await model.find({})
        },
        async readAcademic(_, { name }) {
            return await model.findOne({ name: name })
        }
    },
    Mutation: {
        async createAcademic(_, { name, description, imageURL, linkURL, school, type, status, startDate, endDate, technologies}, { user }) {
            if (!user) {
                throw new Error('You are not authenticated!')
            }
            const created = await model.create({
                name, description, imageURL, linkURL, school, type, status, startDate, endDate, technologies
            })
            return created
        },
        async updateAcademic(_, { _id, name, description, imageURL, linkURL, school, type, status, startDate, endDate, technologies }, { user }) {
            if (!user) {
                throw new Error('You are not authenticated!')
            }
            const updated = await new Promise((resolve, reject) => {
                model.findOneAndUpdate({ _id: _id }, { name, description, imageURL, linkURL, school, type, status, startDate, endDate, technologies }, { omitUndefined: true, new: true }, (err, doc) => {
                    if (err) {
                        return reject(err);
                    }
                    console.log(doc)
                    resolve(doc);
                })
            })
            return updated
        },
        async deleteAcademic(_, { _id }, { user }) {
            if (!user) {
                throw new Error('You are not authenticated!')
            }
            const deleted = await model.find({ _id: _id }).remove().exec();
            if (deleted)
                return _id
        },

    }
};