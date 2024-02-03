import axios from "axios";

const productAPI = {
  createProduct: async (brand, p_type , name, color, detail, price) => {
    return axios.post(`${process.env.REACT_APP_API}/product/create`, {
      brand,
      p_type: p_type,
      name,
      color,
      detail,
      price,
    });
  },

  getPTypeOptions: (selectedBrand) => {
    return axios.get(`${process.env.REACT_APP_API}/category/?slug=${selectedBrand}`)
      .then(response => response.data.p_type || [])
      .catch(error => {
        console.error("Error fetching p_type options:", error);
        throw error;
      });
  },

  

};


export default productAPI;
