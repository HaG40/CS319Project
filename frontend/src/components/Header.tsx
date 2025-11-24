import { Link } from "react-router-dom"
import { useUserStore } from "../store/userStore"
import { FaHome, FaUser, FaSignInAlt, FaSignOutAlt, FaCoffee, FaUsersCog, FaFolderPlus} from 'react-icons/fa'

function Header () {

    const { user, isAuthenticated,logout } = useUserStore();

    const handleLogout = async () => {
        await logout();
        window.location.replace("/");
    }


    return (
        <>
            <div className="z-1 fixed bg-emerald-400 flex flex-row justify-between w-screen h-16 shadow">
                <div className="flex justify-start">
                    <p className="mx-1.5 text-white text-4xl font-bold p-4 text-shadow-lg">VolunThai</p>
                </div>
                <div className="flex flex-row justify-end items-center gap-2 mx-5 text-white text-lg p-4 cursor-pointer">
                    <Link to="/" className="hover:text-emerald-400 hover:underline rounded-full p-3 text-xl shadow bg-emerald-600 hover:bg-amber-50"><FaHome/></Link>
                    {user?.role === "admin" && <Link to="/user/manager" className="hover:text-emerald-400 hover:underline rounded-full p-3 text-xl shadow bg-emerald-600 hover:bg-amber-50"><FaUsersCog/></Link>}
                    {user?.role === "admin" && <Link to="/post" className="hover:text-emerald-400 hover:underline rounded-full p-3 text-xl shadow bg-emerald-600 hover:bg-amber-50"><FaFolderPlus/></Link>}          
                    
                    {isAuthenticated && user?.role === "user" && <Link to="/user" className="hover:text-emerald-400 hover:underline rounded-full p-3 text-xl shadow bg-emerald-600 hover:bg-amber-50"><FaUser/></Link>}
   

                    {user?.role === "user" &&  <Link to="/about" className="hover:text-emerald-400 hover:underline rounded-full p-3 text-xl shadow bg-emerald-600 hover:bg-amber-50"><FaCoffee/></Link>}

                    {isAuthenticated ?                    
                        <button className='hover:text-emerald-400 hover:underline rounded-full p-3 text-xl shadow bg-emerald-600 hover:bg-amber-50' onClick={handleLogout}><FaSignOutAlt/></button>                                                                     

                    :        
                        <Link to="/user/login" className="hover:text-emerald-400 hover:underline rounded-full p-3 text-xl shadow bg-emerald-600 hover:bg-amber-50"><FaSignInAlt/></Link>
                    }
                </div>
            </div>
        </>
    )
}

export default Header