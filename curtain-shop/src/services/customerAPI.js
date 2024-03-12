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

  getCustomerAddressById: async (customerId) => {
    return axios
      .get(`${process.env.REACT_APP_API}/customer/address/${customerId}`) 
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },
  
  getOrderById: async (customerId) => {
    return axios
      .get(`${process.env.REACT_APP_API}/customer/order/${customerId}`) 
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },
  

  getSearch: (search) => {
    return axios
      .get(`${process.env.REACT_APP_API}/customer/?name=${search}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("error fetch ", error);
        throw error;
      });
  },


  deleteAddress: async (addressId) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API}/customer/address/${addressId}`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },



};
export default CustomerAPI;
