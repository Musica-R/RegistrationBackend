import mongoose from "mongoose";

const database_connection = async () => {

    try {
        const dts = await mongoose.connect(process.env.MONGODB_URL);
        console.log("Mongodb is connected");
        console.log("Database name :",dts.connection.name)
    }
    catch (error) {
       console.log("Mongodb is not connected",error);
       process.exit(1);
    }

}

export default database_connection;

