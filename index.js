// import dotenv from "dotenv";
// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import { setServers } from "node:dns/promises";
// import userDetailsRouter from "./src/routes/userDetailsRouter.js";
// setServers(["1.1.1.1", "8.8.8.8"]);
// dotenv.config();
// const mongooseString = process.env.DATABASE_URL;
// const PORT = process.env.PORT || 3000;
// const app = express();
// app.use(cors());
// app.use(express.json());


// app.use("/api-learn/user", userDetailsRouter);



// mongoose.connect(mongooseString)
//   .then(() => {
//     console.log('Database connected successfully');
//   })
//   .catch((err) => {
//     console.log('Error received = ' + err);
//   });

// app.listen(PORT, () => {
//     console.log(`Server started on port ${PORT}`);
// })


import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { setServers } from "node:dns/promises";
import serverless from "serverless-http";

import userDetailsRouter from "./src/routes/userDetailsRouter.js";
import employeeRouter from "./src/routes/employeeRouter.js";

setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

const mongooseString = process.env.DATABASE_URL;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-learn/user", userDetailsRouter);
app.use("/api-learn/employee", employeeRouter);

// MongoDB connection
mongoose.connect(mongooseString)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log("Database connection error:", err);
  });

// Test API
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Node.js Express Lambda API is working"
  });
});

// Lambda handler
export const handler = serverless(app);
