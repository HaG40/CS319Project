/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import axios from "axios";
import { FaPlus, FaUpload } from "react-icons/fa";
import { useEffect } from "react";

function CreateActivity() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    start_date: "",
    end_date: "",
    slots: "",
    organizer: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (
      form.title === "" ||
      form.description === "" ||
      form.category === "" ||
      form.location === "" ||
      form.start_date === "" ||
      form.end_date === "" ||
      form.slots === "" ||
      form.organizer === ""
    ) {
      setErrorMessage("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      for (const key in form) data.append(key, form[key]);
      if (image) data.append("image", image);

      await axios.post("http://localhost:3000/api/act/add", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      window.location.replace("/");
      setForm({
        title: "",
        description: "",
        category: "",
        location: "",
        start_date: "",
        end_date: "",
        slots: "",
        organizer: "",
      });
      setImage(null);
    } catch (err) {
      setErrorMessage("เกิดข้อผิดพลาดในการสร้างกิจกรรม");
    }
    setLoading(false);
  };

  useEffect(() => {
  window.scrollTo(0, 0);
}, []);

  return (
    <div className="py-30">
      <div className="mx-auto min-w-1/4 border border-gray-300 shadow rounded-2xl p-6 pb-10 flex flex-col justify-center gap-4 w-full max-w-xl bg-white">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-2 text-emerald-700">
          <FaPlus /> สร้างกิจกรรมใหม่
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="ชื่อกิจกรรม"
            value={form.title}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg border-gray-300 outline-0 shadow "
          />

          <textarea
            name="description"
            placeholder="รายละเอียดกิจกรรม"
            value={form.description}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg border-gray-300 outline-0 shadow h-24"
          ></textarea>

          <div className="flex flex-row items-center gap-2 mb-7">
            <label
              htmlFor="activity-image"
              className="flex flex-row items-center w-fit justify-start gap-2 cursor-pointer bg-emerald-500 hover:bg-emerald-700 text-white font-semibold py-1.5 px-4 rounded shadow transition-colors"
            >
              <FaUpload /> เลือกรูปภาพกิจกรรม
            </label>
            <input
              id="activity-image"
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="hidden"
            />
            {image && (
              <p className="text-gray-700 text-sm italic">
                อัปโหลดแล้ว:{" "}
                <span className="font-small text-blue-500">{image.name}</span>
              </p>
            )}
          </div>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg border-gray-300 outline-0 shadow"
          >
            <option value="">เลือกหมวดหมู่</option>
            <option value="สิ่งแวดล้อม">สิ่งแวดล้อม</option>
            <option value="การศึกษา">การศึกษา</option>
            <option value="สุขภาพ">สุขภาพ</option>
            <option value="สังคม">สังคม</option>
            <option value="สัตว์">สัตว์</option>
            <option value="ศิลปะ">ศิลปะ</option>
            <option value="อื่นๆ">อื่นๆ</option>
          </select>

          <input
            type="text"
            name="location"
            placeholder="สถานที่จัดกิจกรรม"
            value={form.location}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg border-gray-300 outline-0 shadow"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm">เริ่มวันที่และเวลา</label>
              <input
                type="datetime-local"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg border-gray-300 outline-0 shadow"
              />
            </div>
            <div>
              <label className="block text-sm">สิ้นสุดวันที่และเวลา</label>
              <input
                type="datetime-local"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg border-gray-300 outline-0 shadow"
              />
            </div>
          </div>

          <input
            type="number"
            name="slots"
            placeholder="จำนวนผู้เข้าร่วมที่รับได้"
            value={form.slots}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg border-gray-300 outline-0 shadow "
          />

          <input
            type="text"
            name="organizer"
            placeholder="ผู้จัดกิจกรรม"
            value={form.organizer}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg border-gray-300 outline-0 shadow "
          />

          {errorMessage && (
            <p className="text-red-500 text-sm text-center mt-2">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`rounded-lg shadow btn bg-emerald-500 hover:bg-emerald-700 text-white w-full mt-4 cursor-pointer p-2 ${
              loading ? "btn-disabled opacity-60" : ""
            }`}
          >
            {loading ? "กำลังสร้าง..." : "สร้างกิจกรรม"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateActivity;
