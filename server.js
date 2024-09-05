import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch((error) => {
    console.log("Database Connection Failed !!", error);
  });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  User_ID: { type: String, required: true },
  phone_number: { type: Number, default: null },
  address: { type: String, default: null },
  birthdate: { type: Date, default: null },
  gender: { type: String, default: null },
  profile: { type: String, default: null },
});

const User_Details = mongoose.model("User_Details", UserSchema);

app.post("/api/storeUser", async (req, res) => {
  console.log("Received request:", req.body);

  const {
    name,
    email,
    User_ID,
    phone_number,
    address,
    birthdate,
    gender,
    profile,
  } = req.body;

  try {
    let existingUser = await User_Details.findOne({ email });

    if (!existingUser) {
      const newUser = new User_Details({
        name,
        email,
        User_ID,
        phone_number,
        address,
        birthdate,
        gender,
        profile,
      });
      await newUser.save();
      res.status(201).json({ message: "User saved successfully" });
    } else {
      res.status(200).json({ message: "User already exists" });
    }
  } catch (error) {
    console.error("Error storing user details:", error);
    res.status(500).json({ message: "Failed to store user details", error });
  }
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
