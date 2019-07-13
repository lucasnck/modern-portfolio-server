import model from './model'
// import Category from '../category/model'

export const typeDef = `
    interface GenericInformation {
        _id: ID!
        name: String
        description: String
        imageURL: String 
        linkURL: String
    }
    input GenericInformationInput {
        name: String
        description: String
        imageURL: String 
        linkURL: String
    }

`