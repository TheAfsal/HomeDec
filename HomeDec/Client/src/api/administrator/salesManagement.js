import api from "../apiConfigAdmin";

export const generateSalesReport = async (
  role,
  timeFrame,
  startDate,
  endDate
) => {
  try {
    const response = await api.get(
      `/${role}/sales-report?tf=${timeFrame}&sd=${startDate}&ed=${endDate}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};
