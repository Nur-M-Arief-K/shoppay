import mongoose from "mongoose";
require('dotenv').config();

const connection = {};

async function connectDb() {
    if(connection.isConnected) {
        console.log("already connected to the database");
        return;
    }

    if(mongoose.connection.length > 0) {
        connection.isConnected = mongoose.connections[0].readyState;
        if(connection.isConnected === 1) {
            console.log("use previous connection to the database");
            return;
        }
        await mongoose.disconnect();
    }
    const db = await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser : true,
        useUnifiedTopology: true,
    });
    console.log("New conection to the database");
    connection.isConnected = db.connections[0].readyState;
}

async function disconnectDb() {
    if(connection.isConnected) {
        if(process.env.NODE_END === "production") {
            await mongoose.disconnect();
            connection.isConnected = false;
        } else {
            console.log("not disconnecting from the database");
        }
    }
}

const db = {connectDb, disconnectDb};
export default db;