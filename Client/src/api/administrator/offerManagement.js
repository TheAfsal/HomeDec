import api from "../apiConfigAdmin";

export const listOffers = async (role) => {
  try {
    const response = await api.get(`/${role}/offers`);

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

export const createOffer = async (details) => {
  try {
    const response = await api.post(`/admin/offers/create`, details);

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

export const updateOffer = async (details, offerId) => {
  try {
    const response = await api.put(`/admin/offers/update`, {
      details,
      offerId,
    });

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

export const toggleOfferStatus = async (id) => {
  try {
    const response = await api.patch(`/admin/offers/toggle-status/${id}`);

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};
