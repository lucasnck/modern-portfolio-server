import { Routes } from "./routes";
import { Database } from "./database";
import { MiddlewareGraphQL as Middleware } from "./middleware"
import * as express from "express";
import * as bodyParser from "body-parser";

class App {

    public app: express.Application
    public routes: Routes = new Routes()
    public database: Database = new Database()
    public middleware: Middleware

    constructor() {
        this.app = express();
        this.config();
        this.routes.routes(this.app);
        this.middleware = new Middleware(this.app)
    }

    private config(): void {
        // support application/json type post data
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));

        const jwt = require('express-jwt')
        // auth middleware
        const auth = jwt({
            secret: process.env.JWT_SECRET,
            credentialsRequired: false
        })
        this.app.use("/graphql", auth)
    }

}

export default new App().app;