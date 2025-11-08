import { Link } from "react-router-dom"
import { useUserStore } from "../store/userStore"
import { FaHome, FaUser, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa'

function Header () {

    const { user, isAuthenticated,logout } = useUserStore();

    const handleLogout = async () => {
        await logout();
        window.location.replace("/");
    }


    return (
        <>
            <div className="fixed bg-emerald-400 flex flex-row justify-between w-screen h-16 shadow">
                <div className="flex justify-start">
                    <p className="mx-1.5 text-white text-4xl font-bold p-4">VolunThai</p>
                </div>
                <div className="flex flex-row justify-end items-center gap-2 mx-5 text-white text-lg p-4 cursor-pointer">
                    <Link to="/" className="hover:text-emerald-400 hover:underline rounded-full p-3 text-xl shadow bg-emerald-600 hover:bg-amber-50"><FaHome/></Link>
                    {isAuthenticated ? 
                    <>
                        <Link to="/user" className="hover:text-emerald-400 hover:underline rounded-full p-3 text-xl shadow bg-emerald-600 hover:bg-amber-50"><FaUser/></Link>
                        <button className='hover:text-emerald-400 hover:underline rounded-full p-3 text-xl shadow bg-emerald-600 hover:bg-amber-50' onClick={handleLogout}><FaSignOutAlt/></button>                 
                    </>

                    :        
                        <Link to="/user/login" className="hover:text-emerald-400 hover:underline rounded-full p-3 text-xl shadow bg-emerald-600 hover:bg-amber-50"><FaSignInAlt/></Link>
                    }


                </div>
            </div>
        </>
    )
}

export default Header