const Order = require("../models/orderModel");
const Product = require("../models/productModel");

module.exports = {
  fetchSalesReport: async (timeFrame, startDate, endDate) => {
    const defaultStartDate = "2020-01-01";

    let start =
      startDate === "undefined"
        ? new Date(defaultStartDate)
        : new Date(startDate);
    let end = endDate === "undefined" ? new Date() : new Date(endDate);

    // Adjust the end date based on the time frame
    switch (timeFrame) {
      case "daily":
        end.setHours(23, 59, 59, 999);
        break;

      case "weekly":
        const dayOfWeek = end.getDay(); // 0 (Sunday) to 6 (Saturday)
        end.setDate(end.getDate() + (7 - dayOfWeek)); // Move to next Sunday
        end.setHours(23, 59, 59, 999);
        break;

      case "monthly":
        end.setMonth(end.getMonth() + 1, 0); // Last day of the current month
        end.setHours(23, 59, 59, 999);
        break;

      case "yearly":
        end.setFullYear(end.getFullYear(), 11, 31); // December 31st
        end.setHours(23, 59, 59, 999);
        break;

      default:
        throw new Error("Invalid time frame");
    }

    const groupBy = (timeFrame) => {
      switch (timeFrame) {
        case "daily":
          return {
            $dateToString: { format: "%Y-%m-%d", date: "$dateOrdered" },
          };
        case "weekly":
          return {
            $dateToString: {
              format: "%Y-%m-%d",
              date: {
                $subtract: [
                  "$dateOrdered",
                  {
                    $multiply: [
                      { $dayOfWeek: "$dateOrdered" },
                      24 * 60 * 60 * 1000,
                    ],
                  },
                ],
              },
            },
          };
        case "monthly":
          return { $dateToString: { format: "%Y-%m", date: "$dateOrdered" } };
        case "yearly":
          return { $year: "$dateOrdered" };
        default:
          throw new Error("Invalid time frame");
      }
    };

    const salesData = await Order.aggregate([
      {
        $match: {
          "payment.method": { $ne: "pending" },
          dateOrdered: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: groupBy(timeFrame),
          totalOrders: { $sum: 1 },
          totalSales: { $sum: "$totalAmount" },
          totalDiscountApplied: { $sum: "$discountApplied" },
          netSales: { $sum: "$finalAmount" },
          totalItemsSold: {
            $sum: {
              $reduce: {
                input: "$orderItems",
                initialValue: 0,
                in: { $add: ["$$value", "$$this.quantity"] },
              },
            },
          },
          totalCouponDiscount: {
            $sum: {
              $reduce: {
                input: "$couponsApplied",
                initialValue: 0,
                in: { $add: ["$$value", "$$this.discountAmount"] },
              },
            },
          },
        },
      },
      {
        $project: {
          date: "$_id",
          totalOrders: 1,
          totalSales: 1,
          totalDiscountApplied: 1,
          netSales: 1,
          totalItemsSold: 1,
          totalCouponDiscount: 1,
          startDate:
            timeFrame === "yearly"
              ? {
                  $dateFromString: {
                    dateString: { $concat: [{ $toString: "$_id" }, "-01-01"] },
                  },
                }
              : {
                  $dateFromString: {
                    dateString: {
                      $dateToString: {
                        format: "%Y-%m-%d",
                        date: {
                          $subtract: [
                            { $dateFromString: { dateString: "$_id" } },
                            {
                              $dayOfWeek: {
                                $dateFromString: { dateString: "$_id" },
                              },
                            },
                          ],
                        },
                      },
                    },
                  },
                },
          endDate:
            timeFrame === "yearly"
              ? {
                  $dateFromString: {
                    dateString: { $concat: [{ $toString: "$_id" }, "-12-31"] },
                  },
                }
              : {
                  $dateFromString: {
                    dateString: {
                      $dateToString: {
                        format: "%Y-%m-%d",
                        date: {
                          $add: [
                            { $dateFromString: { dateString: "$_id" } },
                            { $multiply: [6, 24 * 60 * 60 * 1000] },
                          ],
                        },
                      },
                    },
                  },
                },
        },
      },
      {
        $sort: { date: -1 },
      },
    ]);

    return salesData;
  },

  fetchSalesReportForSeller: async (
    sellerId,
    timeFrame,
    startDate,
    endDate
  ) => {
    const defaultStartDate = "2020-01-01";

    let start =
      startDate === "undefined"
        ? new Date(defaultStartDate)
        : new Date(startDate);
    let end = endDate === "undefined" ? new Date() : new Date(endDate);

    // Adjust the end date based on the time frame
    switch (timeFrame) {
      case "daily":
        end.setHours(23, 59, 59, 999);
        break;
      case "weekly":
        const dayOfWeek = end.getDay(); // 0 (Sunday) to 6 (Saturday)
        end.setDate(end.getDate() + (7 - dayOfWeek)); // Move to next Sunday
        end.setHours(23, 59, 59, 999);
        break;
      case "monthly":
        end.setMonth(end.getMonth() + 1, 0); // Last day of the current month
        end.setHours(23, 59, 59, 999);
        break;
      case "yearly":
        end.setFullYear(end.getFullYear(), 11, 31); // December 31st
        end.setHours(23, 59, 59, 999);
        break;
      default:
        throw new Error("Invalid time frame");
    }

    const groupBy = (timeFrame) => {
      switch (timeFrame) {
        case "daily":
          return {
            $dateToString: { format: "%Y-%m-%d", date: "$dateOrdered" },
          };
        case "weekly":
          return {
            $dateToString: {
              format: "%Y-%m-%d",
              date: {
                $subtract: [
                  "$dateOrdered",
                  {
                    $multiply: [
                      { $dayOfWeek: "$dateOrdered" },
                      24 * 60 * 60 * 1000,
                    ],
                  },
                ],
              },
            },
          };
        case "monthly":
          return { $dateToString: { format: "%Y-%m", date: "$dateOrdered" } };
        case "yearly":
          return { $year: "$dateOrdered" };
        default:
          throw new Error("Invalid time frame");
      }
    };

    const salesData = await Order.aggregate([
      {
        $match: {
          "payment.method": { $ne: "pending" },
          dateOrdered: { $gte: start, $lte: end },
        },
      },
      {
        $unwind: "$orderItems",
      },
      {
        $match: {
          "orderItems.productId": {
            $in: await Product.find({ sellerId }).distinct("_id"), // Find products for the seller
          },
        },
      },
      {
        $group: {
          _id: groupBy(timeFrame),
          totalOrders: { $sum: 1 },
          totalSales: { $sum: "$totalAmount" },
          totalDiscountApplied: { $sum: "$discountApplied" },
          netSales: { $sum: "$finalAmount" },
          totalItemsSold: {
            $sum: "$orderItems.quantity",
          },
          totalCouponDiscount: {
            $sum: {
              $reduce: {
                input: "$couponsApplied",
                initialValue: 0,
                in: { $add: ["$$value", "$$this.discountAmount"] },
              },
            },
          },
        },
      },
      {
        $project: {
          date: "$_id",
          totalOrders: 1,
          totalSales: 1,
          totalDiscountApplied: 1,
          netSales: 1,
          totalItemsSold: 1,
          totalCouponDiscount: 1,
        },
      },
      {
        $sort: { date: -1 },
      },
    ]);

    return salesData;
  },
};

// fetchSalesReport: async () => {
//     const orders = await Order.find({
//       "payment.method": { $ne: "pending" },
//     }).sort({ dateOrdered: -1 });

//     // Initialize a map to hold sales data by date
//     const salesSummaryByDate = {};

//     // Process each order to calculate the summary
//     orders.forEach((order) => {
//       const orderDate = new Date(order.dateOrdered).toISOString().split("T")[0]; // Get the date in YYYY-MM-DD format

//       // Initialize summary for the date if it doesn't exist
//       if (!salesSummaryByDate[orderDate]) {
//         salesSummaryByDate[orderDate] = {
//           totalOrders: 0,
//           totalSales: 0,
//           totalDiscountApplied: 0,
//           netSales: 0,
//           totalItemsSold: 0,
//           totalCouponDiscount: 0, // Add totalCouponDiscount
//         };
//       }

//       // Update the summary for that date
//       salesSummaryByDate[orderDate].totalOrders += 1; // Increment order count
//       salesSummaryByDate[orderDate].totalSales += order.totalAmount; // Add to total sales
//       salesSummaryByDate[orderDate].totalDiscountApplied +=
//         order.discountApplied; // Add to total discounts
//       salesSummaryByDate[orderDate].netSales += order.finalAmount; // Add to net sales

//       // Calculate total items sold
//       salesSummaryByDate[orderDate].totalItemsSold += order.orderItems.reduce(
//         (acc, item) => acc + item.quantity,
//         0
//       );

//       // Calculate total coupon discount
//       const couponDiscounts = order.couponsApplied.reduce(
//         (acc, coupon) => acc + coupon.discountAmount,
//         0
//       );
//       salesSummaryByDate[orderDate].totalCouponDiscount += couponDiscounts; // Add coupon discounts
//     });

//     // Convert the map to an array for easier processing or return
//     return Object.entries(salesSummaryByDate).map(([date, summary]) => ({
//       date,
//       ...summary,
//     }));
//   },
