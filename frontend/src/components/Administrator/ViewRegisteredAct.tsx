import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import type { Activity } from "../../types/Activity";
import formatDate from "../../utils/FormatDate";

function ViewRegisteredAct () {
    const { userId } = useParams<{ userId: string }>();
    const [ registeredActivities, setRegisteredActivities ] = useState([])
    const location = useLocation();
    const navigate = useNavigate();
    const targetUsername = location.state?.username || "User";

    useEffect(() => {
        getRegisteredAct();
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const goBack = () => {
        navigate(-1);
    };

    const getRegisteredAct = async () => {  
    try {
        const res = await axios.get(`http://localhost:3000/api/act/registered/${userId}`);
        setRegisteredActivities(res.data)
        console.log(res.data)
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("เกิดข้อผิดพลาดในดูข้อมูลกิจกรรมของผู้ใช้ดังกล่าว");
    }

  };
    return(
        <>
            <div className="p-10 pt-25">
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={goBack}
                  className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
                >
                  <FaArrowLeft />
                  กลับ
                </button>
                <h1 className="text-3xl font-bold text-emerald-700">
                  กิจกรรมที่ {targetUsername} เข้าร่วม
                </h1>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center mb-25 ">
                {registeredActivities.length === 0 ? (
                    <p className="text-center text-gray-500">ผู้ใช้ยังไม่ได้ลงทะเบียนเข้าร่วมกิจกรรมใดๆ</p>
                ) : (
                    <ul className="w-full">
                        {registeredActivities.map((activity : Activity) => (
                            <li key={activity.id} className=" mx-auto justify-between flex flex-row gap-6 border border-gray-300 shadow rounded-2xl bg-white p-4">
                                <div className="flex flex-row justify-start gap-8">
                                    <img
                                        src={activity.image ? `http://localhost:3000${activity.image}` : 'https://placehold.co/600x400?text=No Image'}
                                        alt={activity.title}
                                        className="w-60 h-40 object-cover rounded-md border border-gray-300 shadow"
                                    />
                                    <div className="flex flex-col justify-center">
                                        <h2 className="text-xl font-semibold text-emerald-600 mb-2">{activity.title}</h2>
                                        <p className="text-gray-700">{activity.description}</p>
                                        <p className="text-sm text-gray-500 mt-2"><b>เริ่ม:</b> {formatDate(activity.start_date)}</p>
                                        <p className="text-sm text-gray-500"><b>สิ้นสุด:</b> {formatDate(activity.end_date)}</p>
                                        <p className="text-sm text-gray-500 mt-2"><b>ประเภท:</b> {activity.category}</p>
                                        <p className="text-sm text-gray-500"><b>จัดโดย:</b> {activity.organizer}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>            
        </>
    )
}

export default ViewRegisteredAct