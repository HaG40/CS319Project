/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react"
import type { Activity } from "../types/Activity"
import SideBar from "./SideBar"
import formatDate from "../utils/FormatDate"
import { useParams } from "react-router-dom"
import { useActivityStore } from "../store/activityStore"
import { useUserStore } from "../store/userStore"
import axios from "axios"
import Banner from "./Banner"
import { toast } from 'react-toastify';

function LandingPage () {

    
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedActivity, setSelectedActivity] = React.useState<Activity | null>(null);

    const { category } = useParams<{ category: string }>();
    const { activities, isLoading, fetchAll, fetchByCategory } = useActivityStore();

    const user = useUserStore((state) => state.user);
    const [fullname, setFullname] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [age, setAge] = React.useState("");

    const submitApplication = async () => {
    if (!user) {
        toast.warn("กรุณาเข้าสู่ระบบก่อนสมัคร");
        return;
    }

    try {
        
        if (!selectedActivity) {
        toast.warn("ไม่มีข้อมูลกิจกรรม");
        return;
        } else if (!fullname || !email || !phone || !age) {
        toast.warn("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
        }else if (isNaN(Number(age)) || Number(age) <= 0) {
        toast.warn("กรุณากรอกอายุให้ถูกต้อง");
        return;
        }else if (selectedActivity.occupied >= selectedActivity.slots) {
        toast.warn("กิจกรรมนี้เต็มแล้ว");
        return;
        }

        const res = await axios.post(
        `http://localhost:3000/api/act/join/${selectedActivity?.id}`,
        {
            userId: user.id,
            fullname,
            email,
            phone,
            age,
        }
        );

        toast.success("สมัครสำเร็จ");
        console.log(res.data);
        if(category) await fetchByCategory(encodeURIComponent(category));
        else await fetchAll();
        closeModal();
    } catch (err: any) {
        toast.error(err.response?.data?.error || "เกิดข้อผิดพลาด");
    }
    };


    const fetchCategory = async () => {
    if (category) await fetchByCategory(encodeURIComponent(category));
    else await fetchAll();
    };

    useEffect(() => {
    fetchCategory();
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
            <div className="mt-16 mb-16 flex flex-col w-full">
                <span className="ml-50"><Banner/></span>
                
                <div className="ml-52 mr-8 flex flex-col ">
                <h1 className="text-3xl font-semibold mx-auto my-5 text-emerald-600">
                    {category ? `กิจกรรมหมวด: ${category}` : "กิจกรรมทั้งหมด"}
                </h1>

                {isLoading && <p className="text-gray-500 mx-auto">กำลังโหลด...</p>}


                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-5 w-full">
                {activities.map((activity: Activity) => (
                    <li key={activity.id}>
                        
                        {activity.image ? 
                        <img
                            src={activity.image ? `http://localhost:3000${activity.image}` : "https://via.placeholder.com/150"}
                            alt={activity.title}
                            className="w-full h-40 object-cover rounded-t-lg"
                        />
                        :
                        <div className="w-full h-40 bg-gray-200 flex justify-center items-center rounded-t-lg">
                            <span className="text-gray-500">ไม่มีรูปภาพ</span>
                        </div>
                        }
                    <div className=" border-b h-60 rounded-b-2xl px-4 pb-4 pt-2 flex flex-col shadow border-gray-200">

                        <h2 className="font-semibold text-lg text-emerald-600 mb-1">{activity.title}</h2>


                        <p className="text-sm text-gray-700"><b className="text-emerald-600">รายละเอียด:</b> {activity.description}</p>
                        <p className="text-sm text-gray-700"><b className="text-emerald-600">ประเภท:</b> {activity.category}</p>



                        <p className="text-sm text-gray-600"><b className="text-emerald-600">เริ่ม:</b> {formatDate(activity.start_date)}</p>
                        <p className="text-sm text-gray-600"><b className="text-emerald-600">สิ้นสุด:</b> {formatDate(activity.end_date)}</p>

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

                            <button 
                            onClick={() => openModal(activity)}
                            className="bg-emerald-500 p-2 rounded text-white cursor-pointer text-sm"
                            >
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
                        <input className="input input-bordered px-2 w-full border boreder-gray-300 shadow p-1 rounded" type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} placeholder="ชื่อ - นามสกุล"/>
                        <input className="input input-bordered px-2 w-full border boreder-gray-300 shadow p-1 rounded" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="อีเมล"/>
                        <input className="input input-bordered px-2 w-full border boreder-gray-300 shadow p-1 rounded" type="tel" onChange={(e) => setPhone(e.target.value)} placeholder="เบอร์โทรศัพท์"/>                    
                        <input className="input input-bordered px-2 w-full border boreder-gray-300 shadow p-1 rounded" type="number" onChange={(e) => setAge(e.target.value)} placeholder="อายุ"/>                    
                    </div>

                    <div className="flex justify-between mt-4">
                        <button 
                            onClick={closeModal}
                            className="btn bg-gray-300 text-black cursor-pointer p-1.5 rounded">
                            ยกเลิก
                        </button>

                    <button 
                        onClick={submitApplication}
                        className="btn bg-emerald-500 text-white p-1.5 rounded cursor-pointer">
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
