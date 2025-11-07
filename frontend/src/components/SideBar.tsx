import { Link } from "react-router-dom"

function SideBar() {

    return (
        <div className="w-64 h-screen  bg-gray-100 p-4">  
            <h2 className="text-2xl font-bold mb-4">หมวดหมู่</h2>
            <ul className="space-y-2">
                <li>  
                    <Link to="/"  className="text-gray-700 hover:text-emerald-500">ทั้งหมด</Link>
                </li>
                <li>  
                    <Link to="/category/สิ่งแวดล้อม"  className="text-gray-700 hover:text-emerald-500">สิ่งแวดล้อม</Link>
                </li>
                <li>
                    <Link to="/category/การศึกษา" className="text-gray-700 hover:text-emerald-500">การศึกษา</Link>
                </li>
                <li>
                    <Link to="/category/สังคม" className="text-gray-700 hover:text-emerald-500">สังคม</Link>
                </li>
                <li>
                    <Link to="/category/สัตว์" className="text-gray-700 hover:text-emerald-500">การศึกษา</Link>
                </li>
                <li>
                    <Link to="/category/อื่นๆ" className="text-gray-700 hover:text-emerald-500">อื่นๆ</Link>
                </li>
            </ul>
        </div>
    )
}

export default SideBar