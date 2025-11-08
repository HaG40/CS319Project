/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import React from "react";
import { useUserStore } from "../store/userStore";

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
      setErrorMessage("กรุณากรอกทั้งข้อมูลให้ครบถ้วน");
      setRequire(true)
      setLoading(false);
      return;
    } 

    try {
      const succes = await register(username,fname,lname,email, password);
      if (!succes) {
        setErrorMessage("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
        setLoading(false);
        setRequire(false)
        return;
      }

      if(succes) window.location.replace("/");

    } catch (error: any) {
      console.error("Login failed:", error);

      if (error.response?.data?.error) {
        setErrorMessage(error.response.data.error);
      }else if (isAuthenticated) {
        setErrorMessage("คุณได้เข้าสู่ระบบแล้ว");

      } else {
        setErrorMessage("เข้าสู่ระบบล้มเหลว กรุณาลองใหม่");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-10 flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-20 border border-gray-300 shadow rounded-2xl p-6 pb-10 flex flex-col justify-center gap-4 w-full max-w-sm"
        >
          <p className="text-2xl font-bold flex justify-center mb-2">Register</p>

          <div className="flex flex-col gap-1">
            <div className="flex flex-row justify-start"> 
            {require && !lname && <p className="text-red-500 mr-1 items-baseline">*</p>}
            <label className="text-gray-700">Username</label>
            </div>

            <input
              className="input input-bordered w-full border border-gray-300 shadow p-1"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

          </div>

          <div className="flex flex-col gap-1">
            <div className="flex flex-row justify-start"> 
            {require && !lname && <p className="text-red-500 mr-1 items-baseline">*</p>}
            <label className="text-gray-700">ชื่อจริง</label>
            </div>
            <input
              className="input input-bordered w-full border border-gray-300 shadow p-1"
              type="text"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
            />
          </div>

        <div className="flex flex-col gap-1">
            <div className="flex flex-row justify-start"> 
            {require && !lname && <p className="text-red-500 mr-1 items-baseline">*</p>}
            <label className="text-gray-700">นามสกุล</label>
            </div>
            <input
              className="input input-bordered w-full border border-gray-300 shadow p-1"
              type="text"
              value={lname}
              onChange={(e) => setLname(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex flex-row justify-start"> 
            {require && !lname && <p className="text-red-500 mr-1 items-baseline">*</p>}

            <label className="text-gray-700">Email</label>            
            </div>
            <input
              className="input input-bordered w-full border border-gray-300 shadow p-1"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex flex-row justify-start"> 
            {require && !lname && <p className="text-red-500 mr-1 items-baseline">*</p>}
            <label className="text-gray-700">Password</label>
            </div>
            <input
              className="input input-bordered w-full border border-gray-300 shadow p-1"
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
            className={`btn bg-emerald-500 text-white w-full mt-4 cursor-pointer p-1.5 ${
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
            มีบัญชีอยู่แล้ว
          </Link>
        </form>
      </div>
    </>
  );
}

export default Register;
