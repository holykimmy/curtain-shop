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
import { Link, useParams, useLocation,useNavigate } from "react-router-dom";
// import PDFQuotation from "./PDFQuotation"; // Import PDFDocument component
import jsPDF from "jspdf";
import "jspdf-autotable";

// ดาวน์โหลดฟอนต์ภาษาไทย หรือใช้ฟอนต์ที่มีอยู่ในโปรเจคของคุณ
import { font } from "../../font/THSarabun.js";

const TABLE_HEAD = [
  "ลำดับ",
  "รายการ",
  "ประเภท",
  "เพิ่มเติม",
  "ขนาด",
  "ราคา/หลา",
  "ความกว้างหน้าผ้า",
  "จำนวน",
  "รวม"
];

function ReceptQuotationDetail() {
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
    // คำนวณความกว้างของข้อความ "ใบเสนอราคา"
    const textWidth1 = doc.getTextWidth("ใบเสนอราคา");
    // คำนวณความกว้างของข้อความ "Quotation"
    const textWidth2 = doc.getTextWidth("Quotation");

    // คำนวณความกว้างของข้อความทั้งหมด
    const totalTextWidth = Math.max(textWidth1, textWidth2);

    // คำนวณค่า x เพื่อจัดให้อยู่ตรงกับด้านซ้าย
    const xCoordinate = 20;

    // คำนวณค่า y เพื่อย้ายกล่องขึ้นไปด้านบน
    const yCoordinate = 15;

    // กำหนดตัวอักษรให้เป็นตัวหนาสำหรับ "ใบเสนอราคา"
    // เขียนข้อความ "ใบเสนอราคา" พร้อมพื้นหลังสีเทาและ padding
    doc.setFillColor(220);
    doc.rect(xCoordinate, 25 - yCoordinate, totalTextWidth + 20, 20, "F"); // ปรับความสูงเป็น 20 และเพิ่ม padding 10 ทั้งสองข้าง
    doc.setTextColor(0);

    doc.text(
      "ใบเสนอราคา",
      xCoordinate + (totalTextWidth + 20) / 2,
      33 - yCoordinate,
      {
        align: "center"
      }
    ); // ปรับ xCoordinate และ yCoordinate เพื่อให้ข้อความอยู่ตรงกลาง

    // กำหนดตัวอักษรให้เป็นปกติสำหรับ "Quotation"
    doc.text(
      "Quotation",
      xCoordinate + (totalTextWidth + 20) / 2,
      41 - yCoordinate,
      {
        align: "center"
      }
    ); // ปรับ xCoordinate และ yCoordinate เพื่อให้ข้อความอยู่ตรงกลาง

    // ข้อมูลลูกค้า
    doc.setFontSize(14);
    doc.text(`เรียน: ${data.fullname}`, 15, 38);
    doc.text(`เรื่อง: ${data.subject}`, 15, 46);
    doc.text(`ที่อยู่: ${data.address}`, 15, 54);
    // doc.text(`วันที่: ${data.createdAt}`, 50, 38);
    doc.text(`วันที่: ${data.createdAt}`, 100, 38);

    // คำนวณความกว้างของข้อความ "ร้านเจริญกิจผ้าม่าน"
    const textWidth4 = doc.getTextWidth("ร้านเจริญกิจผ้าม่าน");
    // คำนวณความกว้างของข้อความ "2/562 ม.18 ซ.ธนะศรี ต.คูคต อ.ลำลูกกา"
    const textWidth5 = doc.getTextWidth("2/562 ม.18 ซ.ธนะศรี ต.คูคต อ.ลำลูกกา");
    // คำนวณความกว้างของข้อความ "จ.ปทุมธานี 12130 โทร. 0879700514"
    const textWidth6 = doc.getTextWidth("จ.ปทุมธานี 12130 โทร. 0879700514");

    // คำนวณค่า x-coordinate ใหม่โดยใช้ความกว้างของหน้ากระดาษ
    const xCoordinateRight =
      doc.internal.pageSize.width -
      Math.max(textWidth4, textWidth5, textWidth6) +
      38;

    // แสดงข้อความ "ร้านเจริญกิจผ้าม่าน" และข้อความอื่นๆ โดยกำหนดตำแหน่ง x-coordinate ใหม่
    doc.text("ร้านเจริญกิจผ้าม่าน", xCoordinateRight, 18, {
      align: "right"
    });
    doc.text("2/562 ม.18 ซ.ธนะศรี ต.คูคต อ.ลำลูกกา", xCoordinateRight, 24, {
      align: "right"
    });
    doc.text("จ.ปทุมธานี 12130 โทร. 0879700514", xCoordinateRight, 30, {
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
        `${row.unitprice} บาท`,
        `${row.p_width} ซม.`,
        `${row.counts} `,
        `${numberWithCommas(row.total_m || 0)} บาท`
      ]),

      headStyles: {
        fillColor: [217, 217, 217], // กำหนดสีเทาในรูปแบบ RGB
        textColor: [10, 10, 16]
      },

      styles: {
        fontSize: 14, // กำหนดขนาดฟอนต์ใหญ่ขึ้นเป็น 14
        font: thaiFont // ใช้ Thai font
      },

      didDrawCell: (data) => {
        // Adjust text style for Thai font
        doc.setFontSize(14);
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
    doc.text(
      "**ทางร้านเจริญกิจหวังเป็นอย่างยิ่งว่าคงจะได้รับการพิจารณา",
      16,
      totalPriceY - 5
    );

    doc.setFontSize(14);
    doc.text(
      `ราคารวม ${numberWithCommas(data.totalPrice || 0)} บาท`,
      xCoordinateRight +
        32 -
        doc.getTextWidth(
          `ราคารวม ${numberWithCommas(data.totalPrice || 0)} บาท`
        ),
      totalPriceY + 4,
      {
        align: "right"
      }
    );

    // กำหนดขนาดและตำแหน่งเริ่มต้นของกล่อง
    const boxWidth = 54;
    const boxHeight = 40;
    const marginLeft = 15;
    const marginRight = 15;
    const marginTop = 230;
    const marginBottom = 15;
    const gap = 8;
    const startX = marginLeft;
    const startY2 = marginTop;

    // สร้างกล่องแรก
    doc.rect(startX, startY2, boxWidth, boxHeight);
    doc.text("ลงชื่อผู้อนุมัติ", startX + boxWidth / 2, startY2 + 10, {
      align: "center"
    });
    doc.text(".........................", startX + boxWidth / 2, startY2 + 20, {
      align: "center"
    });
    doc.text(
      "วันที่......./......./.......",
      startX + boxWidth / 2,
      startY2 + 30,
      { align: "center" }
    );

    // สร้างกล่องที่สอง
    const secondBoxX = startX + boxWidth + gap;
    doc.rect(secondBoxX, startY2, boxWidth, boxHeight);
    doc.text(
      "กำหนดส่งมอบงาน/ติดตั้ง",
      secondBoxX + boxWidth / 2,
      startY2 + 10,
      { align: "center" }
    );
    doc.text(
      `วันที่ ${data.deliveryDate}`,
      secondBoxX + boxWidth / 2,
      startY2 + 20,
      { align: "center" }
    );

    // สร้างกล่องที่สาม
    const thirdBoxX = secondBoxX + boxWidth + gap;
    doc.rect(thirdBoxX, startY2, boxWidth, boxHeight);
    doc.text("ขอแสดงความนับถือ", thirdBoxX + boxWidth / 2, startY2 + 10, {
      align: "center"
    });
    doc.text("...................", thirdBoxX + boxWidth / 2, startY2 + 20, {
      align: "center"
    });
    doc.text(
      "(นางเบ็ญจา ฤทธี ผู้จัดการ)",
      thirdBoxX + boxWidth / 2,
      startY2 + 30,
      { align: "center" }
    );

    // บันทึกเป็น PDF
    doc.save(`ใบเสนอราคา-${data.fullname}`);
  };

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleSwitchtoInvoice = async (id, fullname) => {
    // แสดงข้อความยืนยันจากผู้ใช้ก่อนที่จะทำการยกเลิกคำสั่งซื้อ
    const confirmation = await Swal.fire({
      text: `ทำให้ใบเสนอราคาของคุณ ${fullname}เป็นใบแจ้งหนี้ใช่หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่",
      cancelButtonText: "ยกเลิก"
    });

    // หากผู้ใช้กดปุ่มยืนยัน
    if (confirmation.isConfirmed) {
      try {
        const response = await receptAPI.updateToInvoice(id);
        console.log(response);
        await Swal.fire({
          text: "ทำเป็นใบแจ้งหนี้เรียบร้อยแล้ว",
          icon: "success"
        }).then(()=>{
          navigate(`/invoice-detail/${id}`)
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
          ใบเสนอราคา
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
                        class="px-6 py-4 border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-base text-center text-gray-700"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {data.rows &&
                    data.rows.map((row, index) => (
                      <tr key={index} class="border-b dark:border-neutral-500">
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
                          {row.width} x {row.height} ซม.
                        </td>

                        <td className="p-2 border text-center border-blue-gray-50 text-gray-700">
                          {row.unitprice} บาท
                        </td>
                        <td className="p-2 border text-center border-blue-gray-50 text-gray-700">
                          {row.p_width} ซม.
                        </td>
                        <td className="p-2 border text-center border-blue-gray-50 text-gray-700">
                          {row.counts}
                        </td>
                        <td className="p-2 border text-center border-blue-gray-50 text-gray-700">
                          {numberWithCommas(row.total_m || 0)} บาท
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
          // onClick={generatePDF}
          onClick={() => generatePDF(data, data.rows)}
          className="bg-brown-300 mt-3 mx-2 py-1 px-auto w-[180px] rounded-full shadow-xl hover:bg-brown-200 text-center md:mt-3 md:mb-3 md:inline-blocktext-sm sm:text-xs md:text-xs lg:text-base xl:text-base  text-white"
        >
          พิมพ์ใบเสนอราคา
        </button>{" "}
        <button
          onClick={() => handleSwitchtoInvoice(data._id, data.fullname)}
          className="bg-red-300 mt-3 mx-2 py-1 px-auto w-[180px] rounded-full shadow-xl hover:bg-red-200 text-center md:mt-3 md:mb-3 md:inline-blocktext-sm sm:text-xs md:text-xs lg:text-base xl:text-base  text-white"
        >
          ทำเป็นใบแจ้งหนี้
        </button>
      </div>
    </>
  );
}
export default ReceptQuotationDetail;
