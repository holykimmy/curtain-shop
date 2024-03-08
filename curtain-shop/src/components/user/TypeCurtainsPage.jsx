import React from "react";
import Navbar from "../Navbar";
import { BsPinFill } from "react-icons/bs";
import Footer from "../Footer";
import t1 from "../img/t1.jpg";
import t2 from "../img/t2.jpg";
import t3 from "../img/t3.jpg";
import t4 from "../img/t4.jpg";
import t5 from "../img/t5.jpg";
import t6 from "../img/t6.jpg";
import t7 from "../img/t7.jpg";
import t8 from "../img/t8.png";
import t9 from "../img/t9.png";
import t10 from "../img/t10.jpg";
import t11 from "../img/t11.jpg";
import t12 from "../img/t12.jpg";
import t13 from "../img/t13.jpg";
import t14 from "../img/t14.jpg";
import t15 from "../img/t15.webp";
import t16 from "../img/t16.JPG";
import t17 from "../img/t17.webp";
import t18 from "../img/t18.webp";
import t19 from "../img/t19.webp";
import t20 from "../img/t20.webp";

const product = {
  highlightsL1: [
    'ผ้าจากเส้นใยธรรมชาติ บางเบา จึงสะดวกในการติดตั้ง',
    'ทำความสะอาดwได้ง่าย โดยเฉพาะการซัก',
    'มีเนื้อผ้าหลากหลายรูปแบบ ทั้งแบบทึบและแบบโปร่งแสง เหมาะสำหรับทำม่านบังแดด และกรองแสงในบริเวณบ้าน',
    'มีคุณสมบัติในการระบายความร้อนได้เป็นอย่างดี',
  ],
  highlightsL2: [
    'ตัวผ้าฝุ่นเกาะได้ง่าย ทำให้ผ้าหมองเร็ว',
    'จำเป็นต้องถอดออกมาซักล้างบ่อยครั้ง ไม่ให้ม่านสกปรก',
    'หากเป็นผ้าฝ้ายแท้ 100% การซักจะหดตัวย้วย เสียรูปทรงไปบ้าง',
  ],
  highlightsV1: [
    'ด้วยผิวสัมผัสที่เรียบลื่น มันเงา เป็นผ้าสำหรับทำผ้าม่านเพื่อการประดับตกแต่งโดยเฉพาะ แสดงถึงความหรูหรา มีระดับ',
    'เหมาะสำหรับการติดตั้งในห้องแอร์ ห้องอัดเสียง หรือ ห้องโฮมเธียร์เตอร์ที่ต้องการการดูดซับเสียง',
  ],
  highlightsV2: [
    'กำมะหยี่ เมื่อฝุ่นจับแล้ว ทำความสะอาดได้ค่อนข้างยาก',
    'ไม่สามารถรีดได้ จะทำให้เสียรูปทรงไปทันที',
    'หลีกเลี่ยงการโดนแสงแดดเพื่อไม่ให้ลดความคงทนและทำให้เกิดการซีดจางและเป็นสีเหลืองและสีจะเสื่อมลง',
  ],
  highlightsLI1: [
    'ด้วยความหยาบแข็งของเนื้อผ้า ทำให้การขึ้นรูปทำได้ดี จึงนิยมทำเป็นผ้าม่านในรูปแบบมีจีบที่ชัดเจน',
    'การเก็บกักความชื้นต่ำ ระบายความชื้นได้ง่าย ผ้าจึงไม่เหม็นอับ อีกทั้งฝุ่นไม่ค่อยเกาะ',
    'การทำความสะอาดเพียงแค่ดูดฝุ่น หรือเช็ดถูสามารถทำได้ง่าย',
  ],
  highlightsLI2: [
    'การทำความสะอาด แม้นำไปซักได้ แต่การรีดให้คืนรูปนั้นทำได้ยาก ต้องใช้เวลานาน อีกทั้งมีราคาสูง ทั้งที่มีคุณสมบัติใกล้เคียงกับผ้าฝ้าย หลายคนจึงเลือกใช้ผ้าฝ้ายมากกว่าผ้าลินิน',
  ],
  highlightsS1: [
    'ผ้าเนื้อหนา ทอแน่น ไม่ยับ ซักได้ง่าย คืนรูปโดยไม่ต้องรีด',
    'สะดวกในการทำความสะอาดด้วยการดูดฝุ่นโดยไม่ต้องถอดจากการติดตั้ง',
    'การทิ้งตัวของผ้าดี เพื่อสร้างรูปทรงโชว์ความสวยงามของม่านทำได้ดี',
  ],
  highlightsS2: [
    'มีน้ำหนักมากพอสมควร',
    'อีกทั้งยังเป็นผ้ามัน การสะท้อนแสงมีมาก การติดตั้งในพื้นที่มีแดดจัด จะสะท้อนแสงทำให้แสบตาได้',
  ],
  highlightsP1: [
    'ด้วยรูปแบบที่หลากหลาย และมีราคาถูก จึงนิยมนำมาทำเป็นผ้าม่านในหลากหลายรูปแบบ',
    'มีความทนทาน ยืดหยุ่น คงรูปร่าง ไม่ยับง่าย เนื้อผ้าคงสภาพ รักษารูปร่างดี',
    'ดูดซึมความชื้นได้ต่ำ',
  ],
  highlightsP2: [
    'ผ้าใยสังเคราะห์ระบายความร้อนได้ไม่ดี ',
    'ไม่ควรติดตั้งในพื้นที่ที่ต้องการอากาศถ่ายเทจะทำให้เกิดความร้อนขึ้นได้',
    'มีความไวไฟสูง จึงทำการรีดไม่ได้',
  ],
}


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {

  return (
    <div className="h-screen w-full bg-gradient-to-r from-5% from-white via-50% via-brown-bg to-90% to-white">
        <Navbar></Navbar>

        <div class="titlea bg-brown-bg py-1 shadow-md">
          <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-9 xl:h-9 text-b-font"></BsPinFill>
          <h5 className=" inline-block text-lg md:text-xl xl:text-3xl text-b-font  pl-4 p-2 my-1">
            ชนิดของผ้าที่นิยมทำผ้าม่าน
          </h5>
        </div>
      <div className=" bg-brown-blog">
        <div className="pt-6">
          {/* รูป */}
          <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
            <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
              <img
                src={t1}
                alt=""
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
              <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                <img
                  src={t2}
                  alt=""
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                <img
                  src={t4}
                  alt=""
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>
            <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
              <img
                src={t3}
                alt=""
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>

          {/* ข้อมูล */}
          <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl ">
            <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">ผ้าฝ้าย ( Cotton )</h1>
            </div>
            <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
              <div>
                <h3 className="sr-only"></h3>

                <div className="space-y-6">
                  <p className="text-2xl text-gray-900">เป็นผ้าที่มาจากธรรมชาติชนิดนี้นิยมนำมาตัดเย็บผ้าม่าน เพราะเป็นผ้าที่มีความหนาพอเหมาะ มีน้ำหนักทิ้งตัวได้ดี ระบายอากาศภายในห้องได้ดี สามารถใส่สีและลายพิมพ์บนพื้นผิวผ้าได้คมชัด และสามารถนำมาทำความสะอาดได้ง่าย มีคุณสมบัติบางเบา มีทั้งแบบที่ทำจากเส้นใยธรรมชาติ 100% และแบบผสมเส้นใยสังเคราะห์ เนื้อผ้ามีคุณสมบัติ ไร้ความมันเงา สะท้อนแสงได้ดีทำให้มองดูแล้วเกิดความสบายตา</p>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">ข้อดี</h3>

                <div className="mt-4">
                  <ul role="list" className="list-disc space-y-2 pl-4 text-xl">
                    {product.highlightsL1.map((highlight) => (
                      <li key={highlight} className="text-gray-900">
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-10">
                <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">ข้อเสีย</h3>

                <div className="mt-4">
                  <ul role="list" className="list-disc space-y-2 pl-4 text-xl">
                    {product.highlightsL2.map((highlight) => (
                      <li key={highlight} className="text-gray-900">
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>


              <div className="mt-10">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">คำแนะในการคำความสะอาด :</h2>

                <div className="mt-4 space-y-6">
                  <p className="text-2xl text-gray-900">หากผ้าม่านทำมาจากผ้าฝ้าย จะทำความสะอาดเพียงแค่นำมาสะบัดฝุ่นออก หรือดูดฝุ่นเป็นประจำ ประมาณอาทิตย์ละครั้งก็เพียงพอแล้ว หรือหากต้องการซักออกมาซักบ้างหากมีความรู้สึกว่ามันสกปรกมาก ไม่ควรซักบ่อยจนเกินไปและไม่ว่าจะซักดวยเครื่องหรือด้วยมือ ต้องตรวจสอบว่ามีสีตกหรือไม่</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="pt-6">
          {/* รูป */}
          <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
            <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
              <img
                src={t5}
                alt=""
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
              <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                <img
                  src={t6}
                  alt=""
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                <img
                  src={t8}
                  alt=""
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>
            <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
              <img
                src={t7}
                alt=""
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>

          {/* ข้อมูล */}
          <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl ">
            <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">ผ้ากำมะหยี่ ( Velvet )</h1>
            </div>
            <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
              <div>
                <h3 className="sr-only"></h3>

                <div className="space-y-6">
                  <p className="text-2xl text-gray-900">เป็นผ้าที่หนาแน่นและหนัก สร้างบรรยากาศของความหรูหรากับห้องได้ เพราะเนื้อผ้ามีเสน่ห์ในเรื่องเงาที่เป็นประกาย นอกจากนี้ผ้าม่านกำมะหยี่ยังสามารถกันแสงแดดได้ดี แถมเนื้อสัมผัสยังนุ่มนวล อย่างไรก็ตามผ้าชนิดนี้จะจับฝุ่นได้ง่าย จึงอาจจะต้องมีการทำความสะอาดบ่อยๆ และจะเสียหายได้หากโดนน้ำหรือสัมผัสความชื้นเป็นจำนวนมากหรือติดต่อกันเป็นเวลานาน นิยมใช้เป็นผ้าม่านประดับเพื่อความหรูหรา มีคุณสมบัติในการซับเสียงได้เป็นอย่างดี จึงเหมาะสำหรับการติดตั้งในพื้นที่ที่มีการติดตั้งเครื่องเสียง หรือ โรงภาพยนตร์ </p>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">ข้อดี</h3>

                <div className="mt-4">
                  <ul role="list" className="list-disc space-y-2 pl-4 text-xl">
                    {product.highlightsV1.map((highlight) => (
                      <li key={highlight} className="text-gray-900">
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-10">
                <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">ข้อเสีย</h3>

                <div className="mt-4">
                  <ul role="list" className="list-disc space-y-2 pl-4 text-xl">
                    {product.highlightsV2.map((highlight) => (
                      <li key={highlight} className="text-gray-900">
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>


              <div className="mt-10">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">คำแนะในการคำความสะอาด :</h2>

                <div className="mt-4 space-y-6">
                  <p className="text-2xl text-gray-900">หากผ้าม่านทำมาจากผ้ากำมะหยี่ ควรหลีกเลี่ยงผงซักฟอกที่เป็นด่าง ใช้ผงซักฟอกที่เป็นกลางหรือไหม-เฉพาะ ควรล้างในน้ำเย็นหรือน้ำอุ่นห้ามแช่ทิ้งไว้นาน ควรล้างเบา ๆ หลีกเลี่ยงการบิดหลีกเลี่ยงการแปรงฟันอย่างหนัก ผ้าสีเข้มควรล้างด้วยน้ำเพื่อหลีกเลี่ยงการซีดจาง ควรตากในที่ร่ม หลีกเลี่ยงแสงแดด และไม่ควรตากจนแห้ง</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className=" bg-brown-blog">
        <div className="pt-6">
          {/* รูป */}
          <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
            <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
              <img
                src={t9}
                alt=""
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
              <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                <img
                  src={t10}
                  alt=""
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                <img
                  src={t11}
                  alt=""
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>
            <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
              <img
                src={t12}
                alt=""
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>

          {/* ข้อมูล */}
          <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl ">
            <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">ผ้าลินิน ( Linen )</h1>
            </div>
            <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
              <div>
                <h3 className="sr-only"></h3>

                <div className="space-y-6">
                  <p className="text-2xl text-gray-900">ผ้าลินินเป็นชนิดผ้าที่ทำจากเส้นใยธรรมชาติเหมือนกับผ้าฝ้าย แต่จะมีความแตกต่างกันที่วัตถุดิบ และเพราะผ้าลินนินจะมีเส้นใยที่เหนียว จึงทำให้มีความทนทาน ดูดความชื้นจากอากาศได้ และมีคุณสมบัติคล้ายกับผ้าฝ้ายที่สามารถถ่ายเทอากาศได้อย่างดีเยี่ยม เวลาเย็บผ้าลินินเป็นผ้าม่าน มีคุณสมบัติโค้งตัวเป็นลอนสวย แต่ไม่อ่อนตัว เรียบลื่นเหมือนผ้าซาติน แต่เนื้อผ้ามีความหยาบแข็ง และหนากว่าผ้าม่านในรูปแบบอื่น แต่ก็มีข้อเสียตรงที่ยับง่ายเมื่อใช้เป็นเวลานาน หากต้องการให้กลับมาเรียบเหมือนเดิมก็ต้องถอดออกมารีดเสมอ โรงแรมต่าง ๆ นิยมใช้ผ้าลินินในการทำผ้าม่านสำหรับห้องประชุม</p>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">ข้อดี</h3>

                <div className="mt-4">
                  <ul role="list" className="list-disc space-y-2 pl-4 text-xl">
                    {product.highlightsLI1.map((highlight) => (
                      <li key={highlight} className="text-gray-900">
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-10">
                <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">ข้อเสีย</h3>

                <div className="mt-4">
                  <ul role="list" className="list-disc space-y-2 pl-4 text-xl">
                    {product.highlightsLI2.map((highlight) => (
                      <li key={highlight} className="text-gray-900">
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>


              <div className="mt-10">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">คำแนะในการคำความสะอาด :</h2>

                <div className="mt-4 space-y-6">
                  <p className="text-2xl text-gray-900">หากผ้าม่านทำมาจากผ้าลินิน จะมีทำความสะอาดคล้ายกับผ้าฝ้าย แต่ต้องระมัดระวังมากกว่าผ้าฝ้ายสูงเพราะการเนื้อผ้าอาจเสียรูปร่างได้ หากซักควรซักด้วยน้ำเยอะ หรือน้ำที่ไม่อุ่นมาก ใช้น้ำยาฟอกขาวที่มีส่วนผสมของคลอรีนเมื่อจำเป็นเท่านั้น และตากในที่ร่ม ไม่ควรโดนแดดจัด</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="pt-6">
          {/* รูป */}
          <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
            <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
              <img
                src={t13}
                alt=""
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
              <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                <img
                  src={t14}
                  alt=""
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                <img
                  src={t15}
                  alt=""
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>
            <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
              <img
                src={t16}
                alt=""
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>

          {/* ข้อมูล */}
          <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl ">
            <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">ผ้าซาติน ( SATIN )</h1>
            </div>
            <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
              <div>
                <h3 className="sr-only"></h3>

                <div className="space-y-6">
                  <p className="text-2xl text-gray-900">นับเป็นผ้าที่ได้รับความนิยมอย่างมากในการนำมาทำผ้าม่านในปัจจุบัน เนื้อผ้าทำมาจากเส้นใยธรรมชาติเป็นหลัก ผลิตด้วยการทอจนหนา ทำให้ผ้าซาตินมีน้ำหนักพอสมควร ผิวผ้าเรียบลื่น ด้วยน้ำหนักที่มาก การปล่อยชายผ้าม่านที่ทำจากผ้าซาตินจึงทิ้งตัวดูสวยงาม และเป็นชนิดผ้าที่มีความเงาในตัว ทำให้แสงสะท้อนแล้วดูเด่นสวย คล้ายๆ กับผ้าไหม เป็นผ้าที่ไม่จับฝุ่นบ่อย</p>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">ข้อดี</h3>

                <div className="mt-4">
                  <ul role="list" className="list-disc space-y-2 pl-4 text-xl">
                    {product.highlightsS1.map((highlight) => (
                      <li key={highlight} className="text-gray-900">
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-10">
                <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">ข้อเสีย</h3>

                <div className="mt-4">
                  <ul role="list" className="list-disc space-y-2 pl-4 text-xl">
                    {product.highlightsS2.map((highlight) => (
                      <li key={highlight} className="text-gray-900">
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>


              <div className="mt-10">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">คำแนะในการคำความสะอาด :</h2>

                <div className="mt-4 space-y-6">
                  <p className="text-2xl text-gray-900">หากผ้าม่านทำมาจากผ้าซาติน ผ้าเนื้อนุ่มเช่นนี้ควรค่าแก่การซักมืออย่างแน่นอน แต่หากมีเครื่องซักผ้าที่ไว้ใจได้ ก็อาจจะเลือกรอบการซักที่อ่อนโยนสำหรับผ้าเนื้อบางนี้ แต่สิ่งที่จะต้องระวังที่สุดคืออุณหภูมิ ทั้งการซักที่ต้องซักในน้ำเย็น และห้ามปั่นแห้งเป็นอันขาดเพื่อหลีกเลี่ยงอุณหภูมิสูงที่จะทำร้ายเนื้อผ้า การตากจึงควรวางแนวนอนไว้ในที่ร่ม แน่นอนว่าไม่อยู่ในที่อากาศร้อนจัดเช่นกัน </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className=" bg-brown-blog">
        <div className="pt-6">
          {/* รูป */}
          <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
            <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
              <img
                src={t17}
                alt=""
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
              <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                <img
                  src={t18}
                  alt=""
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                <img
                  src={t19}
                  alt=""
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>
            <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
              <img
                src={t20}
                alt=""
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>

          {/* ข้อมูล */}
          <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl ">
            <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">ผ้าใยสังเคราะห์โพลีเอสเตอร์ ( Polyester )</h1>
            </div>
            <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
              <div>
                <h3 className="sr-only"></h3>

                <div className="space-y-6">
                  <p className="text-2xl text-gray-900">ผ้าใยสังเคราะห์โพลีเอสเตอร์เป็นผ้าที่ได้รับความนิยมสูงมาก นับว่าเป็นผ้าสารพัดประโยชน์ที่นำมาใช้ใน " ร้านผ้าม่าน " ในปัจจุบัน เนื่องจากไม่จับฝุ่น มีความทนทานสูง อยู่ทรง รักษารูปทรงได้ดีจึงไม่ยับง่ายหรือเกิดการยืดหดจากการซัก ไม่จำเป็นต้องทำความสะอาดบ่อยและหากติดตั้งกับรางผ้าม่านไฟฟ้าจะยิ่งสะดวกต่อการใช้งาน ผ้าโพลีเอสเตอร์สามารถตัดเย็บได้ทั้งแบบลายพิมพ์และการทอลายในตัว เหมาะสำหรับการตกแต่งภายในเป็นอย่างยิ่ง จึงนิยมนำมาทำเป็นผ้าม่านอัดจีบถาวร ด้วยราคาที่ไม่แพง การออกแบบลวดลายทำได้หลากหลาย จึงมักเป็นตัวเลือกที่อย่างแรกๆและได้รับความนิยมเลือกใช้ทำผ้าม่านอย่างมาก</p>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">ข้อดี</h3>

                <div className="mt-4">
                  <ul role="list" className="list-disc space-y-2 pl-4 text-xl">
                    {product.highlightsP1.map((highlight) => (
                      <li key={highlight} className="text-gray-900">
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-10">
                <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">ข้อเสีย</h3>

                <div className="mt-4">
                  <ul role="list" className="list-disc space-y-2 pl-4 text-xl">
                    {product.highlightsP2.map((highlight) => (
                      <li key={highlight} className="text-gray-900">
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>


              <div className="mt-10">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">คำแนะในการคำความสะอาด :</h2>

                <div className="mt-4 space-y-6">
                  <p className="text-2xl text-gray-900">หากผ้าม่านทำมาจากผ้าโพลีเอสเตอร์ สามารถซักได้ทั้งการซักด้วยมือและการซักด้วยควร เนื้อผ้าเนื้อผ้ามีความทนทานและแข็งแรง แต่ก็ควรทำความสะอาดด้วยการถนอมผ้าเช่นกัน เพื่อลดความเสี่ยงต่อการเสียหายของผ้า ผ้าโพลีเอสเตอร์สามารถซักง่ายและแห้งเร็ว แต่การทนความร้อนจากการรีดนั้นได้ไม่สูงมาก หากจะรีดควรใช้ไฟกลาง-ไฟอ่อนในการรีด</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  )
}
