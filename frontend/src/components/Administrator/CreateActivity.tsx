import React, { useState } from "react";
import axios from "axios";
import { FaPlus, FaUpload } from "react-icons/fa";

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
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const data = new FormData();
      for (const key in form) data.append(key, form[key]);
      if (image) data.append("image", image);

      const res = await axios.post("http://localhost:3000/api/act/add", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMsg("สร้างกิจกรรมสำเร็จ!");
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
      setMsg("เกิดข้อผิดพลาดในการสร้างกิจกรรม");
    }
    setLoading(false);
  };

  return (
    <div className="pt-30">
        <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-2xl">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FaPlus /> สร้างกิจกรรมใหม่
            </h2>

            {msg && <p className="mb-4 text-green-600 font-semibold">{msg}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                type="text"
                name="title"
                placeholder="ชื่อกิจกรรม"
                value={form.title}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                />

                <textarea
                name="description"
                placeholder="รายละเอียดกิจกรรม"
                value={form.description}
                onChange={handleChange}
                className="w-full p-2 border rounded h-24"
                required
                ></textarea>

                <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
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
                className="w-full p-2 border rounded"
                required
                />

                <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm">เริ่มวันที่</label>
                    <input
                    type="date"
                    name="start_date"
                    value={form.start_date}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                    />
                </div>
                <div>
                    <label className="block text-sm">สิ้นสุดวันที่</label>
                    <input
                    type="date"
                    name="end_date"
                    value={form.end_date}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                    />
                </div>
                </div>

                <input
                type="number"
                name="slots"
                placeholder="จำนวนผู้เข้าร่วมที่รับได้"
                value={form.slots}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                />

                <input
                type="text"
                name="organizer"
                placeholder="ผู้จัดกิจกรรม"
                value={form.organizer}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                />

                <div>
                <label className="flex items-center gap-2 cursor-pointer">
                    <FaUpload /> อัปโหลดรูปภาพกิจกรรม
                </label>
                <input type="file" accept="image/*" onChange={handleImage} />
                </div>

                <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                {loading ? "กำลังสร้าง..." : "สร้างกิจกรรม"}
                </button>
            </form>
            </div>


    </div>
    
  );
}

export default CreateActivity;
