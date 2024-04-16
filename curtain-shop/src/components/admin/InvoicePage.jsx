import React, { useState, useEffect } from "react";
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
import typeAPI from "../../services/typeAPI";

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

const classes = "p-4 border-b border-blue-gray-50 text-gray-500";

function QuatationPage() {
  //append
  const [rows, setRows] = useState([
    {
      list: "",
      p_type: "",
      rail: "",
      detail: "",
      counts: 0,
      width: 0,
      height: 0,
      unitprice: 0,
      p_width: 0,
      price_rail: 0,
      total_m: 0
    }
  ]);

  // คำนวณ totalPrice
  const totalPrice = rows.reduce((accumulator, currentRow) => {
    // แปลงค่า total_m จาก string เป็น number แล้วบวกเพิ่มใน accumulator
    return accumulator + parseFloat(currentRow.total_m || 0);
  }, 0); // กำหนดค่าเริ่มต้นให้ accumulator เป็น 0

  const [state, setState] = useState({
    fullname: "",
    subject: "",
    address: "",
    totalPrice: 0
  });

  const [data, setData] = useState([]);
  const { fullname, subject, address, count, product } = state;
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

  const [types, setTypes] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const type = await typeAPI.getAllTypes();
        setTypes(type);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching all brands:", error);
        setIsLoading(false);
      }
    };
    fetch();
  }, []);
  console.log(types);

  const inputValue = (name) => (event) => {
    const value = event.target.value;
    console.log(name, "=", value);
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAppendRow = () => {
    const newRow = {
      list: "",
      p_type: "",
      rail: "",
      detail: "",
      counts: 0,
      width: 0,
      height: 0,
      unitprice: 0,
      p_width: 0,
      price_rail: 0,
      total_m: 0
    };
    setRows([...rows, newRow]);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };

  useEffect(() => {
    const fetchData = () => {
      productAPI
        .getAllProducts()
        .then((products) => {
          setData(products);
        })
        .catch((err) => {
          console.error("error", err);
        });
    };
    fetchData();
  }, []);

  console.log("tesjgfahj");
  console.log(data);

  const handleInputChange = (index, name, value) => {
    if (index < rows.length) {
      const updatedRows = [...rows];
      updatedRows[index][name] = value;

      if (name === "p_type") {
        updatedRows[index].type = value.toString();
      }

      const selectedProduct = data.find((product) => product.name === value);
      if (selectedProduct) {
        updatedRows[index].unitprice = selectedProduct.price || 0;
        updatedRows[index].p_width = selectedProduct.p_width || 0;
      }

      const selectedType = types.find((atype) => atype.name === value);
      if (selectedType) {
        updatedRows[index].price_rail = selectedType.price_rail || 0;
      }

      setRows(updatedRows);
      calculateTotalPrice(
        index,
        updatedRows[index].rail,
        updatedRows[index].price_rail,
        updatedRows[index].width,
        updatedRows[index].height,
        updatedRows[index].counts
      );
    }
  };

  const handleUpdateChangeRail = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].rail = value; // อัปเดตค่า width ใน index ที่กำหนด
    setRows(updatedRows); // อัปเดต state ของ rows
    calculateTotalPrice(
      index,
      value,
      updatedRows[index].price_rail,
      updatedRows[index].width,
      updatedRows[index].height,
      updatedRows[index].counts
    );
  };

  const handleDetailChange = (index, value) => {
    const updatedRows = [...rows]; // สร้างคัดลอกของ rows
    updatedRows[index].detail = value; // อัปเดตค่า width ใน index ที่กำหนด
    setRows(updatedRows); // อัปเดต state ของ rows
  };

  const handleWidthChange = (index, value) => {
    const updatedRows = [...rows]; // สร้างคัดลอกของ rows
    updatedRows[index].width = value; // อัปเดตค่า width ใน index ที่กำหนด
    setRows(updatedRows); // อัปเดต state ของ rows

    calculateTotalPrice(
      index,
      updatedRows[index].rail,
      updatedRows[index].price_rail,
      value,
      updatedRows[index].height,
      updatedRows[index].counts
    );
  };

  const handleHeightChange = (index, value) => {
    const updatedRows = [...rows]; // สร้างคัดลอกของ rows
    updatedRows[index].height = value; // อัปเดตค่า height ใน index ที่กำหนด
    setRows(updatedRows); // อัปเดต state ของ rows

    calculateTotalPrice(
      index,
      updatedRows[index].rail,
      updatedRows[index].price_rail,
      updatedRows[index].width,
      value,
      updatedRows[index].counts
    );
  };

  const handleCountChange = (index, value) => {
    const updatedRows = [...rows]; // สร้างคัดลอกของ rows
    updatedRows[index].counts = value; // อัปเดตค่า counts ใน index ที่กำหนด
    setRows(updatedRows); // อัปเดต state ของ rows

    // เรียกใช้ฟังก์ชันที่คำนวณราคารวม
    calculateTotalPrice(
      index,
      updatedRows[index].rail,
      updatedRows[index].price_rail,
      updatedRows[index].width,
      updatedRows[index].height,
      value
    );
  };

  const calculateTotalPrice = (
    index,
    rail,
    price_rail,
    width,
    height,
    counts
  ) => {
    console.log(index, rail, price_rail, width, height, counts);
    const selectedProduct = data.find(
      (product) => product.name === rows[index].list
    );
    const selectedType = types.find((type) => type.name === rows[index].type);

    if (selectedProduct && selectedType) {
      // คำนวณจำนวนผ้าทั้งหมด
      const totalFabric = Math.ceil(width / selectedProduct.p_width) * 2;

      // คำนวณราคาผ้าต่อชิ้น
      const fabricCostPerPiece =
        (height * totalFabric * selectedProduct.price) / 100;

      // คำนวณราคารวมของผ้า
      let totalFabricPrice = fabricCostPerPiece * counts;

      // คำนวณราคาราง
      let railPrice = 0;
      if (rail === "รับราง") {
        railPrice = (selectedType.price_rail * width) / 100;
      }

      // รวมราคารางและราคาผ้าเข้าด้วยกัน
      const totalPrice = totalFabricPrice + railPrice;

      const updatedRows = [...rows];
      updatedRows[index].total_m = totalPrice.toFixed(2);
      setRows(updatedRows);
    }
  };

  //date
  const [deliveryDate, setDeliveryDate] = useState(null);

  const onChangeDeliveryDate = (date, dateString) => {
    console.log(date, dateString);
    setDeliveryDate(date);
  };

  function disabledDate(current) {
    return current && current < moment().endOf("day");
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!fullname) {
      Swal.fire({
        icon: "error",
        text: "กรุณากรอก ชื่อ-นามสกุล"
      });
      return;
    } else if (!subject) {
      Swal.fire({
        icon: "error",
        text: "กรุณาระบุเรื่องที่จะเสนอ"
      });
    } else if (!address) {
      Swal.fire({
        icon: "error",
        text: "กรุณาระบุที่อยู่"
      });
      return;
    } else if (!deliveryDate) {
      Swal.fire({ icon: "error", text: "กรุณาเลือกวันที่" });
      return;
    } else if (!rows) {
      Swal.fire({ icon: "error", text: "กรุณากรอกข้อมูลที่ต้องการบันทึก" });
      return;
    } else if (
      !rows.every(
        (row) =>
          row.list &&
          row.type &&
          row.rail &&
          row.detail &&
          row.counts &&
          row.width &&
          row.height &&
          row.unitprice &&
          row.p_width &&
          row.price_rail &&
          row.total_m
      )
    ) {
      Swal.fire({ icon: "error", text: "กรุณากรอกข้อมูลที่ต้องการบันทึก" });
      return;
    }

    const formData = {
      fullname,
      subject,
      address,
      rows,
      deliveryDate: deliveryDate ? deliveryDate.format("YYYY-MM-DD") : null,
      totalPrice: totalPrice.toFixed(2)
    };
    console.log(formData);
    receptAPI
      .createInvoice(formData)
      .then((response) => {
        Swal.fire({
          text: "save",
          icon: "success"
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          text: err.response.data.error
        });
      });
  };

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <>
      <Navbaradmin></Navbaradmin>
      <div class="flex-col justify-center items-center p-auto  pt-2 md:pt-2">
        <div class="titlea  bg-white/60 py-1 shadow-md">
          <LuReceipt className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-9 xl:h-9 text-b-font"></LuReceipt>
          <h5 className=" inline-block text-lg md:text-xl xl:text-2xl text-b-font  pl-4 p-2 my-1">
            ใบแจ้งหนี้
          </h5>
        </div>

        <form onSubmit={handleSubmit} class="mt-8">
          <label className="ml-7 text-sm md:text-lg text-b-font">
            เรียนคุณ...
          </label>
          <div>
            {" "}
            <input
              class="appearance-none ml-5 w-64 border-gray-300 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="fullname"
              type="text"
              value={fullname}
              onChange={inputValue("fullname")}
              placeholder="ชื่อ-นามสกุล"
            />
          </div>

          <div class="h-5"></div>
          <label className="ml-7 text-sm md:text-lg text-b-font">
            เรื่อง...
          </label>
          <div>
            {" "}
            <input
              class="appearance-none ml-5 w-64 border-gray-300 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="subject"
              type="text"
              value={subject}
              onChange={inputValue("subject")}
              placeholder="ex. การสั่งตัดผ้าม่าน"
            />
          </div>
          <div className="w-64 ml-5"></div>
          <div class="h-5"></div>
          <label className="ml-7 text-sm md:text-lg text-b-font">
            ที่อยู่...
          </label>
          <div>
            {" "}
            <input
              class="appearance-none ml-5 w-64 border-gray-300 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="subject"
              type="text"
              value={address}
              onChange={inputValue("address")}
              placeholder="ที่อยู่..."
            />
          </div>
          <div className="w-64 ml-5"></div>

          <div class="h-5"></div>
          <label className="ml-7 mr-7 text-sm md:text-lg text-b-font">
            วันที่ต้องการส่งมอบ
          </label>

          <Space direction="vertical">
            <DatePicker
              onChange={onChangeDeliveryDate}
              disabledDate={disabledDate}
            />
          </Space>

          <div className="w-64 ml-5"></div>

          {/* table */}
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
                            class="px-6 py-4 border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-xs md:text-base text-center text-gray-700"
                          >
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {rows.map((row, index) => (
                        <tr
                          class="border-b dark:border-neutral-500"
                          key={index}
                        >
                          <td class={classes}>
                            <p class="text-gray-500 text-center">{index + 1}</p>
                          </td>
                          <td class={classes}>
                            <select
                              class="border-gray-300 text-xs md:text-base rounded w-[150px] md:w-[200px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              type="text"
                              name="list"
                              value={row.list}
                              onChange={(e) =>
                                handleInputChange(index, "list", e.target.value)
                              }
                            >
                              <option value="">กรุณาเลือกสินค้า</option>
                              {data.map((item) => (
                                <option key={item._id} value={item.name}>
                                  {item.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td class={classes}>
                            <select
                              class="border-gray-300 rounded text-xs md:text-base w-[150px] md:w-[200px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              type="text"
                              name="p_type"
                              value={row.p_type}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "p_type",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">เลือกประเภทที่การตัด</option>
                              {types.map((item) => (
                                <option key={item._id} value={item.name}>
                                  {item.name}
                                </option>
                              ))}
                            </select>
                          </td>

                          <td class={classes}>
                            <select
                              class="border-gray-300 rounded text-xs md:text-base py-2 px-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              value={rows.rail}
                              onChange={(e) =>
                                handleUpdateChangeRail(index, e.target.value)
                              }
                            >
                              <option value="">รับรางหรือไม่</option>
                              {["รับราง", "ไม่รับราง"].map((rail) => (
                                <option key={rail} value={rail}>
                                  {rail}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td class={classes}>
                            <div className="flex">
                              <textarea
                                className="border mx-1 rounded text-xs md:text-base  border-gray-300 md:w-[250px] text-left py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="text"
                                id={`detail-${index}`}
                                name={`detail-${index}`}
                                value={row.detail}
                                onChange={(e) =>
                                  handleDetailChange(index, e.target.value)
                                }
                              />
                            </div>
                          </td>

                          <td class={classes}>
                            <div className="flex">
                              <input
                                className="border mx-1 rounded text-xs md:text-base border-gray-300 w-[80px] md:w-[90px] text-center py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="number"
                                id={`width-${index}`}
                                name={`width-${index}`}
                                value={row.width}
                                onChange={(e) =>
                                  handleWidthChange(index, e.target.value)
                                }
                              />
                              <input
                                className="border mx-1 text-xs md:text-base rounded border-gray-300 w-[80px] md:w-[90px] text-center py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="number"
                                id={`height-${index}`}
                                name={`height-${index}`}
                                value={row.height}
                                onChange={(e) =>
                                  handleHeightChange(index, e.target.value)
                                }
                              />{" "}
                              <span className="mt-2 ml-1">ซม.</span>
                            </div>
                          </td>

                          <td class={classes}>
                            <div className="flex ">
                              <input
                                className="border  text-xs md:text-base rounded border-gray-300 w-[75px]  text-center py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="number"
                                id={`counts-${index}`}
                                name={`counts-${index}`}
                                value={row.counts}
                                onChange={(e) =>
                                  handleCountChange(index, e.target.value)
                                }
                              />
                            </div>
                          </td>

                          <td class={classes}>
                            <div className="flex flex-row text-xs md:text-base w-[150px] border-gray-300 p-auto m-auto justify-between">
                              <p className="basis-1/2 rounded w-[75px] py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                {
                                  data.find(
                                    (product) => product.name === row.list
                                  )?.price
                                }
                              </p>
                              <span className="basis-1/2 text-xs md:text-base text-gray-500 items-center m-auto">
                                บาท
                              </span>
                            </div>
                          </td>
                          <td class={classes}>
                            <div class="flex flex-row w-[150px] text-xs md:text-base border-gray-300 p-auto m-auto justify-between">
                              <p class="basis-1/2 rounded w-[75px] py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                {
                                  data.find(
                                    (product) => product.name === row.list
                                  )?.p_width
                                }
                              </p>
                              <span class="basis-1/2 text-gray-500 items-center m-auto">
                                ซม.
                              </span>
                            </div>
                          </td>

                          <td class={classes}>
                            <div class="flex flex-row w-[150px] text-xs md:text-base border-gray-300 p-auto m-auto justify-between">
                              <p class="basis-1/2 rounded w-[75px] py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                {numberWithCommas(row.total_m)}
                              </p>
                              <span class="basis-1/2 text-gray-500 items-center m-auto">
                                บาท
                              </span>
                            </div>
                          </td>

                          <td class={classes}>
                            <button
                              onClick={() => handleDeleteRow(index)}
                              className="bg-red-400 hover:bg-red-300 p-2 rounded text-white text-xs md:text-base "
                            >
                              ลบ
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          {/* table */}

          <p className="text-gray-700 text-sm md:text-base m-6">
            {" "}
            ราคารวม : {numberWithCommas(totalPrice)} บาท{" "}
          </p>

          <div class="flex items-center justify-center">
            <button
              id="append"
              onClick={handleAppendRow}
              className="w-[80%] md:[20%] mt-10 bg-green-400 hover:bg-browntop text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              เพิ่มคอลั่ม
            </button>
          </div>

          <div class="flex items-center justify-center mt-5">
            <button
              class="w-[80%] md:[20%] bg-b-btn hover:bg-browntop text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              เพิ่มข้อมูล
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
export default QuatationPage;
