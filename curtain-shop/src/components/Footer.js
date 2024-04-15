import Chaticon from "./Chaticon";
function Footer() {
  return (
    <>
      {/* <div className="top-[30%] bg-white fixed">
        <div class="bg-blue-500  sm:bg-green-500 md:bg-yellow-500 lg:bg-red-500 xl:bg-purple-500">
          bg-blue-500  sm:bg-green-500 md:bg-yellow-500 lg:bg-red-500
          xl:bg-purple-500
        </div>
        <p className="text-md sx:text-xs sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
        text-md sx:text-xs sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl
        </p>
      </div> */}

      <footer className=" text-start w-full bg-b-footer">
        <div class="text-left p-3">
          <div class=" p-0 text-b-font text-sm md:text-lg lg:text-lg ">
            © เจริญกิจผ้าม่าน
          </div>
          <div className=" text-b-font text-xs md:text-base lg:text-base ">
            2/562 ม.18 ซ ธนะศรี 1 คูคต อ.ลำลูกกา จ. ปทุมธานี 12130
          </div>
          <div className=" text-b-font text-xs md:text-base lg:text-base">
            โทร. 0879700514
          </div>
        </div>
      </footer>

      {/* <div className="chaticon  p-1 h-12 w-12 shadow rounded-full text-browntop hover:text-brown-400 bg-white/70 hover:bg-white fixed right-[5%] bottom-[12%]"> */}
      <Chaticon></Chaticon>
      {/* <HiOutlineChat className="  p-1 h-12 w-12 shadow rounded-full text-browntop hover:text-brown-400 bg-white/70 hover:bg-white fixed right-[5%] bottom-[12%]"></HiOutlineChat> */}
      {/* </div> */}
    </>
  );
}
export default Footer;
