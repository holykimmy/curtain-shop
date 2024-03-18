import axios from "axios";
const OrderAPI = {
  getOrderAll: async () => {
    return axios
      .get(`${process.env.REACT_APP_API}/customer/all/order`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },

  getOrderApprove: async () => {
    return axios
      .get(`${process.env.REACT_APP_API}/customer/all/order/approve`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },

  getOrderPayment: async () => {
    return axios
      .get(`${process.env.REACT_APP_API}/customer/all/order/payment`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },

  getOrderPrepare: async () => {
    return axios
      .get(`${process.env.REACT_APP_API}/customer/all/order/prepare`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },

  getOrderSend: async () => {
    return axios
      .get(`${process.env.REACT_APP_API}/customer/all/order/send`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },

  getOrderComplete: async () => {
    return axios
      .get(`${process.env.REACT_APP_API}/customer/all/order/complete`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },

  searchOrderApprove: async (name) => {
    return axios
      .get(
        `${process.env.REACT_APP_API}/customer/all/order/approve-s?name=${name}`
      )
      .then((response) => response.data)
      .catch((err) => {
        console.error(err);
        throw err;
      });
  },

  searchOrderPayment: async (name) => {
    return axios 
    .get(`${process.env.REACT_APP_API}/customer/all/order/payment-s?name=${name}`)
    .then((response) => response.data)
    .catch((err) => {
        console.error(err);
        throw err;
    })
  },

  searchOrderPrepare: async (name) => {
    return axios 
    .get(`${process.env.REACT_APP_API}/customer/all/order/prepare-s?name=${name}`)
    .then((response) => response.data)
    .catch((err)=>{
        console.error(err);
        throw err;
    })
  },

  searchOrderSend: async (name) => {
    return axios 
    .get(`${process.env.REACT_APP_API}/customer/all/order/send-s?name=${name}`)
    .then((response) => response.data)
    .catch((err)=>{
        console.error(err);
        throw err;
    })
  },

  searchOrderComplete: async (name) => {
    return axios 
    .get(`${process.env.REACT_APP_API}/customer/all/order/complete-s?name=${name}`)
    .then((response) => response.data)
    .catch((err)=>{
        console.error(err);
        throw err;
    })
  },

  updateOrderApprove: async (idOrder, approve) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API}/customer/order/approve/${idOrder}`, { approve });
      return response.data;
    } catch (error) {
      console.error('Error updating order enable:', error);
      throw error; 
    }
  },

  updateOrderVerifyPayment: async (idOrder, verifypayment) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API}/customer/order/verifypayment/${idOrder}`, { verifypayment });
      return response.data;
    } catch (error) {
      console.error('Error updating order enable:', error);
      throw error; 
    }
  },

  updateOrderPandding: async (idOrder, pandding) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API}/customer/order/pandding/${idOrder}`, { pandding });
      return response.data;
    } catch (error) {
      console.error('Error updating order enable:', error);
      throw error; 
    }
  },
  
  
  updateOrderSend: async (idOrder, sendproduct) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API}/customer/order/send/${idOrder}`, { sendproduct });
      return response.data;
    } catch (error) {
      console.error('Error updating order enable:', error);
      throw error; 
    }
  },

  updateOrderVerifyCancelled: async (idOrder, veriflycancelled) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API}/customer/order/cancelled/${idOrder}`, { veriflycancelled });
      return response.data;
    } catch (error) {
      console.error('Error updating order enable:', error);
      throw error; 
    }
  }
  ,



  




};

export default OrderAPI;
