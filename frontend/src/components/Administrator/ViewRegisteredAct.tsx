import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import type { Activity } from "../../types/Activity";
import formatDate from "../../utils/FormatDate";
import "datatables.net-dt";
import "datatables.net-dt/css/dataTables.dataTables.css";
import DataTable from "datatables.net-dt";

function ViewRegisteredAct() {
  const { userId } = useParams<{ userId: string }>();
  const [registeredActivities, setRegisteredActivities] = useState<Activity[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [ isLoading,setIsLoading ] = useState(false)

  const tableRef = useRef<HTMLTableElement | null>(null);
  const dataTableInstance = useRef<any>(null);

  const targetUsername = location.state?.username || "User";

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchActivities = async () => {
    try {
        setIsLoading(true);
      const res = await axios.get(
        `http://localhost:3000/api/act/registered/${userId}`
      );
      setRegisteredActivities(res.data);
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการโหลดข้อมูลกิจกรรม");
    } finally {
        setIsLoading(false);
    }
  };

  // Init DataTable แบบ usermanager
  useEffect(() => {
    if (!tableRef.current) return;

    if (dataTableInstance.current) {
      dataTableInstance.current.destroy();
      dataTableInstance.current = null;
    }

    if (registeredActivities.length > 0) {
      dataTableInstance.current = new DataTable(tableRef.current, {
        paging: true,
        searching: true,
        info: true,
        pageLength: 5,
        lengthMenu: [5, 10, 25],
        order: [[1, "asc"]],
        language: {
          search: "ค้นหา:",
          lengthMenu: "แสดง _MENU_ รายการ",
          zeroRecords: "ไม่พบข้อมูล",
          info: "แสดง _START_ ถึง _END_ จาก _TOTAL_ รายการ",
          infoEmpty: "ไม่มีข้อมูล",
          paginate: {
            first: "หน้าแรก",
            last: "สุดท้าย",
            next: "ถัดไป",
            previous: "ย้อนกลับ",
          },
        },
      });
    }
  }, [registeredActivities]);

  const goBack = () => navigate(-1);

  return (
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

      {isLoading && (
        <p className="text-gray-500 text-center">กำลังโหลด...</p>
      )}

      {!isLoading && registeredActivities.length === 0 && (
        <p className="text-center text-gray-500">
          ผู้ใช้ยังไม่ได้ลงทะเบียนเข้าร่วมกิจกรรมใดๆ
        </p>
      )} 
       {!isLoading && registeredActivities.length > 0 && ( 
        <div className="overflow-x-auto">
          <table
            ref={tableRef}
            className="w-full border border-gray-400 shadow rounded-lg display"
          >
            <thead className="bg-emerald-700">
              <tr>
                <th className="p-3 border-x text-white w-3xs">ภาพ</th>
                <th className="p-3 border-x text-white">ชื่อกิจกรรม</th>
                <th className="p-3 border-x text-white">รายละเอียด</th>
                <th className="p-3 border-x text-white">จัดโดย</th>
                <th className="p-3 border-x text-white">ช่วงเวลา</th>
                <th className="p-3 border-x text-white">ประเภท</th>
              </tr>
            </thead>

            <tbody>
              {registeredActivities.map((activity) => (
                <tr key={activity.id}>
                  <td>
                    <img
                      src={
                        activity.image
                          ? `http://localhost:3000${activity.image}`
                          : "https://placehold.co/600x400?text=No Image"
                      }
                      alt={activity.title}
                      className="act-image"
                    />
                  </td>

                  <td className="font-semibold text-emerald-700">{activity.title}</td>

                  <td className="text-gray-700">{activity.description}</td>

                  <td className="text-gray-700">{activity.organizer}</td>

                  <td className="text-gray-700">
                    <p><b>เริ่ม:</b> {formatDate(activity.start_date)}</p>
                    <p><b>สิ้นสุด:</b> {formatDate(activity.end_date)}</p>
                  </td>

                  <td className="text-gray-700">{activity.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ViewRegisteredAct;
