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


app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://form-registration-login-123.netlify.app"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());
app.use("/api/user",router);

export default app;
