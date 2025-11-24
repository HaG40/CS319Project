import { FaFacebookF, FaInstagram, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { useUserStore } from "../store/userStore";

function Footer() {

  const {user} = useUserStore()

  return (
    <footer className="bg-emerald-700 text-white flex flex-col justify-end  ">
      <div className="max-w-7xl mx-auto px-6 py-7 grid grid-cols-1 md:grid-cols-3 gap-10">

        <div>
          <h2 className="text-3xl font-bold mb-3">VolunThai</h2>
          <p className="text-gray-200 leading-relaxed">
            แพลตฟอร์มรวมกิจกรรมจิตอาสาทั่วประเทศไทย 
            เพื่อให้ทุกคนสามารถค้นหา สมัคร และมีส่วนร่วมในการสร้างสังคมที่ดีขึ้นได้ง่าย ๆ
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">เมนู</h3>
          <ul className="space-y-2 text-gray-200">
            <li><a href="/" className="hover:underline">กิจกรรมทั้งหมด</a></li>
            <li><a href="/about" className="hover:underline">เกี่ยวกับเรา</a></li>
            {user?.role === "admin" && user.username === "admin" ?
            <li><a href="/user/manager" className="hover:underline">บัญชีของฉัน</a></li> 
            :
            <li><a href="/user" className="hover:underline">บัญชีของฉัน</a></li>
            }
            <li><a className="hover:underline cursor-pointer">ติดต่อเรา</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">ช่องทางติดต่อ</h3>

          <ul className="space-y-3 text-gray-200">
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-white text-lg" />
              support@volunthai.com
            </li>
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="text-white text-lg" />
              02-123-4567
            </li>
            <li className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-white text-lg" />
              กรุงเทพฯ ประเทศไทย
            </li>
          </ul>

          <div className="flex gap-4 mt-6">
            <a className="p-2 bg-emerald-600 hover:bg-emerald-500 rounded-full transition cursor-pointer">
              <FaFacebookF />
            </a>
            <a className="p-2 bg-emerald-600 hover:bg-emerald-500 rounded-full transition cursor-pointer">
              <FaInstagram />
            </a>
          </div>
        </div>

      </div>

      <div className="text-center py-4 bg-emerald-800 text-gray-300 text-sm">
        © {new Date().getFullYear()} VolunThai — All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
