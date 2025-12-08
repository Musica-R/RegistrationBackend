import  express from "express";
import router from "./router/userRouter.js";
import cors from "cors";

const app = express ();

app.use(
  cors({
    origin: "https://form-registration-login-123.netlify.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.options("*", cors());

app.use(express.json());
app.use("/api/user",router);

export default app;
