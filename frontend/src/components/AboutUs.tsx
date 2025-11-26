import { useEffect } from "react";
function AboutUs() {

  useEffect(() => {
  window.scrollTo(0, 0);
}, []);

  return (
    <div className="bg-amber-50">
      <div className="max-w-5xl mx-auto pt-28 px-6">
        <h1 className="text-4xl font-bold text-emerald-700 text-center">
          เกี่ยวกับเรา
        </h1>

        <p className="text-center text-gray-600 text-lg mt-3">
          VolunThai – แพลตฟอร์มที่เชื่อมต่อคนไทยกับโอกาสทำความดีได้ง่ายขึ้น
        </p>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-emerald-600 mb-3">
            วิสัยทัศน์ (Vision)
          </h2>
          <p className="text-gray-700 leading-relaxed">
            เรามุ่งมั่นที่จะเป็นแพลตฟอร์มจิตอาสาอันดับหนึ่งของประเทศไทย 
            ที่เปิดโอกาสให้ทุกคนสามารถค้นหากิจกรรมดี ๆ ใกล้ตัว 
            และเข้าร่วมได้ง่าย สะดวก และปลอดภัย โดยมีเป้าหมายเพื่อสร้างสังคมที่เกื้อกูลและน่าอยู่มากยิ่งขึ้น
          </p>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-emerald-600 mb-3">
            พันธกิจ (Mission)
          </h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>ส่งเสริมให้คนไทยมีส่วนร่วมในกิจกรรมเพื่อสังคมมากขึ้น</li>
            <li>รวมงานจิตอาสาหลากหลายประเภทไว้ในที่เดียว</li>
            <li>ให้ข้อมูลกิจกรรมที่ชัดเจน ตรวจสอบได้ และเข้าร่วมง่าย</li>
            <li>ช่วยให้ผู้จัดกิจกรรมบริหารผู้สมัครได้อย่างเป็นระบบ</li>
          </ul>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-emerald-600 mb-3">
            ทำไมต้อง VolunThai?
          </h2>
          <p className="text-gray-700 leading-relaxed">
            หลายครั้งกิจกรรมจิตอาสาถูกประกาศกระจัดกระจาย ไม่เป็นระบบ 
            ทำให้ผู้ที่อยากเข้าร่วมต้องเสียเวลาในการค้นหา เราจึงสร้าง VolunThai 
            ขึ้นมาเพื่อให้ทุกคนสามารถค้นหางานดี ๆ และสมัครได้ทันทีในไม่กี่คลิก
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="p-6 rounded-xl shadow-lg bg-emerald-50">
            <h3 className="text-xl font-semibold text-emerald-600 mb-2">
              ค้นหากิจกรรม
            </h3>
            <p className="text-gray-600">
              เลือกตามหมวดหมู่ จังหวัด หรือค้นหาด้วยคีย์เวิร์ดได้อย่างรวดเร็ว
            </p>
          </div>

          <div className="p-6 rounded-xl shadow-lg bg-emerald-50">
            <h3 className="text-xl font-semibold text-emerald-600 mb-2">
              สมัครง่าย
            </h3>
            <p className="text-gray-600">
              สมัครผ่านระบบออนไลน์ พร้อม popup form ใช้งานง่าย ไม่ยุ่งยาก
            </p>
          </div>

          <div className="p-6 rounded-xl shadow-lg bg-emerald-50">
            <h3 className="text-xl font-semibold text-emerald-600 mb-2">
              ติดตามกิจกรรมที่สมัคร
            </h3>
            <p className="text-gray-600">
              ดูประวัติกิจกรรมที่สมัครและยกเลิกได้ภายในหน้าเดียว
            </p>
          </div>

        </div>

        <div className="mt-16 mb-20 text-center bg-amber-50">
          <h3 className="text-2xl font-semibold text-emerald-700 mb-4">
            เริ่มต้นทำความดีไปด้วยกัน
          </h3>
          <p className="text-gray-600 mb-6">
            เพียงเข้าระบบและเลือกกิจกรรมที่คุณสนใจ คุณก็สามารถมีส่วนร่วมในการสร้างสังคมที่ดีขึ้นได้ทันที
          </p>
          <a
            href="/"
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg shadow hover:bg-emerald-700 transition"
          >
            ค้นหากิจกรรมเลย
          </a>
        </div>

      </div>
    </div>
  );
}

export default AboutUs;
