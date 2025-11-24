import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import type { User } from "../../types/User";
import { useUserStore } from "../../store/userStore";
import axios from "axios";

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

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:3000/api/user/all");
    setUsers(res.data.users);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const startEdit = (user: User) => {
    setEditingUser(user.id);
    setForm({
      username: user.username,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      role: user.role,
    });
  };

  const cancelEdit = () => {
    setEditingUser("");
  };

  const saveUser = async (id: string) => {
    await axios.put(`http://localhost:3000/api/user/edit/${id}`, form);
    setEditingUser("");
    fetchUsers();
  };

  // แทน confirm() ด้วย modal
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
    await axios.delete(`http://localhost:3000/api/user/delete/${deleteUserId}`);
    closeDeleteModal();
    fetchUsers();
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6 text-emerald-700 mt-15">
        User Manager For Administrator
      </h1>

      <table className="w-full border border-gray-400 shadow rounded-lg">
        <thead className="bg-emerald-100 ">
          <tr>
            <th className="p-3 border-x text-white bg-emerald-700">Username</th>
            <th className="p-3 border-x text-white bg-emerald-700">ชื่อ</th>
            <th className="p-3 border-x text-white bg-emerald-700">Email</th>
            <th className="p-3 border-x text-white bg-emerald-700">Role</th>
            <th className="p-3 border-x text-white bg-emerald-700 w-40">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr className="border text-gray-800 text-shadow-sm bg-emerald-300">
            <td className="p-3 border border-gray-400 shadow">
              <p>{user?.username}</p>
            </td>
            <td className="p-3 border border-gray-400 shadow">
              <p>{user?.fname} {user?.lname}</p>
            </td>
            <td className="p-3 border border-gray-400 shadow">
              <p>{user?.email}</p>
            </td>
            <td className="p-3 border border-gray-400 shadow">
              <p>{user?.role}</p>
            </td>
            <td className="p-3 border border-gray-400 bg-amber-100 shadow">
            </td>
          </tr>

          {users.map((u: User) => (
            u.role === "user" &&
            <tr key={u.id} className="border text-emerald-700 text-shadow-2xs hover:bg-amber-200 bg-amber-100">
              <td className="p-3 border border-gray-400 shadow">
                {editingUser === u.id ? (
                  <input
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    className="border p-1 rounded border-gray-300 shadow bg-white mx-2 outline-0"
                  />
                ) : u.username}
              </td>
              <td className="p-3 border border-gray-400 shadow outline-0">
                {editingUser === u.id ? (
                  <div className="flex flex-row gap-2">
                    <input
                      value={form.fname}
                      onChange={(e) => setForm({ ...form, fname: e.target.value })}
                      className="border p-1 rounded border-gray-300 shadow bg-white mx-2 outline-0 w-1/2"
                    />
                    <input
                      value={form.lname}
                      onChange={(e) => setForm({ ...form, lname: e.target.value })}
                      className="border p-1 rounded border-gray-300 shadow bg-white mx-2 outline-0 w-1/2"
                    />
                  </div>

                ) : `${u.fname} ${u.lname}`}
              </td>
              <td className="p-3 border border-gray-400 shadow">
                {editingUser === u.id ? (
                  <input
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="border p-1 rounded border-gray-300 shadow bg-white mx-2 outline-0"
                  />
                ) : u.email}
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
                ) : u.role}
              </td>
              <td className="p-3 border border-gray-400 shadow text-center space-x-3">
                {editingUser === u.id ? (
                  <>
                    <button onClick={() => saveUser(u.id)} className="text-emerald-400 cursor-pointer">
                      <FaSave size={22} />
                    </button>
                    <button onClick={cancelEdit} className="text-red-400 cursor-pointer">
                      <FaTimes size={22} />
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(u)} className="text-blue-400 cursor-pointer">
                      <FaEdit size={22} />
                    </button>
                    <button onClick={() => openDeleteModal(u.id)} className="text-red-400 cursor-pointer">
                      <FaTrash size={22} />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
