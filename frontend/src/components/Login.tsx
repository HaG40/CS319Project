import { Link } from "react-router-dom"

function Login () {
    return (
        <>
            <div className="mt-10 p-10 flex justify-center">
                <form className="mx-auto border rounded-2xl p-5 pb-10 flex flex-col justify-center gap-4 w-1/4">
                    <div className="flex flex-col gap-2.5 justify-center">
                    <p className="text-2xl font-bold flex justify-center">Login</p>
                    <p>username</p>
                        <input className="border rounded" type="text" />
                        <p>password</p>
                        <input className="border rounded" type="text" />
                        <div className="w-full flex flex-col gap-1.5 mt-5">
                            <button className=" bg-emerald-500 p-1.5 rounded text-white" type="submit">login</button>
                            <Link to="user/register" className="flex justify-center text-blue-500 hover:underline">ยังไม่มีบัญชี</Link>
                        </div>
                    </div>

                 
                </form>
            </div>
        </>
    )
}

export default Login