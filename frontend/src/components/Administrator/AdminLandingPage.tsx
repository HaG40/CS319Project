/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react"
import type { Activity } from "../../types/Activity"
import SideBar from "../SideBar"
import formatDate from "../../utils/FormatDate"
import { useParams } from "react-router-dom"
import { useActivityStore } from "../../store/activityStore"
import { useUserStore } from "../../store/userStore"
import axios from "axios"
import Banner from "../Banner"
import { toast } from 'react-toastify';
import { FaSearch } from "react-icons/fa"

function AdminLandingPage () {

    
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedActivity, setSelectedActivity] = React.useState<Activity | null>(null);

    const { category } = useParams<{ category: string }>();
    const { activities, isLoading, fetchAll, fetchByCategory, searchActivity } = useActivityStore();

    const user = useUserStore((state) => state.user);
    const [fullname, setFullname] = React.useState(`${user?.fname} ${user?.lname}`);
    const [email, setEmail] = React.useState(`${user?.email}`);

    const [search, setSearch] = React.useState("");


    const fetchCategory = async () => {
    if (category) await fetchByCategory(encodeURIComponent(category));
    else await fetchAll();
    };

    useEffect(() => {
    fetchCategory();
    }, [category]);

    const openModal = (activity: Activity) => {
        if (!user) {
            toast.warn("กรุณาเข้าสู่ระบบในฐานะแอดมิน");
            return;
        }
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
            <div className="mt-16 mb-16 flex flex-col w-full ">
                <span className="ml-50"><Banner/></span>
                <div className="ml-52 mr-8 flex flex-col ">
                <h1 className="text-3xl font-semibold mx-auto my-5 text-emerald-600">
                    {category ? `กิจกรรมหมวด: ${category}` : "กิจกรรมทั้งหมด"}
                </h1>

                <div className="flex flex-row justify-between mx-auto w-1/2 mb-5 items-center border px-3 py-2  shadow-lg rounded-xl border-gray-300 bg-white">
                    <input
                        type="text"
                        className="w-full outline-0"
                        value={search}
                        placeholder="ค้นหากิจกรรมที่คุณสนใจ..."
                        onChange={(e) => {
                            setSearch(e.target.value);
                            searchActivity(e.target.value);
                        }}
                    />
                    <FaSearch className="items-center text-gray-400"/>
                </div>

                {isLoading && <p className="text-gray-500 mx-auto mt-5">กำลังโหลด...</p>}
                {!isLoading && activities.length < 1 && <p className="text-gray-500 mx-auto mt-5">ไม่พบข้อมูล</p>}


                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-5 w-full">
                {activities.map((activity: Activity) => (
                    <li key={activity.id}>
                        
                        {activity.image ? 
                        <img
                            src={activity.image ? `http://localhost:3000${activity.image}` : "https://via.placeholder.com/150"}
                            alt={activity.title}
                            className="w-full h-65 object-cover rounded-t-lg"
                        />
                        :
                        <div className="w-full h-65 bg-gray-200 flex justify-center items-center rounded-t-lg">
                            <span className="text-gray-500">ไม่มีรูปภาพ</span>
                        </div>
                        }
                    <div className=" border-b h-60 rounded-b-2xl px-4 pb-4 pt-2 flex flex-col shadow-lg border-gray-200 bg-white">

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
                        <input className="input input-bordered px-2 w-full border boreder-gray-300 shadow p-1 rounded-lg outline-0" type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} placeholder="ชื่อ - นามสกุล"/>
                        <input className="input input-bordered px-2 w-full border boreder-gray-300 shadow p-1 rounded-lg outline-0" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="อีเมล"/>
                        <input className="input input-bordered px-2 w-full border boreder-gray-300 shadow p-1 rounded-lg outline-0" type="tel" onChange={(e) => setPhone(e.target.value)} placeholder="เบอร์โทรศัพท์"/>              
                        <input className="input input-bordered px-2 w-full border boreder-gray-300 shadow p-1 rounded-lg outline-0" type="line" onChange={(e) => setLine(e.target.value)} placeholder="ไอดี Line"/>                     
                        <input className="input input-bordered px-2 w-full border boreder-gray-300 shadow p-1 rounded-lg outline-0" type="number" onChange={(e) => setAge(e.target.value)} placeholder="อายุ"/> 
                        <p className="text-xs text-gray-500">*** ข้อมูลติดต่อเหล่านี้ไว้สำหรับการติดต่อผู้สมัครเข้าร่วม</p>                   
                    </div>

                    <div className="flex justify-between mt-4">
                        <button 
                            onClick={closeModal}
                            className="btn bg-gray-300 text-black cursor-pointer p-1.5 rounded">
                            ยกเลิก
                        </button>

                    <button 
                        className="btn bg-emerald-500 text-white p-1.5 rounded cursor-pointer">
                        เข้าร่วม
                    </button>

                    </div>
                </div>
            </div>
        )}

        </>
    )
}

export default AdminLandingPage
