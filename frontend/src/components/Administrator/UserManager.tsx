import { useEffect, useState, useRef } from "react";
import { FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import type { User } from "../../types/User";
import { useUserStore } from "../../store/userStore";
import axios from "axios";
import $ from "jquery";
import "datatables.net-dt";
import "datatables.net-dt/css/dataTables.dataTables.css";

function UserManager() {
  const { user } = useUserStore();
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState("");
  const [form, setForm] = useState({
    username: "",
    fname: "",
    lname: "",
    email: "",
    role: "",
  });
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  const tableRef = useRef<HTMLTableElement | null>(null);
  const dataTableInstance = useRef<any>(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/user/all");
      setUsers(res.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

    useEffect(() => {
  window.scrollTo(0, 0);
}, []);

  // Initialize DataTable when users change
  useEffect(() => {
    // Destroy existing DataTable instance
    if (dataTableInstance.current) {
      dataTableInstance.current.destroy();
      dataTableInstance.current = null;
    }

    // Initialize DataTable only if there are users
    if (tableRef.current && users.length > 0) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        if (tableRef.current) {
          dataTableInstance.current = $(tableRef.current).DataTable({
            paging: true,
            searching: true,
            info: true,
            pageLength: 10,
            lengthMenu: [5, 10, 25, 50, 100],
            order: [[0, "asc"]],
            language: {
              search: "ค้นหา:",
              lengthMenu: "แสดง _MENU_ รายการต่อหน้า",
              info: "แสดง _START_ ถึง _END_ จาก _TOTAL_ รายการ",
              infoEmpty: "ไม่มีข้อมูล",
              infoFiltered: "(กรองจากทั้งหมด _MAX_ รายการ)",
              paginate: {
                first: "หน้าแรก",
                last: "หน้าสุดท้าย",
                next: "ถัดไป",
                previous: "ก่อนหน้า",
              },
              zeroRecords: "ไม่พบข้อมูลที่ค้นหา",
            },
          });
        }
      }, 0);
    }

    return () => {
      if (dataTableInstance.current) {
        dataTableInstance.current.destroy();
        dataTableInstance.current = null;
      }
    };
  }, [users]);

  const startEdit = (u: User) => {
    setEditingUser(u.id);
    setForm({
      username: u.username,
      fname: u.fname,
      lname: u.lname,
      email: u.email,
      role: u.role,
    });
  };

  const cancelEdit = () => {
    setEditingUser("");
    setForm({
      username: "",
      fname: "",
      lname: "",
      email: "",
      role: "",
    });
  };

  const saveUser = async (id: string) => {
    try {
      await axios.put(`http://localhost:3000/api/user/edit/${id}`, form);
      setEditingUser("");
      setForm({
        username: "",
        fname: "",
        lname: "",
        email: "",
        role: "",
      });
      await fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const openDeleteModal = (id: string) => {
    setDeleteUserId(id);
    setIsDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteUserId(null);
    setIsDeleteOpen(false);
  };

  const confirmDelete = async () => {
    if (!deleteUserId) return;
    try {
      await axios.delete(`http://localhost:3000/api/user/delete/${deleteUserId}`);
      closeDeleteModal();
      await fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("เกิดข้อผิดพลาดในการลบผู้ใช้");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6 text-emerald-700 mt-15">
        User Manager For Administrator
      </h1>

      <div className="overflow-x-auto">
        <table
          ref={tableRef}
          className="w-full border border-gray-400 shadow rounded-lg display"
          style={{ width: "100%" }}
        >
          <thead className="bg-emerald-100">
            <tr>
              <th className="p-3 border-x text-white bg-emerald-700">Username</th>
              <th className="p-3 border-x text-white bg-emerald-700">ชื่อ - นามสกุล</th>
              <th className="p-3 border-x text-white bg-emerald-700">Email</th>
              <th className="p-3 border-x text-white bg-emerald-700">Role</th>
              <th className="p-3 border-x text-white bg-emerald-700 w-40">Actions</th>
            </tr>
          </thead>

          <tbody>

            <tr className="border text-gray-800 text-shadow-sm bg-emerald-300">
              <td className="p-3 border border-gray-400 shadow">{user?.username}</td>
              <td className="p-3 border border-gray-400 shadow">
                {user?.fname} {user?.lname}
              </td>
              <td className="p-3 border border-gray-400 shadow">{user?.email}</td>
              <td className="p-3 border border-gray-400 shadow">{user?.role}</td>
              <td className="p-3 border border-gray-400 bg-black shadow text-center text-green-500 font-extrabold">
                {user && user.username === "admin" && user.role === "admin" && (
                  <p>🟢 ONLINE</p>
                )}
              </td>
            </tr>

            {/* Other users */}
            {users
              .filter((u) => u.username !== "admin")
              .map((u: User) => (
                <tr
                  key={u.id}
                  className="border text-emerald-700 text-shadow-2xs hover:bg-amber-200 bg-amber-100"
                >
                  <td className="p-3 border border-gray-400 shadow">
                    {editingUser === u.id ? (
                      <input
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        className="border p-1 rounded border-gray-300 shadow bg-white mx-2 outline-0 w-full"
                      />
                    ) : (
                      u.username
                    )}
                  </td>

                  <td className="p-3 border border-gray-400 shadow">
                    {editingUser === u.id ? (
                      <input
                        value={`${form.fname} ${form.lname}`.trim()}
                        onChange={(e) => {
                          const full = e.target.value.trim();
                          const parts = full.split(" ");
                          const fname = parts[0] || "";
                          const lname = parts.slice(1).join(" ") || "";
                          setForm({ ...form, fname, lname });
                        }}
                        className="border p-1 rounded border-gray-300 shadow bg-white mx-2 outline-0 w-full"
                      />
                    ) : (
                      `${u.fname} ${u.lname}`
                    )}
                  </td>

                  <td className="p-3 border border-gray-400 shadow">
                    {editingUser === u.id ? (
                      <input
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="border p-1 rounded border-gray-300 shadow bg-white mx-2 outline-0 w-full"
                      />
                    ) : (
                      u.email
                    )}
                  </td>

                  <td className="p-3 border border-gray-400 shadow">
                    {editingUser === u.id ? (
                      <select
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                        className="border p-1 rounded border-gray-300 shadow bg-white mx-2 outline-0"
                      >
                        <option value="user">user</option>
                        <option value="admin">admin(temp)</option>
                      </select>
                    ) : (
                      u.role
                    )}
                  </td>

                  <td className="p-3 border border-gray-400 shadow text-center space-x-3">
                    {editingUser === u.id ? (
                      <>
                        <button
                          onClick={() => saveUser(u.id)}
                          className="text-emerald-400 cursor-pointer hover:text-emerald-600"
                        >
                          <FaSave size={22} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-red-400 cursor-pointer hover:text-red-600"
                        >
                          <FaTimes size={22} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(u)}
                          className="text-blue-400 cursor-pointer hover:text-blue-600"
                        >
                          <FaEdit size={22} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(u.id)}
                          className="text-red-400 cursor-pointer hover:text-red-600"
                        >
                          <FaTrash size={22} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80">
            <h2 className="text-xl font-bold text-red-600 mb-4 text-center">
              ยืนยันการลบผู้ใช้นี้?
            </h2>
            <p className="text-center text-gray-700 mb-6">
              คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้? การกระทำนี้ไม่สามารถย้อนกลับได้
            </p>
            <div className="flex justify-between">
              <button
                onClick={closeDeleteModal}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManager;