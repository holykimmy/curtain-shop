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

  getOrderByIdWaitPayment: async (customerId) => {
    return axios
      .get(`${process.env.REACT_APP_API}/customer/order/waiting-payment/${customerId}`) 
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },

  getOrderByIdPrepare: async (customerId) => {
    return axios
      .get(`${process.env.REACT_APP_API}/customer/order/prepare/${customerId}`) 
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },

  getOrderByIdSend: async (customerId) => {
    return axios
      .get(`${process.env.REACT_APP_API}/customer/order/send/${customerId}`) 
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },

  getOrderByIdComplete: async (customerId) => {
    return axios
      .get(`${process.env.REACT_APP_API}/customer/order/complete/${customerId}`) 
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },
    
  getOrderByIdOrder: async (idOrder) => {
    return axios
      .get(`${process.env.REACT_APP_API}/customer/check-order/order/${idOrder}`) 
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

 
  updateOrderEnable: async (idOrder, enable) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API}/customer/order/enable/${idOrder}`, { enable });
      return response.data;
    } catch (error) {
      console.error('Error updating order enable:', error);
      throw error; 
    }
  }
  


};
export default CustomerAPI;
