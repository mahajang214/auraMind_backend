const { configDotenv } = require("dotenv");
configDotenv();

const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const passportSetup = require("../Config/passportSetup.js");
const authRoutes = require("../Routes/authRoutes.js");
const connectDB = require("../Database/ConnectDB.js");
const featuresRoutes = require("../Routes/features.routes.js");
const userRoutes = require("../Routes/user.routes.js");
// connect to database
connectDB();

// server app
const webApp = express();
webApp
  .use(express.json()).use(express.urlencoded({ extended: true })).use(cookieParser());

// Enable CORS
webApp.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mahajang214.github.io",
      "https://mahajang214.github.io/auraMind_frontend",
      "https://auramind-backend.onrender.com"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS","PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);




// routes
// webApp.use('/api/testing', (req, res) => {
//     res.send('Connected to /api/testing');
//     console.log('Connected to /api/testing');
// });
// webApp.use("/",(req,res)=>{
//   res.send("Welcome to AuraMind");
// })
webApp.use('/api/auth', authRoutes)
webApp.use('/api/features', featuresRoutes) 
webApp.use('/api/user', userRoutes)




module.exports = webApp;
