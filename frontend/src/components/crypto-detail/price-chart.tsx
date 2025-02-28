"use client";

import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ChartData,
  ChartOptions,
  TooltipItem,
} from "chart.js";
import { Line } from "react-chartjs-2";
import dayjs from "dayjs";
import "chartjs-adapter-dayjs-4";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface PriceChartProps {
  cryptoId: number;
}

// Time range options for the chart
type TimeRange = "1D" | "7D" | "30D" | "90D" | "1Y" | "ALL";

// Define chart data type
interface ChartPoint {
  time: Date;
  price: number;
}

type PriceChartData = ChartData<"line", { x: Date; y: number }[]>;

export default function PriceChart({ cryptoId }: PriceChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("7D");
  const [chartData, setChartData] = useState<PriceChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Mock data for demonstration purposes
  // In a real application, this would be fetched from an API
  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);

      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Generate mock data based on the selected time range
        const now = new Date();
        const data: ChartPoint[] = [];

        let days = 0;
        switch (timeRange) {
          case "1D":
            days = 1;
            break;
          case "7D":
            days = 7;
            break;
          case "30D":
            days = 30;
            break;
          case "90D":
            days = 90;
            break;
          case "1Y":
            days = 365;
            break;
          case "ALL":
            days = 1095; // ~3 years
            break;
        }

        // Generate data points
        const startPrice = 30000 + Math.random() * 10000;
        const volatility = 0.02; // 2% volatility

        for (let i = days; i >= 0; i--) {
          const date = dayjs(now).subtract(i, "day").toDate();

          // Generate a random walk price
          const randomChange = (Math.random() - 0.5) * volatility;
          const price =
            i === days
              ? startPrice
              : data[data.length - 1].price * (1 + randomChange);

          data.push({ time: date, price });
        }

        setChartData({
          datasets: [
            {
              label: "Price (USD)",
              data: data.map((d) => ({ x: d.time, y: d.price })),
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              tension: 0.1,
              pointRadius: 0,
              pointHitRadius: 10,
              borderWidth: 2,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [timeRange, cryptoId]);

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
        time: {
          unit: timeRange === "1D" ? "hour" : "day",
          tooltipFormat: timeRange === "1D" ? "HH:mm" : "MMM d, yyyy",
          displayFormats: {
            hour: "HH:mm",
            day: "MMM d",
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        position: "right",
        grid: {
          color: "rgba(200, 200, 200, 0.1)",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: (context: TooltipItem<"line">) => {
            const rawValue = context.raw;
            if (rawValue && typeof rawValue === "object" && "y" in rawValue) {
              const numericValue = Number(rawValue.y);
              if (!isNaN(numericValue)) {
                return `$${numericValue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`;
              }
            }
            return "";
          },
        },
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
  };

  const timeRangeOptions: TimeRange[] = ["1D", "7D", "30D", "90D", "1Y", "ALL"];

  return (
    <div className="price-chart">
      {/* Time range selector */}
      <div className="d-flex justify-content-center mb-3">
        <div className="btn-group" role="group" aria-label="Chart time range">
          {timeRangeOptions.map((range) => (
            <button
              key={range}
              type="button"
              className={`btn btn-sm ${
                timeRange === range ? "btn-primary" : "btn-outline-secondary"
              }`}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div
        className="chart-container"
        style={{ position: "relative", height: "100%", width: "100%" }}
      >
        {loading ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : chartData ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <div className="d-flex justify-content-center align-items-center h-100">
            <p className="text-muted">No chart data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
