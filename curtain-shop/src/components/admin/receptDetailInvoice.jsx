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
import { Link, useParams, useLocation } from "react-router-dom";
// import PDFQuotation from "./PDFQuotation"; // Import PDFDocument component
import jsPDF from "jspdf";

const TABLE_HEAD = [
  "ลำดับ",
  "รายการ",
  "เพิ่มเติม",
  "ขนาด",
  "จำนวน",
  "ราคาต่อหน่วย",
  "ความกว้างหน้าผ้า",
  "รวม",
];

function ReceptInvoiceDetail() {
  const { id } = useParams();

  const [data, setData] = useState({});
  console.log("id quatation", id);

  useEffect(() => {
    receptAPI
      .getReceptById(id)
      .then((data) => {
        setData(data);
      })
      .catch((err) => {
        console.error("error", err);
      });
  }, []);

  console.log(data);

  const generatePDF = () => {
    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Add content to the PDF
    doc.text("ใบเสนอราคา", 105, 15, { align: "center" });

    // Add customer information
    doc.text(`เรียนคุณ: ${data.fullname}`, 20, 30);
    doc.text(`เรื่อง: ${data.subject}`, 20, 40);
    doc.text(`ที่อยู่: ${data.address}`, 20, 50);
    doc.text(`วันที่: ${data.createdAt}`, 20, 60);
    doc.text(`วันที่ส่งมอบ: ${data.deliveryDate}`, 20, 70);

    // Add table headers
    doc.text(TABLE_HEAD.join(", "), 20, 90);

    // Add table data
    data.rows.forEach((row, index) => {
      doc.text(
        `${index + 1}, ${row.list}, ${row.detail}, ${row.width}, ${
          row.counts
        }, ${row.unitprice}, ${row.p_width}, ${row.total_m}`,
        20,
        100 + index * 10
      );
    });

    // Add total price
    doc.text(
      `ราคารวม : ${numberWithCommas(data.totalPrice || 0)} บาท`,
      20,
      120 + data.rows.length * 10
    );

    // Add signature area
    doc.rect(105, 160 + data.rows.length * 10, 90, 40);
    doc.text("ลายเซ็น", 150, 175 + data.rows.length * 10);

    // Add shop name
    doc.text("ชื่อร้านค้า: Your Shop Name", 20, 220 + data.rows.length * 10);

    // Save the PDF
    doc.save("quotation.pdf");
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
        });
        window.location.reload();
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
          onClick={generatePDF}
          className="bg-brown-300 mt-3 mx-2 py-1 px-auto w-[180px] rounded-full shadow-xl hover:bg-brown-200 text-center md:mt-3 md:mb-3 md:inline-blocktext-sm sm:text-xs md:text-xs lg:text-base xl:text-base  text-white"
        >
          พิมพ์ใบเสนอราคา
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
