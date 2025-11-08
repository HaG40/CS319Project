import { toast } from "react-toastify";
import { useActivityStore } from "../store/activityStore"
import { useUserStore } from "../store/userStore"
import React, { useEffect } from "react"
import { FaTimes } from "react-icons/fa";

function User () {

    const { user } = useUserStore();
    const { registeredActivities, getRegisteredActivity, cancelRegistration } = useActivityStore();

    // ✅ Popup Modal State
    const [isCancelOpen, setIsCancelOpen] = React.useState(false);
    const [selectedActivityId, setSelectedActivityId] = React.useState<string | null>(null);

    const openCancelModal = (activityId: string) => {
        setSelectedActivityId(activityId);
        setIsCancelOpen(true);
    };

    const closeCancelModal = () => {
        setIsCancelOpen(false);
        setSelectedActivityId(null);
    };

    const confirmCancel = async () => {
        if (!user || !selectedActivityId) return;
        const success = await cancelRegistration(user.id, selectedActivityId);

        if (success) {
            getRegisteredActivity(user.id);
            toast.success("ยกเลิกการสมัครกิจกรรมสำเร็จ");
        }

        closeCancelModal();
    };

    useEffect(() => {
        if (user) {
            getRegisteredActivity(user.id);
        }
    }, [user]);

    return (
        <>
            <div className="pt-25 flex flex-col justify-center mb-16 w-full items-center">
                <h1 className="text-3xl font-bold">กิจกรรมที่คุณลงทะเบียน</h1>
                <div className="mt-10 w-full max-w-4xl">
                    {registeredActivities.length === 0 ? (
                        <p className="text-center text-gray-500">คุณยังไม่ได้ลงทะเบียนเข้าร่วมกิจกรรมใดๆ</p>
                    ) : (
                        <ul className="space-y-4">
                            {registeredActivities.map((activity) => (
                                <li key={activity.id} className="border mx-auto justify-between flex flex-row gap-6 border-gray-300 rounded-lg p-4 shadow">
                                    <div className="flex flex-row justify-start gap-8">
                                        <img
                                            src={activity.image ? `http://localhost:3000${activity.image}` : 'https://via.placeholder.com/150'}
                                            alt={activity.title}
                                            className="w-60 h-40 object-cover rounded-md border border-gray-300 shadow"
                                        />
                                        <div className="flex flex-col justify-center">
                                            <h2 className="text-xl font-semibold text-emerald-600 mb-2">{activity.title}</h2>
                                            <p className="text-gray-700">{activity.description}</p>
                                            <p className="text-sm text-gray-500 mt-2">ประเภท: {activity.category}</p>
                                            <p className="text-sm text-gray-500">จัดโดย: {activity.organizer}</p>
                                        </div>
                                    </div>
                                
                                    <div className="flex flex-row justify-end h-full gap-4">
                                        <button 
                                            onClick={() => openCancelModal(activity.id)} 
                                            className="text-white bg-red-400 p-2 rounded shadow cursor-pointer"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                    
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>


            {/* ✅ Popup Modal สำหรับยกเลิก */}
            {isCancelOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-80">

                        <h2 className="text-xl font-bold text-red-600 mb-4 text-center">
                            ยืนยันการยกเลิก?
                        </h2>

                        <p className="text-center text-gray-700 mb-6">
                            คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการเข้าร่วมกิจกรรมนี้?
                        </p>

                        <div className="flex justify-between">
                            <button
                                onClick={closeCancelModal}
                                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 cursor-pointer"
                            >
                                ไม่ยกเลิก
                            </button>

                            <button
                                onClick={confirmCancel}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
                            >
                                ยืนยัน
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </>
    )
}

export default User;
