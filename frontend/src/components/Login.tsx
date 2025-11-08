/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import React from "react";
import { useUserStore } from "../store/userStore";

function Login() {

  const { login, isAuthenticated } = useUserStore();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [errorMessage, setErrorMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");     
    setLoading(true);         

    if (!username || !password) {
      setErrorMessage("กรุณากรอกทั้งชื่อผู้ใช้และรหัสผ่าน");
      setLoading(false);
      return;
    }

    try {
      const succes = await login(username, password);
      if (!succes) {
        setErrorMessage("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
        setLoading(false);
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
          <p className="text-2xl font-bold flex justify-center mb-2">Login</p>

          <div className="flex flex-col gap-1">
            <label className="text-gray-700">Username</label>
            <input
              className="input input-bordered w-full border border-gray-300 shadow p-1"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-700">Password</label>
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
            {loading ? "กำลังเข้าสู่ระบบ..." : "Login"}
          </button>

          <Link
            to="/user/register"
            className="flex justify-center text-blue-600 hover:underline mt-2"
          >
            ยังไม่มีบัญชี ?
          </Link>
        </form>
      </div>
    </>
  );
}

export default Login;
