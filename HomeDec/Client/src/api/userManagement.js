import api from "./apiConfig";

export const fetchUsers = async () => {
  try {
    const response = await api.get("/admin/users/list");
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

export const toggleUserStatus = async (userId) => {
  try {
    await api.patch(`/admin/users/toggle-status/${userId}`);
    return;
  } catch (error) {
    console.log(error);

    throw new Error(error?.response?.data?.error);
  }
};
