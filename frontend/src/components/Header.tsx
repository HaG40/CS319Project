import { Link } from "react-router-dom"
import { useUserStore } from "../store/userStore"

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
                    <p className="mx-5 text-white text-4xl font-bold p-4">VolunThai</p>
                </div>
                <div className="flex flex-row justify-end items-center gap-4 mx-5 text-white text-lg p-4 cursor-pointer">
                    <Link to="/" className="hover:text-gray-200 hover:underline">Home</Link>
                    {isAuthenticated ? 
                    <>
                        <Link to="/user" className="hover:text-gray-200 hover:underline">{user?.username}</Link>
                        <button className='hover:text-gray-200 hover:underline'onClick={handleLogout}>logout</button>                 
                    </>

                    :        
                        <Link to="/user/login" className="hover:text-gray-200 hover:underline">Login</Link>
                    }


                </div>
            </div>
        </>
    )
}

export default Header