import * as mongoose from 'mongoose';

export class Database {

    public mongoDB: string = `${process.env.DATABASE_URI}`;

    constructor() {
        this.config()
    }
  
    private config(): void {
        mongoose.connect(this.mongoDB, { useNewUrlParser: true })
        let db = mongoose.connection
        db.on('connected', console.error.bind(console, 'MongoDB connected'))
        db.on('error', console.error.bind(console, 'MongoDB connection error:'))
    }

}