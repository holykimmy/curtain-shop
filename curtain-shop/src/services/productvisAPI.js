import axios from "axios";

const getProductById = async (productId) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/product/${productId}`
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const productAPI = {
  getProductById,

  getPTypeOptions: (selectedBrand) => {
    return axios
      .get(`${process.env.REACT_APP_API}/category/?slug=${selectedBrand}`)
      .then((response) => response.data.p_type || [])
      .catch((error) => {
        console.error("Error fetching p_type options:", error);
        throw error;
      });
  },

  getSearch: (search) => {
    return axios
      .get(`${process.env.REACT_APP_API}/product/search-vis?name=${search}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching p_type options:", error);
        throw error;
      });
  },

  getProductType: async (product) => {
    return axios
      .get(`${process.env.REACT_APP_API}/product/type-vis?name=${product}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },

  getProductTypeVelvet: async () => {
    return axios
      .get(`${process.env.REACT_APP_API}/product/type-vis?name=velvet`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },

 


  getProductTypeCotton: async () => {
    return axios
      .get(`${process.env.REACT_APP_API}/product/type-vis?name=cotton`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },

  getProductTypeSatin: async () => {
    return axios
      .get(`${process.env.REACT_APP_API}/product/type-vis?name=satin`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },
  getProductTypeLinen: async () => {
    return axios
      .get(`${process.env.REACT_APP_API}/product/type-vis?name=linen`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },
  getProductTypePolyester: async () => {
    return axios
      .get(`${process.env.REACT_APP_API}/product/type-vis?name=polyester`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },

  getProductTypeMixed: async () => {
    return axios
      .get(`${process.env.REACT_APP_API}/product/type-vis?name=mixed`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },
  getProductTypeBlackout: async () => {
    return axios
      .get(`${process.env.REACT_APP_API}/product/type-vis?name=blackout`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },
  getProductTypeSheer: async () => {
    return axios
      .get(`${process.env.REACT_APP_API}/product/type-vis?name=sheer`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },
};

export default productAPI;
