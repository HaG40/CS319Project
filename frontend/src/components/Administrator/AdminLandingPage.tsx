/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import type { Activity } from "../../types/Activity";
import SideBar from "../SideBar";
import Banner from "../Banner";
import formatDate from "../../utils/FormatDate";
import { useParams, useNavigate } from "react-router-dom";
import { useActivityStore } from "../../store/activityStore";
import { useUserStore } from "../../store/userStore";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";

function AdminLandingPage() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { activities, isLoading, fetchAll, fetchByCategory, searchActivity } =
    useActivityStore();
  const user = useUserStore((state) => state.user);

  const [search, setSearch] = useState("");

  // modal edit
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  // modal delete
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // fetch activities
  const fetchCategory = async () => {
    if (category) await fetchByCategory(encodeURIComponent(category));
    else await fetchAll();
  };

  useEffect(() => {
    fetchCategory();
  }, [category]);

  useEffect(() => {
  window.scrollTo(0, 0);
}, []);

  // ---------------- Edit Modal ----------------
  const openEditModal = (activity: Activity) => {
    if (!user) return toast.warn("กรุณาเข้าสู่ระบบในฐานะแอดมิน");

    setEditData({
      id: activity.id,
      title: activity.title,
      description: activity.description,
      category: activity.category,
      location: activity.location,
      start_date: activity.start_date.split("T")[0],
      end_date: activity.end_date.split("T")[0],
      slots: activity.slots,
      occupied: activity.occupied,
      organizer: activity.organizer,
      image: null,
    });
    setEditOpen(true);
  };

  const closeEditModal = () => {
    setEditOpen(false);
    setEditData(null);
  };

  const submitEdit = async () => {
    if (!editData) return;

    try {
      const formData = new FormData();
      Object.keys(editData).forEach((key) => {
        if (key !== "image") formData.append(key, editData[key]);
      });
      if (editData.image) formData.append("image", editData.image);

      await axios.put(
        `http://localhost:3000/api/act/update/${editData.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("แก้ไขกิจกรรมสำเร็จ");
      fetchCategory();
      closeEditModal();
    } catch (err: any) {
      toast.error("แก้ไขกิจกรรมไม่สำเร็จ");
    }
  };

  // ---------------- Delete Modal ----------------
  const openDeleteModal = (id: string) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteOpen(false);
    setDeleteId(null);
  };

  const deleteActivity = async () => {
    if (!deleteId) return;

    try {
      await axios.delete(`http://localhost:3000/api/act/delete/${deleteId}`);
      toast.success("ลบกิจกรรมสำเร็จ");
      fetchCategory();
      closeDeleteModal();
    } catch (err : any) {
      toast.error("ลบกิจกรรมไม่สำเร็จ");
    }
  };

  // ---------------- Navigate to Participants Page ----------------
  const goToParticipants = (activityId: string, activityTitle: string) => {
    navigate(`/admin/participants/${activityId}`, {
      state: { activityTitle },
    });
  };

  return (
    <>
      <div className="flex flex-row justify-between">
        <SideBar />
        <div className="mt-16 mb-16 flex flex-col w-full">
          <span className="ml-50">
            <Banner />
          </span>
          <div className="ml-52 mr-8 flex flex-col">
            <h1 className="text-3xl font-semibold mx-auto my-5 text-emerald-600">
              {category ? `กิจกรรมหมวด: ${category}` : "กิจกรรมทั้งหมด"}
            </h1>

            <div className="flex flex-row justify-between mx-auto w-1/2 mb-5 items-center border px-3 py-2 shadow-lg rounded-xl border-gray-300 bg-white">
              <input
                type="text"
                className="w-full outline-0"
                value={search}
                placeholder="ค้นหากิจกรรม..."
                onChange={(e) => {
                  setSearch(e.target.value);
                  searchActivity(e.target.value);
                }}
              />
              <FaSearch className="text-gray-400" />
            </div>

            {isLoading && (
              <p className="text-gray-500 mx-auto mt-5">กำลังโหลด...</p>
            )}
            {!isLoading && activities.length < 1 && (
              <p className="text-gray-500 mx-auto mt-5">ไม่พบข้อมูล</p>
            )}

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-5 w-full">
              {activities.map((activity: Activity) => (
                <li key={activity.id}>
                  {activity.image ? (
                    <img
                      src={`http://localhost:3000${activity.image}`}
                      alt={activity.title}
                      className="w-full h-65 object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-65 bg-gray-200 flex justify-center items-center rounded-t-lg">
                      <span className="text-gray-500">ไม่มีรูปภาพ</span>
                    </div>
                  )}

                  <div className="border-b h-60 rounded-b-2xl px-4 pb-4 pt-2 flex flex-col shadow-lg border-gray-200 bg-white">
                    <h2 className="font-semibold text-lg text-emerald-600 mb-1">
                      {activity.title}
                    </h2>
                    <p className="text-sm text-gray-700">
                      <b className="text-emerald-600">รายละเอียด:</b>{" "}
                      {activity.description}
                    </p>
                    <p className="text-sm text-gray-700">
                      <b className="text-emerald-600">ประเภท:</b>{" "}
                      {activity.category}
                    </p>
                    <p className="text-sm text-gray-600">
                      <b className="text-emerald-600">เริ่ม:</b>{" "}
                      {formatDate(activity.start_date)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <b className="text-emerald-600">สิ้นสุด:</b>{" "}
                      {formatDate(activity.end_date)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <b className="text-emerald-600">ผู้เข้าร่วม:</b>{" "}
                      {activity.occupied}/{activity.slots}
                    </p>

                    <div className="mt-auto flex justify-between items-center">
                      <p className="text-sm text-gray-500">{activity.organizer}</p>

                      <div className="flex flex-row gap-1">
                        <button
                          onClick={() => openEditModal(activity)}
                          className="bg-blue-500 p-2 rounded text-white cursor-pointer text-sm hover:bg-blue-600"
                        >
                          แก้ไข
                        </button>

                        <button
                          onClick={() => openDeleteModal(activity.id)}
                          className="bg-red-500 p-2 rounded text-white cursor-pointer text-sm hover:bg-red-600"
                        >
                          ลบ
                        </button>

                        <button
                          onClick={() =>
                            goToParticipants(activity.id, activity.title)
                          }
                          className="bg-purple-500 p-2 rounded text-white cursor-pointer text-sm hover:bg-purple-600"
                        >
                          ผู้เข้าร่วม
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

      {/* ---------------- Edit Modal ---------------- */}
      {editOpen && editData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            <h2 className="text-xl font-bold mb-4 text-emerald-600">
              แก้ไขกิจกรรม
            </h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                className="border p-2 rounded"
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
                placeholder="ชื่อกิจกรรม"
              />
              <textarea
                className="border p-2 rounded"
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                placeholder="รายละเอียด"
              ></textarea>
              <input
                type="text"
                className="border p-2 rounded"
                value={editData.category}
                onChange={(e) =>
                  setEditData({ ...editData, category: e.target.value })
                }
                placeholder="หมวดหมู่"
              />
              <input
                type="date"
                className="border p-2 rounded"
                value={editData.start_date}
                onChange={(e) =>
                  setEditData({ ...editData, start_date: e.target.value })
                }
              />
              <input
                type="date"
                className="border p-2 rounded"
                value={editData.end_date}
                onChange={(e) =>
                  setEditData({ ...editData, end_date: e.target.value })
                }
              />
              <input
                type="number"
                className="border p-2 rounded"
                value={editData.slots}
                onChange={(e) =>
                  setEditData({ ...editData, slots: e.target.value })
                }
                placeholder="จำนวนที่ว่าง"
              />
              <input
                type="number"
                className="border p-2 rounded"
                value={editData.occupied}
                onChange={(e) =>
                  setEditData({ ...editData, occupied: e.target.value })
                }
                placeholder="จำนวนผู้เข้าร่วม"
              />
              <input
                type="text"
                className="border p-2 rounded"
                value={editData.organizer}
                onChange={(e) =>
                  setEditData({ ...editData, organizer: e.target.value })
                }
                placeholder="ผู้จัด"
              />
              <input
                type="file"
                className="border p-2 rounded"
                onChange={(e) =>
                  setEditData({ ...editData, image: e.target.files?.[0] })
                }
              />
            </div>

            <div className="flex justify-between mt-5">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                onClick={closeEditModal}
              >
                ยกเลิก
              </button>
              <button
                onClick={submitEdit}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Delete Modal ---------------- */}
      {deleteOpen && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80">
            <h2 className="text-lg font-bold text-red-600 mb-4">
              ยืนยันการลบ
            </h2>
            <p className="text-gray-700 mb-5">
              ต้องการลบกิจกรรมนี้หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
            </p>
            <div className="flex justify-between">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                onClick={closeDeleteModal}
              >
                ยกเลิก
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={deleteActivity}
              >
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminLandingPage;