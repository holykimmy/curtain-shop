import axios from "axios";
const showAPI = {

    createShow: async (formData) => {
      return axios.post(`${process.env.REACT_APP_API}/show/create`, formData);
    },
    getAllImage: async () => {
      return axios
      .get(`${process.env.REACT_APP_API}/show/all`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching p_type options:", error);
        throw error;
      });
    },
  
    deleteShow: async (id) => {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_API}/show/delete/${id}`
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching  options:", error);
        throw error;
      }
    },

  };
  
  export default showAPI;