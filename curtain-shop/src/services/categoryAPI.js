import axios from "axios";

const brandAPI = {
  getAllBrands: async () => {
    return axios
      .get(`${process.env.REACT_APP_API}/category/brand`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },

  getTypeOf: async (slug) => {
    return axios
      .get(`${process.env.REACT_APP_API}/category/type`, { params: { slug } })
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },

  createBrand: async (brand) => {
    return axios
      .post(`${process.env.REACT_APP_API}/category/create-brand`, { brand })
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },

  createType: async (brand, p_type) => {
    return axios.post(`${process.env.REACT_APP_API}/category/create-type`, {
      brand,
      p_type: p_type,
    });
  },
};
export default brandAPI;
