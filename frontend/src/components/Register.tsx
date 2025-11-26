/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import React from "react";
import { useUserStore } from "../store/userStore";
import { useEffect } from "react";

function Register() {

  const { register, isAuthenticated } = useUserStore();
  const [username, setUsername] = React.useState("");
  const [fname, setFname] = React.useState("");
  const [lname, setLname] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [errorMessage, setErrorMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [require, setRequire] = React.useState(false)

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setErrorMessage("");
  setLoading(true);

  if (!username || !password || !email || !fname || !lname) {
    setErrorMessage("กรุณากรอกข้อมูลให้ครบถ้วน");
    setRequire(true);
    setLoading(false);
    return;
  }

  if (/\s/.test(username)) {
    setErrorMessage("ชื่อผู้ใช้ห้ามมีช่องว่าง");
    setLoading(false);
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setErrorMessage("รูปแบบอีเมลไม่ถูกต้อง");
    setLoading(false);
    return;
  }

  if (!/^[ก-๙A-Za-z]+$/.test(fname) || !/^[ก-๙A-Za-z]+$/.test(lname)) {
    setErrorMessage("ชื่อจริงและนามสกุลต้องเป็นตัวอักษรเท่านั้น");
    setLoading(false);
    return;
  }

  if (password.length < 6) {
    setErrorMessage("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
    setLoading(false);
    return;
  }

    if (username === "admin") {
    setErrorMessage("ชื่อผู้ใข้นี้ถูกจำกัดสิทธิ์ในการใช้งาน");
    setLoading(false);
    return;
  }

  try {
    const succes = await register(username, fname, lname, email, password);
    if (!succes) {
      setErrorMessage("ชื่อผู้ใช้นี้ถูกใช้ไปแล้ว");
      setLoading(false);
      setRequire(false);
      return;
    }

    if (succes) window.location.replace("/");
  } catch (error: any) {
    console.error("Register failed:", error);

    if (error.response?.data?.error) {
      setErrorMessage(error.response.data.error);
    } else if (isAuthenticated) {
      setErrorMessage("คุณได้เข้าสู่ระบบแล้ว");
    } else {
      setErrorMessage("การลงทะเบียนล้มเหลว กรุณาลองใหม่");
    }
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  window.scrollTo(0, 0);
}, []);

  return (
    <>
      <div className="p-10 flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="mx-auto min-w-1/4 mt-20 border border-gray-300 shadow rounded-2xl p-6 pb-10 flex flex-col justify-center gap-4 w-full max-w-sm bg-white"
        >
          <p className="text-2xl font-bold flex justify-center mb-2 text-emerald-700">REGISTER</p>

          <div className="flex flex-col gap-1">
            <div className="flex flex-row justify-start"> 
            {require && !lname && <p className="text-red-500 mr-1 items-baseline">*</p>}
            <label className="text-gray-700">Username:</label>
            </div>

            <input
              className="input input-bordered w-full border border-gray-300 shadow p-2 rounded-lg outline-0 "
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

          </div>

          <div className="flex flex-col gap-1">
            <div className="flex flex-row justify-start"> 
            {require && !lname && <p className="text-red-500 mr-1 items-baseline">*</p>}
            <label className="text-gray-700">ชื่อจริง:</label>
            </div>
            <input
              className="input input-bordered w-full border border-gray-300 shadow p-2 rounded-lg outline-0 "
              type="text"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
            />
          </div>

        <div className="flex flex-col gap-1">
            <div className="flex flex-row justify-start"> 
            {require && !lname && <p className="text-red-500 mr-1 items-baseline">*</p>}
            <label className="text-gray-700">นามสกุล:</label>
            </div>
            <input
              className="input input-bordered w-full border border-gray-300 shadow p-2 rounded-lg outline-0 "
              type="text"
              value={lname}
              onChange={(e) => setLname(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex flex-row justify-start"> 
            {require && !lname && <p className="text-red-500 mr-1 items-baseline">*</p>}

            <label className="text-gray-700">Email:</label>            
            </div>
            <input
              className="input input-bordered w-full border border-gray-300 shadow p-2 rounded-lg outline-0 "
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex flex-row justify-start"> 
            {require && !lname && <p className="text-red-500 mr-1 items-baseline">*</p>}
            <label className="text-gray-700">Password:</label>
            </div>
            <input
              className="input input-bordered w-full border border-gray-300 shadow p-2 rounded-lg outline-0 "
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>          

          {errorMessage && (
            <p className="text-red-500 text-sm text-center mt-2">
              {errorMessage}
            </p>
          )}

          <button
            className={`rounded-lg  shadow btn bg-emerald-500 hover:bg-emerald-700 text-white w-full mt-4 cursor-pointer p-2 ${
              loading ? "btn-disabled opacity-60" : ""
            }`}
            type="submit"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "Register"}
          </button>

          <Link
            to="/user/login"
            className="flex justify-center text-blue-600 hover:underline mt-2"
          >
            มีบัญชีอยู่แล้ว?
          </Link>
        </form>
      </div>
    </>
  );
}

export default Register;
