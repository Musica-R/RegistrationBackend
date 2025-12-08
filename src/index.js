import dotenv from "dotenv";
import database_connection from "./config/database.js";
import app from "./app.js";

dotenv.config({path:'./.env'});
// console.log("EMAIL_USER =", process.env.EMAIL_USER);
// console.log("EMAIL_PASS =", process.env.EMAIL_PASS);

const startServer = async () => {

    try {
      await  database_connection();
       
        app.listen(process.env.PORT || 8000);
        console.log("Port connection", process.env.PORT);
    }
    catch (error) {
        console.log("Mongodb connection is failed", error)
    }

}

startServer();