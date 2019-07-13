import model from './model'
import * as bcryptjs from 'bcryptjs'
var jsonwebtoken = require('jsonwebtoken')

export const typeDef = `
  type User {
    _id: ID!
    name: String
    email: String
    password: String
  }
`;

export const query = `
    users: [User]
    me: User
`

export const mutation = `
    signup (name: String!, email: String!, password: String!): String
    login (email: String!, password: String!): String
`

export const resolvers = {
    Query: {
        // fetch the profile of currently authenticated user
        async me(_, args, { user }) {
            // make sure user is logged in
            if (!user) {
                throw new Error('You are not authenticated!')
            }
            // user is authenticated
            return await model.findById(user.id)
        },
        async users(_, args, { user }) {
            if (!user) {
                throw new Error('You are not authenticated!')
            }
            return await model.find({})
        }
    },

    Mutation: {

        // Handle user signup
        async signup(_, { name, email, password }, { user }) {

            if (!user) {
                throw new Error('You are not authenticated!')
            }
            
            const newUser = await model.create({
                name,
                email,
                password: await bcryptjs.hash(password, 10)
            })

            // return json web token
            return jsonwebtoken.sign(
                { id: newUser._id, email: newUser.email },
                process.env.JWT_SECRET,
                { expiresIn: '1y' }
            )
        },

        // Handles user login
        async login(_, { email, password }) {
            const user = await model.findOne({ email: email })
            console.log("user")
            console.log(email, await bcryptjs.hash(password, 10))
            console.log(user)
            if (!user) {
                throw new Error('No user with that email')
            }

            const valid = await bcryptjs.compare(password, user.password)

            if (!valid) {
                throw new Error('Incorrect password')
            }

            // return json web token
            return jsonwebtoken.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            )
        }
    }
}