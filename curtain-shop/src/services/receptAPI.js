import axios from "axios";

const receptAPI = {
  createQuotation: async (formData) => {
    return axios.post(
      `${process.env.REACT_APP_API}/recept/create/quotation`,
      formData
    );
  },
  createInvoice: async (formData) => {
    return axios.post(
      `${process.env.REACT_APP_API}/recept/create/invoice`,
      formData
    );
  },

  updateRecept: async (id, formData) => {
    try {
      console.log("API", formData);
      const response = await axios.put(
        `${process.env.REACT_APP_API}/recept/update/${id}`,
        formData
      );
      return response.data; 
    } catch (error) {
      throw error; 
    }
  },

  updateToInvoice: async (id) => {
    try {
     
      const response = await axios.put(
        `${process.env.REACT_APP_API}/recept/update-to-invoice/${id}`
      );
      return response.data; 
    } catch (error) {
      throw error; 
    }
  },

  updateToQuotation: async (id) => {
    try {
     
      const response = await axios.put(
        `${process.env.REACT_APP_API}/recept/update-to-quotation/${id}`
      );
      return response.data; 
    } catch (error) {
      throw error; 
    }
  },

  getAllQuotation: async () => {
    return axios
      .get(`${process.env.REACT_APP_API}/recept/all/quotation`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },
  
  getAllInvoice: async () => {
    return axios
      .get(`${process.env.REACT_APP_API}/recept/all/invoice`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },

  getReceptById: async (id) => {
    return axios
    .get(`${process.env.REACT_APP_API}/recept/${id}`)
    .then((response) => response.data
    )
    .catch((error)=>{
      console.error(error);
      throw error;
    })
  },

  deleteRecept: async (id) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API}/recept/delete/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching p_type options:", error);
      throw error;
    }
  },

};

export default receptAPI;
