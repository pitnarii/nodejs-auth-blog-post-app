// 🐨 Todo: Exercise #5
// สร้าง Middleware ขึ้นมา 1 อันชื่อ Function ว่า `protect`
// เพื่อเอาไว้ตรวจสอบว่า Client แนบ Token มาใน Header ของ Request หรือไม่
// โค้ดนี้อยู่ในไฟล์ server/middlewares/protect.js
import jwt from 'jsonwebtoken'

export const protect = async (req, res, next) => {
    //ตรวจ "รูปแบบ" header
  const token = req.headers.authorization
//ตรวจสอบว่า Token มีหรือไม่ และว่าเป็นรูปแบบ Bearer หรือไม่
  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({
      message: "Token has invalid format"
    })
  }
  //ตัด "Bearer " ออกจาก Token เพื่อให้เหลือแค่ Token จริง
  //ตรวจ "เนื้อหา" JWT ว่าใช้ได้จริงไหม
  const tokenWithoutBearer = token.split(" ")[1];
//ตรวจสอบว่า Token ถูกต้องหรือไม่ และว่าเป็นรูปแบบ JWT หรือไม่
  jwt.verify(tokenWithoutBearer, process.env.SECRET_KEY, (err, payload) => {
    if (err) {
      return res.status(401).json({
        message: "Token is invalid",
      });
    }
    req.user = payload;
    // จะนำข้อมูลผู้ใช้ที่แนบมากับ Token ใส่ลงไปใน Property user ของ Object req เพื่อที่จะนำไปใช้ต่อใน Controller Function ได้
    next();
    //ส่งกลับไปยัง Controller Function ที่ถูกส่งมา
  });
}