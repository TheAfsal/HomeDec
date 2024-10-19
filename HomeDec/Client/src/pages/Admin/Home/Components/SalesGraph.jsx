import React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { TrendingUp } from "lucide-react"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { generateSalesReport } from '@/api/administrator/salesManagement'






const SalesGraph = ({ salesData, setSalesData, role }) => {

    const chartConfig = {
        totalSales: {
            label: "Sales",
            color: "hsl(var(--chart-1))",
        },
        netSales: {
            label: "Net Sales",
            color: "hsl(var(--chart-2))",
        },
    }

    const handleDropDown = (selectedValue) => {
        generateSalesReport(role, selectedValue, undefined, undefined)
            .then((data) => {
                console.log(data);
                setSalesData(data.reverse());
            })
            .catch((error) => {
                console.log(error.message);
            })
    };

    return (
        <Card className="w-5/6 h-[50vh]">
            <CardHeader>
                <div className='flex items-center justify-between'>
                    <CardTitle>Area Chart - Stacked</CardTitle>
                    <Select onValueChange={handleDropDown}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="View By" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="yearly">Yearly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <CardDescription>
                    Showing total visitors for the last 6 months
                </CardDescription>
            </CardHeader>

            <CardContent className="w-full">
                <ChartContainer config={chartConfig} className="w-full h-[25vh]">
                    <AreaChart
                        accessibilityLayer
                        data={salesData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="_id"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        // tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Area
                            dataKey="totalSales"
                            type="natural"
                            fill="var(--color-totalSales)"
                            fillOpacity={0.4}
                            stroke="var(--color-totalSales)"
                            stackId="a"
                        />
                        <Area
                            dataKey="netSales"
                            type="natural"
                            fill="var(--color-netSales)"
                            fillOpacity={0.4}
                            stroke="var(--color-netSales)"
                            stackId="a"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 font-medium leading-none">
                            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="flex items-center gap-2 leading-none text-muted-foreground">
                            January - June 2024
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}

export default SalesGraph

