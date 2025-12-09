import  express from "express";
import router from "./router/userRouter.js";
import cors from "cors";

const app = express ();

app.use(cors({
  origin: [
    "https://form-registration-login-123.netlify.app",
    "http://localhost:3000"
  ]
}));
app.get("/", (req, res) => {
  res.send("Backend server is running");
});

app.use(express.json());
app.use("/api/user",router);

export default app;
