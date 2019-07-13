import model from './model'
import categoryModel from '../category/model'
// import Category from '../category/model'

export const typeDef = `
    type Technology implements GenericInformation {
        _id: ID!
        name: String!
        description: String
        imageURL: String 
        linkURL: String 
        categories: [Category]
    }
`

export const query = `
    technologies: [Technology]
    readTechnology(name: String): Technology
`

export const mutation = `
    createTechnology(input: GenericInformationInput, categories: [ID!]): Technology
    updateTechnology(_id: ID!, input: GenericInformationInput, categories: [ID!]): Technology
    addTechnologyToCategory(technology: ID! category: ID!): Technology
    removeTechnologyFromCategory(technology: ID! category: ID!): Technology
    deleteTechnology(_id: ID!): String
`

export const resolvers = {
    Query: {
        async technologies(_, { }) {
            return await model.find({})
        },
        async readTechnology(_, { name }) {
            return await model.findOne({ name: name })
        }
    },
    Mutation: {
        async createTechnology(_, { input, categories }, { user }) {
            if (!user) {
                throw new Error('You are not authenticated!')
            }
            const created = await new Promise((resolve, reject) => {
                model.create(Object.assign({}, input, { categories: categories }), async function(err, doc) {
                    if(err) {
                        return reject(err)
                    }
                    if(doc.categories) {
                        let children = await categoryModel.find({
                            _id: {
                                $in: doc.categories
                            }
                        })
                        doc.categories = children
                    }
                    return resolve(doc)
                })
            })
            return created
        },
        async updateTechnology(_, { _id, input, categories }, { user }) {
            if (!user) {
                throw new Error('You are not authenticated!')
            }
            console.log(Object.assign({}, input, { categories: categories }))
            const updated = await new Promise((resolve, reject) => {
                model.findOneAndUpdate({ _id: _id }, Object.assign({}, input, categories), { omitUndefined: true, new: true }, async (err, doc) => {
                    if (err) {
                        return reject(err);
                    }
                    if (doc == null) {
                        return reject(err);
                    }
                    console.log("doc")
                    console.log(doc)
                    if (doc.categories) {
                        let children = await categoryModel.find({
                            _id: {
                                $in: doc.categories
                            }
                        })
                        doc.categories = children
                    }
                    return resolve(doc);
                })
            })
            return updated
        },
        async addTechnologyToCategory(_, { technology, category }, { user }) {
            if (!user) {
                throw new Error('You are not authenticated!')
            }
            const updated = await new Promise((resolve, reject) => {
                model.findOne({ _id: technology }, (err, doc) => {
                    if (err) {
                        return reject(err);
                    }
                    if (doc.categories.length > 0) {
                        console.log("doc.childrens.indexOf(children): " + doc.categories.indexOf(category))
                        if (doc.categories.indexOf(category) < 0) {
                            doc.categories.push(category)
                        }
                    } else {
                        doc.categories.push(category)
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
        async removeTechnologyFromCategory(_, { technology, category }, { user }) {
            if (!user) {
                throw new Error('You are not authenticated!')
            }
            const updated = await new Promise((resolve, reject) => {
                model.findOne({ _id: technology }, (err, doc) => {
                    if (err) {
                        return reject(err);
                    }
                    let index = doc.categories.findIndex(function (element) {
                        return element == category;
                    });
                    console.log(index)
                    if (index >= 0) {
                        doc.categories.splice(index, 1)
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
        async deleteTechnology(_, { _id }, { user }) {
            if (!user) {
                throw new Error('You are not authenticated!')
            }
            const deleted = await model.find({ _id: _id }).remove().exec();
            if (deleted)
                return _id
        },

    }
};