import model from './model'
import { rejects } from 'assert';
import { resolve, resolveSoa } from 'dns';
import { doTypesOverlap } from 'graphql';

export const typeDef = `
    type Category {
        _id: ID!
        name: String
    }
`

export const query = `
    categories: [Category]
    readCategory(name: String): Category
`

export const mutation = `
    createCategory(name: String): Category
    updateCategory(_id: ID! name: String): Category
    deleteCategory(_id: ID!): String
`

export const resolvers = {
    Query: {
        async categories(_, { }) {
            return await model.find({})
        },
        async readCategory(_, { name }) {
            return await model.findOne({ name: name })
        }
    },
    Mutation: {
        async createCategory(_, { name }, { user }) {
            if (!user) {
                throw new Error('You are not authenticated!')
            }
            // create category
            const created = await model.create({
                name
            })
            // // add category to parent children
            // if (created) {
            //     model.findOne({ _id: parent }, (err, doc) => {
            //         if (doc) {
            //             if (doc.children) {
            //                 if (doc.children.length > 0) {
            //                     if (doc.children.indexOf(created._id) < 0) {
            //                         doc.children.push(created._id)
            //                     }
            //                 } else {
            //                     doc.children.push(created._id)
            //                 }
            //             } else {
            //                 doc.children = [created._id]
            //             }
            //             doc.save().exec()
            //         } 
            //     })
            // }
            // return created category
            return created
        },
        async updateCategory(_, { _id, name }, { user }) {
            if (!user) {
                throw new Error('You are not authenticated!')
            }
            
            // if (parent) {
            //     // add category to new parent child
            //     let category = await model.findOne({ _id: _id })
            //     let oldParentCategoryId = category.parent
            //     let parentCategory
            //     if (category) {
            //         parentCategory = await model.findOne({ _id: parent })
            //         if (parentCategory.children.length > 0) {
            //             if (parentCategory.children.indexOf(category._id) < 0) {
            //                 parentCategory.children.push(category._id)
            //             }
            //         } else {
            //             parentCategory.children.push(category._id)
            //         }
            //         parentCategory.save().exec()
            //     }

            //     if (parentCategory) {

            //         // remove category from old parent children
            //         let oldParentCategory = model.findOne({ _id: oldParentCategoryId })
            //         if (oldParentCategory.children.length > 0) {
            //             let index = oldParentCategory.children.indexOf(_id)
            //             oldParentCategory.children.splice(index, 1)
            //             oldParentCategory.save().exec()
            //         }
            //     }
            //     // change category parent to the new parent
            //     category = await model.findOneAndUpdate({ _id: _id }, { name: name })

            //     //return updated category
            //     return category
            // }

            const updated = await new Promise((resolve, reject) => {
                model.findOneAndUpdate({ _id: _id }, { name: name }, { omitUndefined: true, new: true }, async (err, doc) => {
                    if (err) {
                        return reject(err);
                    }
                    console.log(doc)
                    if (doc.children) {
                        let children = await model.find({
                            _id: {
                                $in: doc.children
                            }
                        })
                        doc.children = children
                    }
                    resolve(doc);
                })
            })
            return updated
        },
        async deleteCategory(_, { _id }, { user }) {
            if (!user) {
                throw new Error('You are not authenticated!')
            }

            // find category
            console.log("_id: ", _id)
            const category = await new Promise((resolve, reject) => {
                model.findOne({ _id: _id }, (err, doc) => {
                    if (err) {
                        reject("Category not found")
                    }
                    if (doc) {
                        console.log("category._id: ", doc._id)
                        // remove category from parent children
                        // if (doc.parent) {
                        //     const parent = model.findOne({ _id: doc.parent })
                        //     if (parent) {
                        //         if (parent.children) {
                        //             let index = parent.children.indexOf(doc._id)
                        //             if (index >= 0) {
                        //                 parent.children.splice(index, 1)
                        //                 parent.save().exec()
                        //             }
                        //         }
                        //     }
                        // }
                        // delete children categories from doc
                        // if (doc.children) {
                        //     if (doc.children.length > 0) {
                        //         doc.children.forEach(async element => {
                        //             let child = await model.find({ _id: element })
                        //             child.remove().exec();
                        //         });
                        //     }
                        // }
                        // delete category
                        model.remove({ _id: doc._id }).exec()
                    } else {
                        return reject("Category not found")
                    }
                    return resolve(doc)
                })
            })
            return _id
        },

    }
};