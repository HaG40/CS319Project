import axios from "axios"
import React, { useEffect } from "react"
import type { Activity } from "../types/Activity"
import SideBar from "./SideBar"
import formatDate from "../utils/FormatDate"
import { useParams } from "react-router-dom"

function LandingPage () {

    const [activities, setActivities] = React.useState<Activity[]>([])
    const [isLoading, setIsLoading] = React.useState(false)
    const { category } = useParams<{ category: string }>()
    
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedActivity, setSelectedActivity] = React.useState<Activity | null>(null);

    const fetchData = async () => {
        try {
            if (category) {
                const response = await axios.get(`http://localhost:3000/api/act/${category}`);
                setActivities(response.data);
                return;
            }
            const response = await axios.get(`http://localhost:3000/api/act/`);
            setActivities(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }   
    }

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            await fetchData();
            setIsLoading(false);
        };
        load();
    }, [category]);

    const openModal = (activity: Activity) => {
        setSelectedActivity(activity);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedActivity(null);
    };

    return (
        <>
        <div className="flex flex-row justify-between">
            <SideBar/>
            <div className="flex flex-col w-full">
                <h1 className="text-3xl font-semibold mx-auto my-5 text-emerald-600">
                    {category ? `กิจกรรมหมวด: ${category}` : "กิจกรรมทั้งหมด"}
                </h1>

                {isLoading && <p className="text-gray-500 mx-auto">กำลังโหลด...</p>}

                <ul className="grid grid-cols-4 gap-4 justify-between mx-5">
                    {activities.map((activity: Activity) => (
                        <li key={activity.id}>
                            <div className="border rounded p-4 h-75 w-100 flex flex-col justify-start">
                                <h2 className="font-semibold text-lg">{activity.title}</h2>
                                <p className="text-sm text-gray-700"><b>รายละเอียด:</b> {activity.description}</p>
                                <p className="text-sm text-gray-700"><b>ประเภท:</b> {activity.category}</p>
                                <p className="text-sm text-gray-600"><b>เริ่ม:</b> {formatDate(activity.start_date)}</p>
                                <p className="text-sm text-gray-600"><b>สิ้นสุด:</b> {formatDate(activity.end_date)}</p>

                                <div className="mt-auto flex justify-between items-center">
                                    <p className="text-sm text-gray-500">{activity.organizer}</p>

                                    <div className="flex flex-col gap-0.5">
                                        {activity.occupied === activity.slots ? 
                                            <p className="text-red-500 flex justify-center">เต็ม</p>
                                        :
                                            <p className="text-gray-600 flex justify-center">
                                                {activity.occupied}/{activity.slots}
                                            </p>
                                        }

                                        {/* ✅ เปิด Popup */}
                                        <button 
                                            onClick={() => openModal(activity)}
                                            className="bg-emerald-500 p-2 rounded flex text-white cursor-pointer">
                                            เข้าร่วม
                                        </button>
                                    </div>
                                </div> 
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        {isOpen && selectedActivity && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-xl shadow-xl w-96">

                    <h2 className="text-xl font-bold mb-4 text-emerald-600">
                        สมัครเข้าร่วมกิจกรรม
                    </h2>

                    <p className="mb-3 text-gray-700">
                        <b>กิจกรรม:</b> {selectedActivity.title}
                    </p>

                    <div className="flex flex-col gap-2.5 mb-5">
                        <input className="input input-bordered w-full border boreder-gray-300 shadow p-1 rounded" type="text" placeholder="ชื่อ - นามสกุล"/>
                        <input className="input input-bordered w-full border boreder-gray-300 shadow p-1 rounded" type="email" placeholder="อีเมล"/>
                        <input className="input input-bordered w-full border boreder-gray-300 shadow p-1 rounded" type="tel" placeholder="เบอร์โทรศัพท์"/>                    
                    </div>

                    <div className="flex justify-between mt-4">
                        <button 
                            onClick={closeModal}
                            className="btn bg-gray-300 text-black cursor-pointer p-1.5 rounded">
                            ยกเลิก
                        </button>

                        <button 
                            className="btn bg-emerald-500 text-white cursor-pointer p-1.5 rounded">
                            ส่งใบสมัคร
                        </button>
                    </div>
                </div>
            </div>
        )}

        </>
    )
}

export default LandingPage
