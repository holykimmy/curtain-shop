import axios from "axios";

const getProductById = async (productId) => {
  try {
    const response = await axios.put(
      `${process.env.REACT_APP_API}/product/update/${productId}`
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const productAPI = {
  getProductById,
  
  createProduct: async (formData) => {
    return axios.post(`${process.env.REACT_APP_API}/product/create`, formData);
  },

  updateProduct: async (
    productId,formData
  ) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/product/update/${productId}`,
        formData
      );
      return response.data; // ส่งข้อมูลที่ได้รับกลับ
    } catch (error) {
      throw error; // ส่ง error ให้ caller จัดการ
    }
  },

  deleteProduct: async (productId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API}/product/delete/${productId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching p_type options:", error);
      throw error;
    }
  },

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
    return axios.get(`${process.env.REACT_APP_API}/product/search?name=${search}`)
      .then(response => response.data)
      .catch(error => {
        console.error("Error fetching p_type options:", error);
        throw error;
      });
  },

  // getSearch: (search) => {
  //   return axios
  //     .get(`${process.env.REACT_APP_API}/product/search?name=${search}`, {
  //       headers: { "Cache-Control": "no-cache" },
  //     })
  //     .then((response) => response.data)
  //     .catch((error) => {
  //       console.error("Error fetching p_type options:", error);
  //       throw error;
  //     });
  // },

  getProductTypeVelvet: async () => {
    return axios
      .get(`${process.env.REACT_APP_API}/product/type?name=velvet`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },

  getProductTypeCotton: async () => {
    return axios
      .get(`${process.env.REACT_APP_API}/product/type?name=cotton`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },

  getProductTypeSatin: async () => {
    return axios
      .get(`${process.env.REACT_APP_API}/product/type?name=satin`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },
  getProductTypeLinen: async () => {
    return axios
      .get(`${process.env.REACT_APP_API}/product/type?name=linen`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },
  getProductTypePolyester: async () => {
    return axios
      .get(`${process.env.REACT_APP_API}/product/type?name=100`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },

  getProductTypeMixed: async () => {
    return axios
      .get(`${process.env.REACT_APP_API}/product/type?name=mixed`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },
  getProductTypeBlackout: async () => {
    return axios
      .get(`${process.env.REACT_APP_API}/product/type?name=blackout`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },
  getProductTypeWave: async () => {
    return axios
      .get(`${process.env.REACT_APP_API}/product/type?name=wave-curtains`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },
};

export default productAPI;
