import axios from "axios";
//Interceptor  ตัวดักที่ทำงานอัตโนมัติก่อนส่ง request หรือหลังได้ response เพื่อไม่ต้องเขียน logic ซ้ำในทุก API call
function jwtInterceptor() {
  axios.interceptors.request.use((req) => { 
    //บอก axios ว่า ก่อนส่ง request ทุกครั้ง ให้รัน callback นี้ก่อน
    //(req) — object ของ request ที่กำลังจะส่ง (URL, method, headers, body)
    // 🐨 Todo: Exercise #6
    //  ให้เขียน Logic ในการแนบ Token เข้าไปใน Header ของ Request
    // เมื่อมีการส่ง Request จาก Client ไปหา Server
    // ภายใน Callback Function axios.interceptors.request.use
    const hasToken = Boolean(localStorage.getItem("token")); 
    //อ่าน token จาก localStorage (เก็บตอน login สำเร็จ)
    if (hasToken) {
      //ถ้ามี token แล้ว ให้เพิ่ม Authorization Header เข้าไปใน request
      req.headers = {
        ...req.headers,
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    }
    return req; //ส่ง request กลับไปยัง API ที่ถูกส่งมา
  });

  axios.interceptors.response.use(
    (req) => {
      return req;
    },
    (error) => {
      // 🐨 Todo: Exercise #6
      //  ให้เขียน Logic ในการรองรับเมื่อ Server ได้ Response กลับมาเป็น Error
      // โดยการ Redirect ผู้ใช้งานไปที่หน้า Login และลบ Token ออกจาก Local Storage
      // ภายใน Error Callback Function ของ axios.interceptors.response.use
      if (
        error.response.status === 401 &&
        error.response.statusText === "Unauthorized"
      ) {
        window.localStorage.removeItem("token");
        window.location.replace("/");
        //ลบ Token ออกจาก Local Storage และ Redirect ไปที่หน้า Login ด้วย Built-in Function 
    }
      //ส่ง error กลับไปยัง API ที่ถูกส่งมา
      return Promise.reject(error);
    }
  );
}

export default jwtInterceptor;
