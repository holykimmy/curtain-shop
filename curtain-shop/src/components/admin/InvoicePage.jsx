import React, { useState } from "react";
import Navbaradmin from "./Navbaradmin";
import { LuReceipt, LuFileClock } from "react-icons/lu";
import "../../App.css";
import { Card } from "@material-tailwind/react";
import CreatableSelect from "react-select/creatable";
import type { DatePickerProps } from "antd";
import { DatePicker, Space } from "antd";

const TABLE_HEAD = ["ลำดับ", "รายการ", "จำนวน", "ราคาต่อหน่วย", "จำนวนเงิน"];

const classes = "p-4 border-b border-blue-gray-50 text-gray-500";

function QuotationPage() {
  //append
  const [rows, setRows] = useState([
    {
      no: "1",
      list: "Manager",
      quantity: "5",
      unitprice: "5",
      total_m: "50",
    },
  ]);

  const [quantities, setQuantities] = useState([5]); // An array to store each row's quantity
  const handleAppendRow = () => {
    const newRow = {
      no: String(rows.length + 1), // Generate a unique number for the new row
      list: "",
      quantity: "0", // Initialize to 0 or any default value
      unitprice: "",
      total_m: "",
    };

    setRows([...rows, newRow]);
    setQuantities([...quantities, 0]); // Initialize quantity for the new row
  };
  //append

  //quantities
  const handleInputChange = (index, key, value) => {
    const updatedRows = [...rows];
    updatedRows[index][key] = value;
    setRows(updatedRows);
  };

  const handleQuantityChange = (index, value) => {
    const updatedQuantities = [...quantities];
    updatedQuantities[index] = value;
    setQuantities(updatedQuantities);
  };
  //quantities

  //inputsearch name
  const [options, setOptions] = useState([
    {
      fname: "Kimmy",
      lname: "Test",
      label: "Kimmy Test",
      subject: "การติดตั้ง",
      address: "the regent home 202",
    },
    {
      fname: "Pla",
      lname: "Test2",
      label: "Pla Test2",
      subject: "รายการสั่งซื้อ",
      address: "the line 506",
    },
    // ...other initial options
  ]);

  const [selectedOptions, setSelectedOptions] = useState([
    {
      fname: "",
      lname: "",
      label: "",
      subject: "",
      address: "",
    },
  ]);

  //options selected
  const handleSelectChange = (index, newValue) => {
    handleInputChange(index, "list", newValue.label); 
    // Handle additional fields
    handleInputChange(index, "subject", newValue.subject);
    handleInputChange(index, "address", newValue.address);// Assuming 'list' is the key you want to update

    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions[index].fname = newValue.fname;
    updatedSelectedOptions[index].lname = newValue.lname;
    updatedSelectedOptions[index].label = newValue.label;
    updatedSelectedOptions[index].subject = newValue.subject;
    updatedSelectedOptions[index].address = newValue.address;
    setSelectedOptions(updatedSelectedOptions);
  };

  const handleCreateOption = (inputValue, index) => {
    const names = inputValue.split(" ");
    const fname = names[0];
    const lname = names.slice(1).join(" ");
    const newOption = { fname, lname, label: inputValue };
    setOptions([...options, newOption]);

    // handleInputChange(selectedOptions.length - 1, "label", inputValue);
    handleInputChange(index, "list", inputValue);
    handleInputChange(index, "subject", "");
    handleInputChange(index, "address", "");

    // setSelectedOptions([
    //   ...selectedOptions.slice(0, selectedOptions.length - 1),
    //   { fname, lname, label: inputValue , subject: "", address: ""  },
    // ]);
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions[index] = newOption;
    setSelectedOptions(updatedSelectedOptions);
  };
  //options selected
  //inputsearch name

  //date
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
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

        <form class="mt-8">
          <label className="ml-7 text-xl text-b-font">เรียนคุณ...</label>
          {selectedOptions.map((row, index) => (
            <div key={index} className="w-64 ml-5">
              <CreatableSelect
                options={options}
                onChange={(newValue) => handleSelectChange(index, newValue)}
                onCreateOption={(inputValue) =>
                  handleCreateOption(inputValue, index)
                }
                value={options.find((option) => option.label === row.label)}
                isSearchable={true}
                placeholder=""
              />
              {/* {row.value && (
                <div className="mt-2 text-gray-500"> {row.value}</div>
              )} */}
            </div>
          ))}

          <div class="h-5"></div>
          <label className="ml-7 text-xl text-b-font">เรื่อง...</label>
          {selectedOptions.map((row, index) => (
            <div key={index} className="w-64 ml-5">
              <CreatableSelect
                options={options}
                onChange={(newValue) => handleSelectChange(index, newValue)}
                onCreateOption={(inputValue) =>
                  handleCreateOption(inputValue, index)
                }
                value={options.find((option) => option.subject === row.subject)}
                isSearchable={true}
                placeholder=""
              />
              {/* {row.value && (
                <div className="mt-2 text-gray-500"> {row.value}</div>
              )} */}
            </div>
          ))}
          <div className="w-64 ml-5"></div>
          <div class="h-5"></div>
          <label className="ml-7 text-xl text-b-font">ที่อยู่...</label>
          {selectedOptions.map((row, index) => (
            <div key={index} className="w-64 ml-5">
              <CreatableSelect
                options={options}
                onChange={(newValue) => handleSelectChange(index, newValue)}
                onCreateOption={(inputValue) =>
                  handleCreateOption(inputValue, index)
                }
                value={options.find((option) => option.address === row.address)}
                isSearchable={true}
                placeholder=""
              />
              {/* {row.value && (
                <div className="mt-2 text-gray-500"> {row.value}</div>
              )} */}
            </div>
          ))}
          <div className="w-64 ml-5"></div>

          <div class="h-5"></div>
          <label className="ml-7 mr-7 text-xl text-b-font">
            วันที่ต้องการส่งมอบ
          </label>

          <Space direction="vertical">
            <DatePicker onChange={onChange} />
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
                            // className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-center"
                            scope="col"
                            class="px-6 py-4 border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-base text-center text-gray-700"
                          >
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {rows.map((row, index) => (
                        // const isLast = index === TABLE_ROWS.length - 1;

                        <tr
                          class="border-b dark:border-neutral-500"
                          key={index}
                        >
                          <td class={classes}>
                            <p class="text-gray-500 text-center">{index + 1}</p>
                          </td>
                          <td class={classes}>
                            <select
                              class=" border-gray-300 rounded w-[200px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              type="text"
                              name="list"
                              value={row.list}
                              onChange={(e) =>
                                handleInputChange(index, "list", e.target.value)
                              }
                            >
                              <option>{row.list}</option>
                              <option>Yes</option>
                              <option>No</option>
                              <option>Maybe</option>
                            </select>
                          </td>
                          <td class={classes}>
                            <div className="flex">
                              <button
                                type="button"
                                className="px-3 py-2 bg-gray-300 rounded-l text-gray-700 focus:outline-none focus:shadow-outline"
                                onClick={() =>
                                  handleQuantityChange(
                                    index,
                                    Math.max(0, quantities[index] - 1)
                                  )
                                }
                              >
                                -
                              </button>
                              <input
                                className="border border-gray-300 w-[50px] md:w-full text-center py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="number"
                                id={`quantity-${index}`}
                                name={`quantity-${index}`}
                                value={quantities[index]}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    index,
                                    parseInt(e.target.value)
                                  )
                                }
                              />
                              <button
                                type="button"
                                className="px-3 py-2 bg-gray-300 rounded-r text-gray-700 focus:outline-none focus:shadow-outline"
                                onClick={() =>
                                  handleQuantityChange(
                                    index,
                                    quantities[index] + 1
                                  )
                                }
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td class={classes}>
                            <div class="flex flex-row w-[150px] border-gray-300 p-auto m-auto justify-between">
                              <input
                                class="basis-1/2  border-gray-300 rounded w-[75px]  py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="unitprice"
                                type="float"
                                value={row.unitprice}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "unitprice",
                                    e.target.value
                                  )
                                }
                                placeholder="0.00"
                              ></input>
                              <span class="basis-1/2 text-gray-500 items-center m-auto">
                                หน่วย/บาท
                              </span>
                            </div>
                          </td>
                          <td class={classes}>
                            <div class="flex flex-row w-[100px] border-gray-300 p-auto m-auto justify-between">
                              <input
                                class="basis-1/2  border-gray-300 rounded w-[75px] py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="total_m"
                                type="float"
                                name="total_m"
                                value={row.total_m}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "total_m",
                                    e.target.value
                                  )
                                }
                                placeholder="0.00"
                              ></input>
                              <span class="basis-1/2 text-gray-500 items-center m-auto">
                                บาท
                              </span>
                            </div>
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
export default QuotationPage;
