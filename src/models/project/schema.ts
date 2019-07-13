import model from './model'
var mongoose = require('mongoose')
const TechnologyModel = mongoose.model('Technology')

export const typeDef = `
    enum ProjectStateEnum {
        completed
        incomplete
        deprecated
    }

    type Project implements GenericInformation {
        _id: ID!
        name: String!
        description: String
        imageURL: String 
        linkURL: String
        technologies: [Technology]
        state: ProjectStateEnum
    }
`

export const query = `
    projects: [Project]
    readProject(name: String): Project
`

export const mutation = `
    createProject(input: GenericInformationInput state: String technologies: [ID!]): Project
    updateProject(_id: ID! input: GenericInformationInput state: String technologies: [ID!]): Project
    addProjectTechnology(Project: ID! Technology: ID!): Project
    removeProjectTechnology(Project: ID! Technology: ID!): Project
    deleteProject(_id: ID!): String
`

export const resolvers = {
    Query: {
        async projects(_, { }) {
            return await model.find({})
        },
        async readProject(_, { name }) {
            return await model.findOne({ name: name })
        }
    },
    Mutation: {
        async createProject(_, { input, state, technologies }, { user }) {
            if (!user) {
                throw new Error('You are not authenticated!')
            }
            const created = await new Promise((resolve, reject) => {
                model.create(Object.assign({}, input, { state: state }, { technologies: technologies }), async function (err, doc) {
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
        async updateProject(_, { _id, input, state, technologies }, { user }) {
            if (!user) {
                throw new Error('You are not authenticated!')
            }
            console.log(Object.assign({}, input, { state: state }, { technologies: technologies }))
            const updated = await new Promise((resolve, reject) => {
                model.findOneAndUpdate({ _id: _id }, Object.assign({}, input, state, technologies), { omitUndefined: true, new: true }, async (err, doc) => {
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
        async addProjectTechnology(_, { Project, Technology }, { user }) {
            if (!user) {
                throw new Error('You are not authenticated!')
            }
            const updated = await new Promise((resolve, reject) => {
                model.findOne({ _id: Project }, (err, doc) => {
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
        async removeProjectTechnology(_, { Project, Technology }, { user }) {
            if (!user) {
                throw new Error('You are not authenticated!')
            }
            const updated = await new Promise((resolve, reject) => {
                model.findOne({ _id: Project }, (err, doc) => {
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
        async deleteProject(_, { _id }, { user }) {
            if (!user) {
                throw new Error('You are not authenticated!')
            }
            const deleted = await model.find({ _id: _id }).remove().exec();
            if (deleted)
                return _id
        },

    }
};