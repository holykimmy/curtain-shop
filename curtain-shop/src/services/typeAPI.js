import axios from "axios";
const typeAPI = {
  createProduct: async (formData) => {
    return axios.post(`${process.env.REACT_APP_API}/type-cut/create`, formData);
  },
  getAllTypes : () => {
    return axios
      .get(`${process.env.REACT_APP_API}/type-cut/all/type`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching :", error);
        throw error;
      });
  },
  getTypeById : async (typeId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/type-cut/type/${typeId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching :", error);
      throw error;
    }
  },


  updateTypeById: async (typeId,formData) => {
    try {

      const response = await axios.put(
        `${process.env.REACT_APP_API}/type-cut/update/${typeId}`,formData
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching :", error);
      throw error;
    }
  },

  deleteTypeById: async (typeId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API}/type-cut/delete/${typeId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching :", error);
      throw error;
    }
  },
};

export default typeAPI;
