import React, { useState, useEffect, useRef } from "react";
import Navbaradmin from "./Navbaradmin";
import { LuReceipt } from "react-icons/lu";
import "../../App.css";
import CreatableSelect from "react-select/creatable";
import type { DatePickerProps } from "antd";
import { DatePicker, Space } from "antd";
import moment from "moment";
import productAPI from "../../services/productAPI";
import receptAPI from "../../services/receptAPI";
import Swal from "sweetalert2";
import { Link, useParams, useLocation,useNavigate} from "react-router-dom";
// import PDFQuotation from "./PDFQuotation"; // Import PDFDocument component
import jsPDF from "jspdf";

import "jspdf-autotable";

import { font } from "../../font/THSarabun.js";

const TABLE_HEAD = [
  "ลำดับ",
  "รายการ",
  "ประเภท",
  "เพิ่มเติม",
  "ขนาด",
  "ความกว้างหน้าผ้า",
  "ราคา/หลา",
  "จำนวน",
  "รวม",
];

function ReceptInvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) {
      Swal.fire({
        customClass: {
          popup: "bg-transparent"
        },
        backdrop: "rgba(255, 255, 255, 0.5)",
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false, // ห้ามคลิกภายนอกสไปน์
        allowEscapeKey: false // ห้ามใช้ปุ่ม Esc ในการปิดสไปน์
      });
    } else {
      Swal.close();
    }
  }, [isLoading]);
  console.log("id quatation", id);

  useEffect(() => {
    setIsLoading(true);
    receptAPI
      .getReceptById(id)
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("error", err);
        setIsLoading(false);
      });
  }, [id]);

  console.log(data);

  const generatePDF = (data, rows) => {
    if (!data || !rows) {
      console.error("Data or rows are undefined");
      return;
    }

    const doc = new jsPDF();

    // doc.addFileToVFS("THSarabun.ttf", font);
    // doc.addFont("THSarabun.ttf", "THSarabun", "normal");
    // doc.setFont("THSarabun");

    const thaiFont = "THSarabun";
    doc.addFileToVFS("THSarabun.ttf", font);
    doc.addFont("THSarabun.ttf", thaiFont, "normal");
    doc.setFont(thaiFont);
   
    // ข้อมูลลูกค้า
    doc.setFontSize(16);
    doc.text("นางเบ็ญจา ฤทธี", 15, 15);

    doc.setFontSize(14);
    doc.text("2/562 ม.18 ซ.ธนะศรี ต.คูคต อ.ลำลูกกา จ.ปทุมธานี 12130", 15, 23);
    doc.text("โทร. 0879700514", 15, 31);

    doc.setFontSize(14);
    doc.text(`เรียน: ${data.fullname}`, 15, 46);
    doc.text(`ที่อยู่: ${data.address}`, 15, 54); 

    // คำนวณความกว้างของข้อความ "ร้านเจริญกิจผ้าม่าน"
    const textWidth4 = doc.getTextWidth("ใบแจ้งหนี้");
    // คำนวณความกว้างของข้อความ "2/562 ม.18 ซ.ธนะศรี ต.คูคต อ.ลำลูกกา"
    const textWidth5 = doc.getTextWidth(`วันที่: ${data.createdAt}`);
    // คำนวณความกว้างของข้อความ "จ.ปทุมธานี 12130 โทร. 0879700514"
    const textWidth6 = doc.getTextWidth("จ.ปทุมธานี 12130 โทร. 0879700514");

    // คำนวณค่า x-coordinate ใหม่โดยใช้ความกว้างของหน้ากระดาษ
    const xCoordinateRight =
      doc.internal.pageSize.width -
      Math.max(textWidth4, textWidth5, textWidth6) +
      38;

    // แสดงข้อความ "ร้านเจริญกิจผ้าม่าน" และข้อความอื่นๆ โดยกำหนดตำแหน่ง x-coordinate ใหม่
    doc.setFontSize(17);
    doc.text("ใบแจ้งหนี้", xCoordinateRight, 18, {
      align: "right"
    });
    doc.setFontSize(14);

    doc.text(`วันที่: ${data.createdAt}`, xCoordinateRight, 24, {
      align: "right"
    });

    // Table
    let startY = 60;
    // Specify Thai font for autoTable
    const tableConfig = {
      startY,
      head: [TABLE_HEAD],
      body: rows.map((row) => [
        rows.indexOf(row) + 1,
        row.list,
        row.p_type,
        row.detail,
        `${row.width} x ${row.height} ซม.`,
        `${row.p_width} ซม.`,
        `${row.unitprice} บาท`,
        `${row.counts} `,
        `${numberWithCommas(row.total_m || 0)} บาท`
      ]),

      headStyles: {
        fillColor: [217, 217, 217], // กำหนดสีเทาในรูปแบบ RGB
        textColor: [10, 10, 16]
      },

      styles: {
        fontSize: 13, // กำหนดขนาดฟอนต์ใหญ่ขึ้นเป็น 14
        font: thaiFont // ใช้ Thai font
      },

      didDrawCell: (data) => {
        // Adjust text style for Thai font
        doc.setFontSize(13);
        doc.setTextColor(0, 0, 0);
      }
    };
    // Check if Thai font is available
    if (typeof doc.getFontList === "function") {
      const fontList = doc.getFontList();
      if (fontList && fontList[thaiFont]) {
        tableConfig.styles = { font: thaiFont };
      }
    }
    doc.autoTable(tableConfig);

    doc.setFontSize(12);
    // ราคารวม
    const totalPriceY = doc.autoTable.previous.finalY + 10;
   
    doc.setFontSize(14);
    doc.text(
      `รวมเป็นเงิน ${numberWithCommas(data.totalPrice || 0)} บาท`,
      xCoordinateRight +
        28 -
        doc.getTextWidth(
          `ราคารวม: ${numberWithCommas(data.totalPrice || 0)} บาท`
        ),
      totalPriceY-3,
      {
        align: "right"
      }
    );

    // บันทึกเป็น PDF
    doc.save(`ใบแจ้งหนี้-${data.fullname}`);
  };

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleSwitchtoQuotation = async (id, fullname) => {
    // แสดงข้อความยืนยันจากผู้ใช้ก่อนที่จะทำการยกเลิกคำสั่งซื้อ
    const confirmation = await Swal.fire({
      text: `ทำให้ใบแจ้งหนี้ของคุณ ${fullname} เป็นใบเสนอราคาใช่หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่",
      cancelButtonText: "ยกเลิก",
    });

    // หากผู้ใช้กดปุ่มยืนยัน
    if (confirmation.isConfirmed) {
      try {
        const response = await receptAPI.updateToQuotation(id);
        console.log(response);
        await Swal.fire({
          text: "ทำเป็นใบเสนอเรียบร้อยแล้ว",
          icon: "success",
        }).then(()=>{
          navigate(`/quotation-detail/${id}`)
        })
        
      } catch (error) {
        console.error("Error ", error);
      }
    }
  };

  return (
    <>
      <Navbaradmin></Navbaradmin>
      <div class="titlea  bg-white/60 py-1 shadow-md">
        <LuReceipt className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-9 xl:h-9 text-b-font"></LuReceipt>
        <h5 className=" inline-block text-lg md:text-xl xl:text-2xl text-b-font  pl-4 p-2 my-1">
          ใบแจ้งหนี้
        </h5>
      </div>
      <p className="text-base text-gray-700 mt-[40px] ml-[10px]">
        เรียนคุณ : {data.fullname}
      </p>
      <p className="text-base text-gray-700 mt-[10px] ml-[10px]">
        เรื่อง : {data.subject}
      </p>
      <p className="text-base text-gray-700 mt-[10px] ml-[10px]">
        ที่อยู่ : {data.address}
      </p>
      <p className="text-base text-gray-700 mt-[10px] ml-[10px]">
        วันที่ : {data.createdAt}
      </p>
      <p className="text-base text-gray-700 mt-[10px] ml-[10px]">
        วันที่ส่งมอบ : {data.deliveryDate}
      </p>
      <div class="flex flex-col overflow-x-auto">
        <div class="sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div class="overflow-x-auto">
              <table class="min-w-full text-left text-sm font-light">
                <thead class="border-b font-medium dark:border-neutral-500">
                  <tr>
                    {TABLE_HEAD.map((head) => (
                      <th
                        key={head}
                        scope="col"
                        className="px-6 py-4 border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-base text-center text-gray-700"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {data.rows &&
                    data.rows.map((row, index) => (
                      <tr key={index} className="border-b dark:border-neutral-500">
                        <td className="p-2 border text-center border-blue-gray-50 text-gray-700">
                          <p class="text-gray-700 text-center">{index + 1}</p>
                        </td>
                        <td className="p-2 border text-center border-blue-gray-50 text-gray-700">
                          {row.list}
                        </td>
                        <td className="p-2 border text-center border-blue-gray-50 text-gray-700">
                          {row.p_type}
                        </td>
                        <td className="p-2 border text-left border-blue-gray-50 text-gray-700">
                          <div className="whitespace-pre-wrap">
                            {row.detail}
                          </div>
                        </td>
                        <td className="p-2 border text-center border-blue-gray-50 text-gray-700">
                          {row.width}
                        </td>
                        <td className="p-2 border text-center border-blue-gray-50 text-gray-700">
                          {row.counts}
                        </td>
                        <td className="p-2 border text-center border-blue-gray-50 text-gray-700">
                          {row.unitprice}
                        </td>
                        <td className="p-2 border text-center border-blue-gray-50 text-gray-700">
                          {row.p_width}
                        </td>
                        <td className="p-2 border text-center border-blue-gray-50 text-gray-700">
                          {numberWithCommas(row.total_m || 0)}
                        </td>
                      </tr>
                    ))}
                </tbody>
                <p class="text-gray-700 mt-2 text-sm text-center">
                  ราคารวม : {numberWithCommas(data.totalPrice || 0)} บาท{" "}
                </p>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className=" flex-row w-full flex justify-center">
        <button
          onClick={() => generatePDF(data, data.rows)}
          className="bg-brown-300 mt-3 mx-2 py-1 px-auto w-[180px] rounded-full shadow-xl hover:bg-brown-200 text-center md:mt-3 md:mb-3 md:inline-blocktext-sm sm:text-xs md:text-xs lg:text-base xl:text-base  text-white"
        >
          พิมพ์ใบแจ้งหนี้
        </button>{" "}
        <button
          onClick={() => handleSwitchtoQuotation(data._id, data.fullname)}
          className="bg-red-300 mt-3 mx-2 py-1 px-auto w-[180px] rounded-full shadow-xl hover:bg-red-200 text-center md:mt-3 md:mb-3 md:inline-blocktext-sm sm:text-xs md:text-xs lg:text-base xl:text-base  text-white"
        >
          ทำเป็นใบเสนอ
        </button>
      </div>
    </>
  );
}
export default ReceptInvoiceDetail;
