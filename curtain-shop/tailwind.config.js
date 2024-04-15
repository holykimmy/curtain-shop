/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "path-to-your-node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "path-to-your-node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        browntop: " #B3A18D",
        "brown-bg": "#EFEFE7",
        "brown-blog": "rgba(179,161,141,0.53)",
        "b-tab": "rgba(255, 255, 255, 0.53)",
        "b-footer": "rgba(217, 217, 217, 0.38)",
        "b-font": "#91887B",
        "b-btn": "#BA9B9B",
        "b-lg": "##836927",
        "b-sli": "#412416",
        "b-gray": "#6A6969"
      },
      screens: {
      
        sm: "576px",
        md: "768px",

        lg: "992px",

        xl: "1200px"
      },
      boxShadow: {
        "3xl": "0 -15px 50px rgba(50, 50, 93, 0.25) "
      },
      fontFamily: {
        Kanit: ["Kanit", "sans-serif"]
      }
    }
  },
  plugins: [require("@tailwindcss/forms")]
});
