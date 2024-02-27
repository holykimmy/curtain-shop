import axios from "axios";

const CustomerAPI = {
  getAllCustomer: async () => {
    return axios
      .get(`${process.env.REACT_APP_API}/customer/all`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },

  getSearch: (search) => {
    return axios.get(`${process.env.REACT_APP_API}/customer/?name=${search}`)
    .then((response) => response.data)
    .catch((error) =>{
        console.error("error fetch ",error);
        throw error;
    });
  }
};
export default CustomerAPI;
