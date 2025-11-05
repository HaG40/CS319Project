import { Link } from "react-router-dom"

function Header () {
    return (
        <>
            <div className="w-screen bg-emerald-400 flex flex-row justify-between">
                <div className="flex justify-start">
                    <p className="text-white text-4xl font-bold p-4">VolunThai</p>
                </div>
                <div className="flex flex-row justify-end items-center gap-4 text-white text-lg p-4">
                    <Link to="/">Home</Link>
                    <Link to="/user">User</Link>
                    <Link to="/user/login">Login</Link>
                </div>
            </div>
        </>
    )
}

export default Header