import mongoose from "mongoose";
import colors from "colors";
import { exit } from "node:process"

export const conectDb = async () => { 
    try {
        const connection = await mongoose.connect(process.env.DATABASE_URL);
        const url = `${connection.connection.host}:${connection.connection.port}`;

        console.log(colors.bgGreen.bold(`MongoDB is conected in ${url}`))

    } catch (error) {
        console.log(colors.red("Error to connect to database"));
        console.log(error);
        exit(1);
    }
}