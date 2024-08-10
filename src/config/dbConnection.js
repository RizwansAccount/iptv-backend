import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connection = mongoose.connection;
        
        connection.once("connected", () => console.log("Database Connected"));
        connection.once("error", () => console.log("Database Connection Failed ~"));

        await mongoose.connect(`${process.env.MONGO_URI}iptv-backend`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

    } catch (error) {
        console.log(error);
    }
}

export default connectDB;