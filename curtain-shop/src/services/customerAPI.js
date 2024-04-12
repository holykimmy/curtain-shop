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

  getAddressById: async (id) => {
    return axios
      .get(`${process.env.REACT_APP_API}/customer/address-byid/${id}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },

  getCustomerById: async (id) => {
    return axios
      .get(`${process.env.REACT_APP_API}/customer/${id}`)
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
      .get(
        `${process.env.REACT_APP_API}/customer/order/waiting-payment/${customerId}`
      )
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
  //----ad

  getSearch: (search) => {
    return axios
      .get(`${process.env.REACT_APP_API}/customer/?name=${search}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("error fetch ", error);
        throw error;
      });
  },

  deleteAddress: async (id) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API}/customer/delete-address/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  updateAddress: async (id,updateAddress) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/customer/update-address/${id}`,updateAddress
      );
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // updateOrderEnable: async (idOrder,cancelReasonAd) => {
  //   try {
  //     const response = await axios.put(`${process.env.REACT_APP_API}/customer/order/enable/${idOrder}`, false , { cancelReason: cancelReasonAd });
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error updating order enable:', error);
  //     throw error;
  //   }
  // },
  //   updateOrderEnable: async (idOrder, cancelReasonAd) => {
  //     try {
  //         const response = await axios.put(`${process.env.REACT_APP_API}/customer/order/enable/${idOrder}`, { cancelReason: cancelReasonAd });
  //         return response.data;
  //     } catch (error) {
  //         console.error('Error updating order enable:', error);
  //         throw error;
  //     }
  // },

  updateOrderEnable: async (idOrder, cancelReasonAd) => {

    console.log("id order : ",idOrder);
    console.log("cancel order : ",cancelReasonAd);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/customer/order/enable/${idOrder}`,
        
        { cancelReason: cancelReasonAd }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating order enable:", error);
      throw error;
    }
  },

  updateOrderComplete: async (idOrder, complete) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/customer/order/complete/${idOrder}`,
        { complete }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating order enable:", error);
      throw error;
    }
  },


  updateOrderDepositPayment: async (idOrder, deposit) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/customer/order/deposit/${idOrder}`,
        { deposit }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating order enable:", error);
      throw error;
    }
  },


  updateSlip: async (idOrder, formData) => {
    return axios.post(
      `${process.env.REACT_APP_API}/customer/order/payment/${idOrder}`,
      formData
    );
  },
};
export default CustomerAPI;
