/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import $ from "jquery";
import "datatables.net-dt";
import "datatables.net-dt/css/dataTables.dataTables.css";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";
import type { Participant } from "../../types/Participants";

const customStyles = `
  .dataTables_wrapper .dataTables_filter {
    float: none !important;
    text-align: left !important;
    margin-bottom: 10px !important;
  }
  .dataTables_wrapper .dataTables_paginate {
    float: none !important;
    text-align: center !important;
    margin-top: 10px !important;
  }
  .dataTables_wrapper .dataTables_info {
    float: none !important;
    text-align: center !important;
    margin-top: 10px !important;
    padding-top: 10px !important;
  }
  .dataTables_wrapper {
    display: flex !important;
    flex-direction: column !important;
    position: relative !important;
    z-index: 0 !important;
  }
  .dataTables_wrapper .dataTables_filter,
  .dataTables_wrapper .dataTables_length {
    order: -1 !important;
  }
  .dataTables_wrapper table {
    z-index: 0 !important;
    position: relative !important;
  }
  .dataTables_wrapper table thead,
  .dataTables_wrapper table tbody,
  .dataTables_wrapper table tbody tr,
  .dataTables_wrapper table tbody td {
    z-index: 0 !important;
  }
`;

function ViewParticipantsPage() {
  const { activityId } = useParams<{ activityId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const activityTitle = location.state?.activityTitle || "กิจกรรม";

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const tableRef = useRef<HTMLTableElement | null>(null);
  const dataTableInstance = useRef<any>(null);

  const fetchParticipants = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `http://localhost:3000/api/act/participants/${activityId}`
      );
      setParticipants(res.data || []);
    } catch (error) {
      console.error("Error fetching participants:", error);
      toast.error("โหลดผู้เข้าร่วมไม่สำเร็จ");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, [activityId]);

  useEffect(() => {
    if (dataTableInstance.current) {
      dataTableInstance.current.destroy();
      dataTableInstance.current = null;
    }

    if (tableRef.current && participants.length > 0) {
      setTimeout(() => {
        if (tableRef.current) {
          dataTableInstance.current = $(tableRef.current).DataTable({
            paging: false,
            searching: true,
            info: true,
            pageLength: 10,
            lengthMenu: [5, 10, 25, 50, 100],
            order: [[0, "asc"]],
            dom: "frtip",
            language: {
              search: "ค้นหา:",
              info: "จำนวนผู้เข้าร่วมกิจกรรม _TOTAL_ คน",
              infoEmpty: "ไม่มีข้อมูล",
              paginate: {
                first: "หน้าแรก",
                last: "หน้าสุดท้าย",
                next: "ถัดไป",
                previous: "ก่อนหน้า",
              },
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
  }, [participants]);

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="p-10 pt-25">
      <style>{customStyles}</style>

      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={goBack}
          className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
        >
          <FaArrowLeft />
          กลับ
        </button>
        <h1 className="text-3xl font-bold text-emerald-700">
          ผู้เข้าร่วมกิจกรรม: {activityTitle}
        </h1>
      </div>

      {isLoading && (
        <p className="text-gray-500 text-center mt-10">กำลังโหลด...</p>
      )}

      {!isLoading && participants.length === 0 && (
        <div className="text-center mt-25">
          <p className="text-gray-500 text-lg">ยังไม่มีผู้เข้าร่วมกิจกรรมนี้</p>
        </div>
      )}

      {!isLoading && participants.length > 0 && (
        <div className="overflow-x-auto" style={{ position: "relative", zIndex: 0 }}>
          <table
            ref={tableRef}
            className="w-full border border-gray-400 shadow rounded-lg display"
            style={{ width: "100%", position: "relative", zIndex: 0 }}
          >
            <thead className="bg-emerald-100">
              <tr>
                <th className="p-3 border-x text-white bg-emerald-700">ชื่อ-นามสกุล</th>
                <th className="p-3 border-x text-white bg-emerald-700">อีเมล</th>
                <th className="p-3 border-x text-white bg-emerald-700">เบอร์โทร</th>
                <th className="p-3 border-x text-white bg-emerald-700">Line ID</th>
                <th className="p-3 border-x text-white bg-emerald-700">อายุ</th>
              </tr>
            </thead>

            <tbody>
              {participants.map((p: Participant, index: number) => (
                <tr
                  key={p.userId}
                  className={`border text-emerald-700 text-shadow-2xs hover:bg-amber-200 ${
                    index % 2 === 0 ? "bg-amber-50" : "bg-amber-100"
                  }`}
                >
                  <td className="p-3 border border-gray-400 shadow">
                    {p.participants.fullname}
                  </td>
                  <td className="p-3 border border-gray-400 shadow">
                    {p.participants.email}
                  </td>
                  <td className="p-3 border border-gray-400 shadow">
                    {p.participants.phone}
                  </td>
                  <td className="p-3 border border-gray-400 shadow">
                    {p.participants.line}
                  </td>
                  <td className="p-3 border border-gray-400 shadow text-center">
                    {p.participants.age}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ViewParticipantsPage;