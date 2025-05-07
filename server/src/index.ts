import express, { Express } from "express";
import mongoose from "mongoose";
import financialRcordRouter from "./routes/financial-records";
import cors from "cors";
 
const app: Express = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
const mongoURL: string = "mongodb+srv://hanasamoh948:eGkT8Ez6Z7bBzvTT@personalfinancialtracke.x2vfvao.mongodb.net/";

mongoose
  .connect(mongoURL)
  .then(() => console.log("CONNECTED TO MONGODB!"))
  .catch((err) => console.error("Failed to Connect to MongoDB", err));

app.use("/financial-records", financialRcordRouter)

app.listen(port, () => {
  console.log(`Server Running on Port ${port}`);
});
