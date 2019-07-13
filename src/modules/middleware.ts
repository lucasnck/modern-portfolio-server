import * as express from "express"
import * as apolloServer from 'apollo-server-express'
import schemas from './schemas'
const jwt = require('jsonwebtoken')

export class MiddlewareGraphQL {

    public app: express.Application;

    constructor(app) {
        this.app = app
        this.config()
    }

    public getUser = token => {
        try {
            if (token) {
                console.log(process.env.JWT_SECRET)
                return jwt.verify(token, process.env.JWT_SECRET)
            }
            return null
        } catch (err) {
            return null
        }
    }

    public config() {
        const server = new apolloServer.ApolloServer({
            schema: schemas,
            context: ({ req }) => {
                const tokenWithBearer = req.headers.authorization || ''
                const token = tokenWithBearer.split(' ')[1]
                const user = this.getUser(token);
                return { user }
            },
            playground: true,
        })
        server.applyMiddleware({ app: this.app, path: '/graphql' });
        server.applyMiddleware({ app: this.app, path: '/api' });
        console.log(`graphql server: ${server.graphqlPath}`)
    }
}