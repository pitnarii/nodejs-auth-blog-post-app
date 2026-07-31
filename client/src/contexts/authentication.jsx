import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = React.createContext();

function AuthProvider(props) {
  const [state, setState] = useState({
    loading: null,
    error: null,
    user: null,
  });
  const navigate = useNavigate();

  const login = async (data) => {
    // 🐨 Todo: Exercise #4
    //  ให้เขียน Logic ของ Function `login` ตรงนี้
    //  Function `login` ทำหน้าที่สร้าง Request ไปที่ API POST /login
    //  ที่สร้างไว้ด้านบนพร้อมกับ Body ที่กำหนดไว้ในตารางที่ออกแบบไว้
    const response = await axios.post("http://localhost:4000/auth/login", data);
    const token = response.data.token;    
    localStorage.setItem("token", token); //save token to local storage localStorage = จำว่า login อยู่ (refresh หน้าแล้วยัง login)
    const userDatafromToken = jwtDecode(token); //decode token to get user data
    //state.user = ใช้แสดงข้อมูล user ใน UI ทันทีโดยไม่ต้องเรียก API อีก
    setState({
      ...state, //เก็บค่าเดิม (loading, error)
      user: userDatafromToken, //ใส่ข้อมูล user จาก token
    });
    navigate("/"); //navigate user to home page
  };

  const register = async (data) => {
    // 🐨 Todo: Exercise #2
    //  ให้เขียน Logic ของ Function `register` ตรงนี้
    //  Function register ทำหน้าที่สร้าง Request ไปที่ API POST /register
    //  ที่สร้างไว้ด้านบนพร้อมกับ Body ที่กำหนดไว้ในตารางที่ออกแบบไว้
      await axios.post("http://localhost:4000/auth/register", data);
      navigate("/login"); //navigate user to log-in page
    
  };
// (register)สร้างฟังก์ชันนี้เพื่อให้หน้า Register สมัคร user ผ่าน API แล้ว redirect ไป login โดยไม่ต้องเขียน logic ซ้ำในหลาย component

  const logout = () => {
    // 🐨 Todo: Exercise #7
    //  ให้เขียน Logic ของ Function `logout` ตรงนี้
    //  Function logout ทำหน้าที่ในการลบ JWT Token ออกจาก Local Storage
    localStorage.removeItem("token");
    setState({
      ...state,
      user: null,
    });
  };

  const isAuthenticated = Boolean(localStorage.getItem("token"));

  return (
    <AuthContext.Provider
      value={{ state, login, logout, register, isAuthenticated }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

// this is a hook that consume AuthContext
const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
