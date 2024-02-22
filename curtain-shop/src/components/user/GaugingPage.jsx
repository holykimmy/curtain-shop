import React from "react";
import Navbar from "../Navbar";
import { BsPinFill } from "react-icons/bs";
import g1 from "../img/g1.jpg";
import g2 from "../img/g2.jpg";
import g3 from "../img/g3.jpg";
import g4 from "../img/g4.jpg";
import g5 from "../img/g5.jpg";
import g6 from "../img/g6.jpg";
import Footer from "../Footer";

const features = [
    { name: 'Origin', description: 'Designed by Good Goods, Inc.' },
    { name: 'Material', description: 'Solid walnut base with rare earth magnets and powder coated steel card cover' },
    { name: 'Dimensions', description: '6.25" x 3.55" x 1.15"' },
    { name: 'Finish', description: 'Hand sanded and finished with natural oil' },
    { name: 'Includes', description: 'Wood card tray and 3 refill packs' },
    { name: 'Considerations', description: 'Made from natural materials. Grain and color vary with each item.' },
  ]
  
function ServicePage() {
  return (
    <>
      {" "}
      <div className="h-screen w-full bg-gradient-to-r from-5% from-white via-50% via-brown-bg to-90% to-white">
        <Navbar></Navbar>

        <div class="titlea  py-1 shadow-md">
          <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-9 xl:h-9 text-b-font"></BsPinFill>
          <h5 className=" inline-block text-lg md:text-xl xl:text-4xl text-b-font  pl-4 p-2 my-1">
            วิธีการวัดผ้าม่านแต่ละแบบ
          </h5>
        </div>

        <div className="bg-brown-blog ">
            <div className="mx-auto grid max-w-xl grid-cols-1 items-left gap-x-8 gap-y-16 px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:grid-cols-2 lg:px-8">
                <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">: ม่านจีบ ม่านตาไก่ และม่านลอน</h2>
                <div className="flex justify-center items-center ">
                    <p class="p-5 xl:text-2xl text-b-font text-lg"></p>
                </div>
                <p className="mt-4 text-3xl font-bold text-black-500">
                    1. เริ่มวัดจากความกว้างของหน้าต่างโดยวัดออกจากขอบวงกบมาประมาณ 10 - 20 ซม. หรือน้อยกว่าตามความเหมาะสมของหน้าต่าง
                </p>
                
                <p class="p-2 xl:text-xl text-b-font text-lg"></p>
                <p className="mt-4 text-3xl font-bold text-black-500">
                    2. ต่อมาวัดความสูงของหน้าต่างให้วัดออกจากขอบวงกบขึ้นไปประมาณ 10 ซม. หากต้องการให้ผ้าม่านยาวถึงพื้นให้วัดลอยออกจากพื้นประมาณ 2 ซม.
                </p>
                <p class="p-2 xl:text-xl text-b-font text-lg"></p>
                <p className="mt-4 text-3xl font-bold text-black-500">
                    3. หากต้องการให้ผ้าม่านคลุมหน้าต่างได้พอดี ให้วัดออกจากขอบวงกบขึ้นไปประมาณ 10 ซม. และเลยจากขอบวงกบล่างลงมา 15 - 20 ซม. หรือสั้นกว่าตามความเหมาะสม
                </p>
                <p class="p-2 xl:text-xl text-b-font text-lg"></p>
                <p className="mt-4 text-3xl font-bold text-black-500">
                    4. หากมีหน้าต่างรางหรือรางที่มีเชือกดึงติดตั้งอยู่แล้วให้วัดความกว้างโดยวัดปลายรางจากอีกด้านนึงไปสู่อีกด้านนึง ( ตัวอย่าง A ) ส่วนความสูงวัดที่ข้างบนของราง ( ตัวอย่าง B ) ลงมาถึงระดับความยาวที่ต้องการ
                </p>
                <p class="p-2 xl:text-xl text-b-font text-lg"></p>
                <p className="mt-4 text-3xl font-bold text-black-500">
                    5. หางเป็นรางโชว์หรือรางระดับให้วัดความกว้างเริ่มจากส่วนท้ายของหัวประดับจากด้านนึงไปอีกด้านนึง ( ตัวอย่าง A ) และเริ่มวัดจากความสูงใต้ราง ( ตัวอย่าง B ) 
                </p>

                <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
                </dl>
                </div>
                <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 lg:gap-8">
                <img
                    src={g1}
                    alt="Walnut card tray with white powder coated steel divider and 3 punchout holes."
                    className="rounded-lg bg-gray-100"
                />
                <img
                    src={g2}
                    alt="Top down view of walnut card tray with embedded magnets and card groove."
                    className="rounded-lg bg-gray-100"
                />
                <img
                    src={g3}
                    alt="Side of walnut card tray with card groove and recessed card area."
                    className="rounded-lg bg-gray-100"
                />
                <img
                    src={g4}
                    alt="Walnut card tray filled with cards and card angled in dedicated groove."
                    className="rounded-lg bg-gray-100"
                />
                
                </div>
            </div>
            </div>
          <div className="flex justify-center items-center ">
            <p class="p-5 xl:text-2xl text-b-font text-lg"></p>
          </div>
          <div className="bg-brown-blog ">
            <div className="mx-auto grid max-w-2xl grid-cols-1 items-left gap-x-8 gap-y-10 px-4 py-24 sm:px-4 sm:py-32 lg:max-w-7xl lg:grid-cols-2 lg:px-8">
                <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">: การวัดม่านพับ</h2>
                <div className="flex justify-center items-center ">
                    <p class="p-10 xl:text-2xl text-b-font text-lg"></p>
                </div>
                <p className="mt-4 text-3xl font-bold text-black-500">
                    1.วัดความกว้างให้เลยจากขอบวงกบซ้ายและขวาด้านละ 5 ซม. หากต้องการติดผ้าม่านผ้าในขอบวงกบหรือหน้าต่างให้ลดความกว้างลง 1 ซม. เพื่อให้ติดตั้งได้ง่ายขึ้น ( เช่นวัดความกว้างจากขอบวงกบได้ 100 ซม. ให้ลดความกว้างเหลือ 99 ซม.  )
                </p>
                <p class="p-10 xl:text-2xl text-b-font text-lg"></p>
                <p className="mt-4 text-3xl font-bold text-black-500">
                    2.การวัดม่านพับ ต้องวัดจากความสูงโดยวัดให้เลยจากขอบวงกบขึ้นไปประมาณ 30 ซม. หรือน้อยกว่าได้ตามความเหมาะสมของพื้นที่หน้าต่างและวัดเลยวงกบล่างลงประมาณ 15 - 20 ซม. เพื่อให้ม่านสามารถพับได้
                </p>
                
                <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
                </dl>
                </div>
                <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 lg:gap-8">
                <img
                    src={g5}
                    alt="Walnut card tray with white powder coated steel divider and 3 punchout holes."
                    className="rounded-lg bg-gray-100"
                />
                <img
                    src={g6}
                    alt="Top down view of walnut card tray with embedded magnets and card groove."
                    className="rounded-lg bg-gray-100"
                />
                </div>
            </div>
            </div>
          <div className="flex justify-center items-center ">
            <p class="p-5 xl:text-2xl text-b-font text-lg"></p>
          </div>
        <Footer></Footer>
      </div>
      
    </>
  );
}
export default ServicePage;
