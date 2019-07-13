import model from './model'
var mongoose = require('mongoose')
const TechnologyModel = mongoose.model('Technology')

export const typeDef = `
    type Career {
        _id: ID!
        description: String
        imageURL: String 
        linkURL: String
        enterprise: String!
        post: String
        level: String
        city: String
        current: Boolean
        startDate: String
        endDate: String
        technologies: [Technology]
    }
`

export const query = `
    careers: [Career]
    readCareer(name: String!): Career
`

export const mutation = `
    createCareer(enterprise: String description: String imageURL: String linkURL: String post: String level: String city: String current: Boolean startDate: String endDate: String technologies: [ID!]): Career
    updateCareer(_id: ID! enterprise: String description: String imageURL: String linkURL: String post: String level: String city: String current: Boolean startDate: String endDate: String technologies: [ID!]): Career
    addCareerTechnology(Career: ID! Technology: ID!): Career
    removeCareerTechnology(Career: ID! Technology: ID!): Career
    deleteCareer(_id: ID!): String
`

export const resolvers = {
    Query: {
        async careers(_, { }) {
            return await model.find({})
        },
        async readCareer(_, { name }) {
            return await model.findOne({ name: name })
        }
    },
    Mutation: {
        async createCareer(_, { enterprise, description, imageURL, linkURL, post, level, city, current, startDate, endDate, technologies }, { user }) {
            if (!user) {
                throw new Error('You are not authenticated!')
            }
            const created = await new Promise((resolve, reject) => {
                model.create({ enterprise, description, imageURL, linkURL, post, level, city, current, startDate, endDate, technologies }, async function (err, doc) {
                    if (err) {
                        return reject(err)
                    }
                    if (doc.technologies) {
                        let children = await TechnologyModel.find({
                            _id: {
                                $in: doc.technologies
                            }
                        })
                        doc.technologies = children
                    }
                    return resolve(doc)
                })
            })
            return created
        },
        async updateCareer(_, { _id, enterprise, description, imageURL, linkURL, post, level, city, current, startDate, endDate, technologies }, { user }) {
            if (!user) {
                throw new Error('You are not authenticated!')
            }
            const updated = await new Promise((resolve, reject) => {
                model.findOneAndUpdate({ _id: _id }, { enterprise, description, imageURL, linkURL, post, level, city, current, startDate, endDate, technologies }, { omitUndefined: true, new: true }, async (err, doc) => {
                    if (err) {
                        return reject(err);
                    }
                    if (doc == null) {
                        return reject(err);
                    }
                    console.log("doc")
                    console.log(doc)
                    if (doc.technologies) {
                        let children = await TechnologyModel.find({
                            _id: {
                                $in: doc.technologies
                            }
                        })
                        doc.technologies = children
                    }
                    return resolve(doc);
                })
            })
            return updated
        },
        async addCareerTechnology(_, { Career, Technology }, { user }) {
            if (!user) {
                throw new Error('You are not authenticated!')
            }
            const updated = await new Promise((resolve, reject) => {
                model.findOne({ _id: Career }, (err, doc) => {
                    if (err) {
                        return reject(err);
                    }
                    if (doc.technologies.length > 0) {
                        console.log("doc.childrens.indexOf(children): " + doc.technologies.indexOf(Technology))
                        if (doc.technologies.indexOf(Technology) < 0) {
                            doc.technologies.push(Technology)
                        }
                    } else {
                        doc.technologies.push(Technology)
                    }
                    doc.save(function (err) {
                        if (err) {
                            return reject(err);
                        }
                        resolve(doc)
                    })
                })
                return updated
            })
        },
        async removeCareerTechnology(_, { Career, Technology }, { user }) {
            if (!user) {
                throw new Error('You are not authenticated!')
            }
            const updated = await new Promise((resolve, reject) => {
                model.findOne({ _id: Career }, (err, doc) => {
                    if (err) {
                        return reject(err);
                    }
                    let index = doc.technologies.findIndex(function (element) {
                        return element == Technology;
                    });
                    console.log(index)
                    if (index >= 0) {
                        doc.technologies.splice(index, 1)
                    }
                    doc.save(function (err) {
                        if (err) {
                            return reject(err);
                        }
                        resolve(doc)
                    })
                })
            })
            return updated
        },
        async deleteCareer(_, { _id }, { user }) {
            if (!user) {
                throw new Error('You are not authenticated!')
            }
            const deleted = await model.find({ _id: _id }).remove().exec();
            if (deleted)
                return _id
        },

    }
};