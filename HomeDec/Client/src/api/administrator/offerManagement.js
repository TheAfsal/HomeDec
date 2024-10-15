import api from "../apiConfigAdmin";

export const listOffers = async (role) => {
  try {
    const response = await api.get(`/${role}/offers`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error?.response?.data?.error);
  }
};

export const createOffer = async (details) => {
  try {
    console.log("details", details);
    const response = await api.post(`/admin/offers/create`, details);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error?.response?.data?.error);
  }
};

export const updateOffer = async (details, offerId) => {
  try {
    console.log("details", details);
    const response = await api.put(`/admin/offers/update`, {
      details,
      offerId,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error?.response?.data?.error);
  }
};

export const toggleOfferStatus = async (id) => {
  try {
    const response = await api.patch(`/admin/offers/toggle-status/${id}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error?.response?.data?.error);
  }
};
