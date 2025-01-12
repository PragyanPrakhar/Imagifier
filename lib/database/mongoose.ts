import mongoose, { Mongoose } from "mongoose";
interface MongooseConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

const MONGODB_URL = process.env.MONGODB_URL!;
let cached: MongooseConnection = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
    if (cached.conn) {
        return cached.conn;
    }
    if (!process.env.MONGODB_URI) {
        throw new Error("Mongo DB Url is not defined");
    }
    cached.promise =
        cached.promise ||
        mongoose.connect(MONGODB_URL!, {
            dbName: "imagifier",
            bufferCommands: false,
        });
    cached.conn = await cached.promise;
    return cached.conn;
};
