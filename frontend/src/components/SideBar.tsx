import { Link } from "react-router-dom"

function SideBar() {

    return (
        <div className="w-64 h-screen  bg-emerald-100">  
            <h2 className="text-2xl font-bold text-emerald-700 items-center flex justify-center p-4 bg-yellow-100 shadow">หมวดหมู่</h2>
            <ul className="flex flex-col">
                <li>  
                    <Link to="/"  className="text-gray-500 hover:text-emerald-600 hover:underline text-lg p-4 shadow w-full flex hover:bg-amber-50">ทั้งหมด</Link>
                </li>
                <li>  
                    <Link to="/category/สิ่งแวดล้อม"  className="text-gray-500 hover:text-emerald-600 hover:underline text-lg p-4 shadow w-full flex hover:bg-amber-50">สิ่งแวดล้อม</Link>
                </li>
                <li>
                    <Link to="/category/การศึกษา" className="text-gray-500 hover:text-emerald-600 hover:underline text-lg p-4 shadow w-full flex hover:bg-amber-50">การศึกษา</Link>
                </li>
                <li>
                    <Link to="/category/สังคม" className="text-gray-500 hover:text-emerald-600 hover:underline text-lg p-4 shadow w-full flex hover:bg-amber-50">สังคม</Link>
                </li>
                <li>
                    <Link to="/category/สัตว์" className="text-gray-500 hover:text-emerald-600 hover:underline text-lg p-4 shadow w-full flex hover:bg-amber-50">การศึกษา</Link>
                </li>
                <li>
                    <Link to="/category/อื่นๆ" className="text-gray-500 hover:text-emerald-600 hover:underline text-lg p-4 shadow w-full flex hover:bg-amber-50">อื่นๆ</Link>
                </li>
            </ul>
        </div>
    )
}

export default SideBar