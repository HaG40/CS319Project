import { Link } from "react-router-dom"

function SideBar() {
    return (
        <div className="fixed top-0 left-0 h-screen w-50 mt-16 bg-emerald-100 shadow-lg overflow-y-auto z-50">  
            <h2 className="text-2xl font-bold text-emerald-700 flex justify-center p-4 bg-yellow-100 shadow">
                หมวดหมู่
            </h2>

            <ul className="flex flex-col">
                <li>  
                    <Link to="/"  
                          className=" shadow-sm text-gray-600 hover:text-emerald-600 hover:underline text-lg p-4 hover:bg-amber-50 block">
                        ทั้งหมด
                    </Link>
                </li>
                <li>  
                    <Link to="/category/สิ่งแวดล้อม"  
                          className=" shadow-sm text-gray-600 hover:text-emerald-600 hover:underline text-lg p-4 hover:bg-amber-50 block">
                        สิ่งแวดล้อม
                    </Link>
                </li>
                <li>
                    <Link to="/category/การศึกษา" 
                          className=" shadow-sm text-gray-600 hover:text-emerald-600 hover:underline text-lg p-4 hover:bg-amber-50 block">
                        การศึกษา
                    </Link>
                </li>
                <li>
                    <Link to="/category/สังคม" 
                          className=" shadow-sm text-gray-600 hover:text-emerald-600 hover:underline text-lg p-4 hover:bg-amber-50 block">
                        สังคม
                    </Link>
                </li>
                <li>
                    <Link to="/category/สัตว์" 
                          className=" shadow-sm text-gray-600 hover:text-emerald-600 hover:underline text-lg p-4 hover:bg-amber-50 block">
                        สัตว์
                    </Link>
                </li>
                <li>
                    <Link to="/category/ศิลปะ" 
                          className=" shadow-sm text-gray-600 hover:text-emerald-600 hover:underline text-lg p-4 hover:bg-amber-50 block">
                        ศิลปะ
                    </Link>
                </li>                
                <li>
                    <Link to="/category/อื่นๆ" 
                          className=" shadow-sm text-gray-600 hover:text-emerald-600 hover:underline text-lg p-4 hover:bg-amber-50 block">
                        อื่นๆ
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default SideBar
