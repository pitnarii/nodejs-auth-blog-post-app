import { Router } from "express";
import { db } from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const authRouter = Router();

// 🐨 Todo: Exercise #1
// ให้สร้าง API เพื่อเอาไว้ Register ตัว User แล้วเก็บข้อมูลไว้ใน Database ตามตารางที่ออกแบบไว้
//สร้่างเสร็จให้ importauthRouter และ app.use()ใน app.js
authRouter.post("/register", async (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };
  const salt = await bcrypt.genSalt(10);
  //set user pwd to hashed pwd(encrypted)
  user.password = await bcrypt.hash(user.password, salt);
  const result = await db.collection("users");
  //insert user to database
  await result.insertOne(user);
  return res.json({
    message: "User has been created successfully",
  });
});

// 🐨 Todo: Exercise #3
// ให้สร้าง API เพื่อเอาไว้ Login ตัว User ตามตารางที่ออกแบบไว้
authRouter.post("/login", async (req, res) => {
  const user = await db
    .collection("users")
    .findOne({ username: req.body.username });
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password,
  );
  //compare password with hashed password
  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid password",
    });
  }
  //generate token
  const token = jwt.sign(
    { id: user._id, firstName: user.firstName, lastName: user.lastName }, //ข้อมูลใน token
    process.env.SECRET_KEY, //secret key
    { expiresIn: "900000" }, //ระยะเวลาในการลบ token 15 นาที 900k millisec
  );
  return res.json({
    message: "login successfully",
    token: token, //varibale token
  });
});

export default authRouter;
