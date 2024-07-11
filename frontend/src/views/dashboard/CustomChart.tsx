"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useGetChartMetricsQuery } from "@/store/APIs/metrics";
import { useGetCurrentUserQuery } from "@/store/APIs/user";

export const description = "An interactive bar chart";

const chartConfig = {
  views: {
    label: "Count",
  },
  average_fitness: {
    label: "Average fitness",
    color: "hsl(var(--chart-1))",
  },
  success_rate: {
    label: "Success count",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function CustomChart() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("average_fitness");
  const { data: currentUser } = useGetCurrentUserQuery();

  const { data: chartData } = useGetChartMetricsQuery({
    university_id: Number(currentUser?.UniversityID) ?? 0,
  });

  console.log(chartData);

  const total = React.useMemo(
    () => ({
      average_fitness: chartData?.reduce(
        (acc, curr) => acc + curr.average_fitness,
        0
      ),
      success_rate: chartData?.reduce((acc, curr) => acc + 1, 0),
    }),
    [chartData]
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Algorithm Performance</CardTitle>
          <CardDescription>
            Display metrics related to the performance of your scheduling
            algorithm
          </CardDescription>
        </div>
        <div className="flex">
          {["average_fitness", "success_rate"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                {total && (
                  <span className="text-lg font-bold leading-none sm:text-3xl">
                    {
                      // @ts-ignore
                      total?.[chart]?.toLocaleString()
                    }
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
