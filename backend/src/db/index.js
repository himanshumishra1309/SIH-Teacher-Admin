import mongoose from 'mongoose'
import { connectDBname } from '../constant.js'

const connectDB = async () =>{
    try {
        const connectInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${connectDBname}`);
        console.log(`MongoDB connected !! DB HOST: ${connectInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection error: ", error);
        process.exit(1)
    }
}

export default connectDB;