import React, { useEffect, useState } from 'react';
import { generateSalesReport } from '../../../../api/administrator/salesManagement';
import TableHeader from '../../../../Components/Table/TableHeader';
import NoRecords from '../../../../Components/Table/NoRecords';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useSelector } from 'react-redux';

const SalesReportPage = () => {
    const [salesData, setSalesData] = useState([]);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [timeFrame, setTimeFrame] = useState('daily');
    const { role } = useSelector((state) => state.auth)

    const fetchSalesReport = async () => {
        try {
            const data = await generateSalesReport(role, timeFrame, startDate, endDate);
            setSalesData(data);
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        const tableColumn = [
            "DATE",
            "TOTAL SALES REVENUE",
            "DISCOUNT APPLIED",
            "TOTAL COUPON DISCOUNT",
            "NET SALES",
            "NUMBER OF ORDERS",
            "TOTAL ITEMS SOLD"
        ];

        const tableRows = [];

        salesData.forEach(day => {
            const dayData = [
                day.date,
                day.totalSales,
                day.totalDiscountApplied,
                day.totalCouponDiscount,
                day.netSales,
                day.totalOrders,
                day.totalItemsSold,
            ];
            tableRows.push(dayData);
        });

        // Add the table to the PDF
        doc.autoTable(tableColumn, tableRows, { startY: 20 });
        doc.text("Sales Report", 14, 15);
        doc.save("sales_report.pdf");
    };

    const downloadExcel = () => {
        // Create a new workbook
        const wb = XLSX.utils.book_new();

        // Define the data to be exported
        const worksheetData = salesData.map(day => ({
            Date: day.date,
            TotalSalesRevenue: day.totalSales,
            DiscountApplied: day.totalDiscountApplied,
            TotalCouponDiscount: day.totalCouponDiscount,
            NetSales: day.netSales,
            NumberOfOrders: day.totalOrders,
            TotalItemsSold: day.totalItemsSold,
        }));

        // Create a worksheet from the data
        const ws = XLSX.utils.json_to_sheet(worksheetData);

        // Append the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, "Sales Report");

        // Generate a file name
        const fileName = `sales_report_${new Date().toISOString().split('T')[0]}.xlsx`;

        // Export the workbook
        XLSX.writeFile(wb, fileName);
    };

    useEffect(() => {
        fetchSalesReport(); 
    }, []);

    return (
        <div className="p-8">
            <div className='flex justify-between'>
                <h1 className="text-2xl font-semibold mb-2 font-nunito">Sales Report</h1>
            </div>
            <hr className='mb-3' />

            <div className='flex items-center justify-between mb-3'>
                <div className="flex items-center">
                    <div className="mr-4">
                        <label htmlFor="timeFrame" className="mr-2">Select Time Frame:</label>
                        <select
                            id="timeFrame"
                            value={timeFrame}
                            onChange={(e) => setTimeFrame(e.target.value)}
                            className="border rounded p-2"
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>
                    <div className="mr-4">
                        <label htmlFor="startDate" className="mr-2">Start Date:</label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border rounded p-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="mr-2">End Date:</label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border rounded p-2"
                        />
                    </div>
                    <button
                        onClick={fetchSalesReport}
                        className="ml-4 bg-blue-500 text-white p-2 rounded"
                    >
                        Fetch Report
                    </button>
                </div>
                <div className='flex gap-2'>
                    <button
                        onClick={downloadPDF}
                        className="ml-4 bg-green-500 text-white p-2 rounded"
                    >
                        Download PDF
                    </button>
                    <button onClick={downloadExcel} className="bg-blue-500 text-white px-4 py-2 rounded">Download Excel</button>
                </div>
            </div>
            <hr className='mb-5' />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {/* Total Sales Count */}
                <div className="bg-white shadow-md rounded-lg p-6 text-center">
                    <div className="text-xl font-semibold text-gray-700">Total Sales Count</div>
                    <div className="text-4xl font-bold text-green-500 mt-2">
                        {salesData.reduce((acc, row) => acc += row.totalItemsSold, 0)}
                    </div>
                    <div className="text-gray-500 mt-1">Items Sold</div>
                </div>

                {/* Overall Order Amount */}
                <div className="bg-white shadow-md rounded-lg p-6 text-center">
                    <div className="text-xl font-semibold text-gray-700">Overall Order Amount</div>
                    <div className="text-4xl font-bold text-blue-500 mt-2">
                        {salesData.reduce((acc, row) => acc += row.totalSales, 0).toFixed(2)}
                    </div>
                    <div className="text-gray-500 mt-1">Total Sales</div>
                </div>

                {/* Overall Discount */}
                <div className="bg-white shadow-md rounded-lg p-6 text-center">
                    <div className="text-xl font-semibold text-gray-700">Overall Discount</div>
                    <div className="text-4xl font-bold text-red-500 mt-2">
                        {salesData.reduce((acc, row) => acc += row.totalDiscountApplied, 0).toFixed(2)}
                    </div>
                    <div className="text-gray-500 mt-1">Discounts Applied</div>
                </div>
            </div>


            <div className="overflow-x-auto mt-5">
                <table className="min-w-full bg-white border-gray-200 rounded-lg font-nunito">
                    <TableHeader headerContent={["DATE", "TOTAL SALES REVENUE", "DISCOUNT APPLIED", "TOTAL COUPON DISCOUNT", "NET SALES", "NUMBER OF ORDERS", "TOTAL ITEMS SOLD"]} />
                    <tbody>
                        {
                            salesData.length ? (
                                salesData.map((day, index) => (
                                    <tr key={index} className='text-center hover:bg-form_inputFeild_background_grey'>
                                        <td className="px-6 py-4 border-b font-nunito text-sm text-left">{day?.date}</td>
                                        <td className="px-6 py-4 border-b font-nunito text-sm">{day?.totalSales}</td>
                                        <td className="px-6 py-4 border-b font-nunito text-sm">{day?.totalDiscountApplied}</td>
                                        <td className="px-6 py-4 border-b font-nunito text-sm">{day?.totalCouponDiscount}</td>
                                        <td className="px-6 py-4 border-b font-nunito text-sm">{day?.netSales}</td>
                                        <td className="px-6 py-4 border-b font-nunito text-sm">{day?.totalOrders}</td>
                                        <td className="px-6 py-4 border-b font-nunito text-sm">{day?.totalItemsSold}</td>
                                    </tr>
                                ))
                            ) : (
                                <NoRecords />
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalesReportPage;
