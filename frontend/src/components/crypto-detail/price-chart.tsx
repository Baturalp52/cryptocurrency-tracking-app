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
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-dayjs-4";
import { getHistoricalData } from "@/services/cryptocurrency/client";
import { HistoricalDataPoint } from "@/services/cryptocurrency/interface";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
);

interface PriceChartProps {
  cryptoId: number;
}

// Time range options for the chart
type TimeRange = "1H" | "1D" | "7D" | "30D" | "90D" | "1Y";

// Map UI time ranges to API time ranges
const timeRangeMap: Record<TimeRange, string> = {
  "1H": "1h",
  "1D": "1d",
  "7D": "7d",
  "30D": "30d",
  "90D": "90d",
  "1Y": "365d",
};

// Define chart data type
type PriceChartData = ChartData<"line", { x: Date; y: number }[]>;

export default function PriceChart({ cryptoId }: PriceChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("1D");
  const [chartData, setChartData] = useState<PriceChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [priceStats, setPriceStats] = useState<{
    current: number;
    change: number;
    changePercent: number;
  } | null>(null);
  const [volumeData, setVolumeData] = useState<number | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get the API time range value
        const apiTimeRange = timeRangeMap[timeRange];

        // Fetch historical data from the API
        const response = await getHistoricalData(cryptoId, apiTimeRange);

        if (response.data && response.data.length > 0) {
          // Process the data for the chart
          const historicalData = response.data;

          // Calculate price stats
          const latestPrice = historicalData[historicalData.length - 1].price;
          const firstPrice = historicalData[0].price;
          const priceChange = latestPrice - firstPrice;
          const priceChangePercent = (priceChange / firstPrice) * 100;

          setPriceStats({
            current: latestPrice,
            change: priceChange,
            changePercent: priceChangePercent,
          });

          // Set volume data
          const latestVolume =
            historicalData[historicalData.length - 1].volume_24h;
          setVolumeData(latestVolume);

          // Format data for the chart
          setChartData({
            datasets: [
              {
                label: "Price (USD)",
                data: historicalData.map((d: HistoricalDataPoint) => ({
                  x: new Date(d.timestamp),
                  y: d.price,
                })),
                borderColor:
                  priceChangePercent >= 0
                    ? "rgb(22, 199, 132)"
                    : "rgb(234, 57, 67)",
                backgroundColor: (context) => {
                  const ctx = context.chart.ctx;
                  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                  if (priceChangePercent >= 0) {
                    gradient.addColorStop(0, "rgba(22, 199, 132, 0.5)");
                    gradient.addColorStop(1, "rgba(22, 199, 132, 0)");
                  } else {
                    gradient.addColorStop(0, "rgba(234, 57, 67, 0.5)");
                    gradient.addColorStop(1, "rgba(234, 57, 67, 0)");
                  }
                  return gradient;
                },
                tension: 0.4,
                pointRadius: 0,
                pointHitRadius: 10,
                borderWidth: 2,
                fill: true,
              },
            ],
          });
        } else {
          setError("No historical data available");
        }
      } catch (err) {
        console.error("Error fetching chart data:", err);
        setError("Failed to load chart data");
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
          unit: getTimeUnit(timeRange),
          tooltipFormat:
            timeRange === "1H" || timeRange === "1D" ? "HH:mm" : "MMM D, YYYY",
          displayFormats: {
            minute: "HH:mm",
            hour: "HH:mm",
            day: "MMM D",
            week: "MMM D",
            month: "MMM YYYY",
          },
        },
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: timeRange === "1H" ? 6 : 6,
          color: "rgba(120, 120, 120, 0.8)",
          font: {
            size: 10,
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        position: "right",
        grid: {
          color: "rgba(200, 200, 200, 0.1)",
        },
        ticks: {
          callback: (value) => {
            return "$" + formatNumber(Number(value));
          },
          color: "rgba(120, 120, 120, 0.8)",
          font: {
            size: 10,
          },
          padding: 10,
        },
        border: {
          display: false,
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
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#000",
        bodyColor: "#000",
        borderColor: "rgba(200, 200, 200, 0.5)",
        borderWidth: 1,
        padding: 10,
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
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 0,
      },
    },
  };

  // Helper function to determine the time unit based on the selected time range
  function getTimeUnit(
    range: TimeRange
  ): "minute" | "hour" | "day" | "week" | "month" {
    switch (range) {
      case "1H":
        return "minute";
      case "1D":
        return "hour";
      case "7D":
        return "day";
      case "30D":
        return "day";
      case "90D":
        return "week";
      case "1Y":
        return "month";
      default:
        return "day";
    }
  }

  // Helper function to format numbers (e.g., 1.2K, 1.2M)
  function formatNumber(num: number): string {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + "B";
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toFixed(2);
  }

  const timeRangeOptions: TimeRange[] = ["1H", "1D", "7D", "30D", "90D", "1Y"];

  return (
    <div className="price-chart">
      {/* Price and change information */}
      {priceStats && (
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="h4 mb-0">
              $
              {priceStats.current.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h2>
            <div
              className={
                priceStats.changePercent >= 0 ? "text-success" : "text-danger"
              }
            >
              {priceStats.changePercent >= 0 ? "+" : ""}
              {priceStats.change.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              ({priceStats.changePercent.toFixed(2)}%)
            </div>
          </div>

          {/* Volume information */}
          {volumeData && (
            <div className="text-end">
              <div className="text-muted small">Volume</div>
              <div>${formatNumber(volumeData)}</div>
            </div>
          )}
        </div>
      )}

      {/* Change Percentages */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        {timeRangeOptions.map((option) => {
          // Mock percentage changes for demonstration
          const mockPercentage =
            option === "1H"
              ? 1.25
              : option === "1D"
              ? 7.01
              : option === "7D"
              ? 6.2
              : option === "30D"
              ? -3.12
              : option === "90D"
              ? -1.72
              : option === "1Y"
              ? 4.45
              : 0;

          const isPositive = mockPercentage >= 0;

          return (
            <div
              key={option}
              className={`px-3 py-1 rounded ${
                timeRange === option
                  ? isPositive
                    ? "bg-success bg-opacity-10"
                    : "bg-danger bg-opacity-10"
                  : ""
              }`}
              onClick={() => setTimeRange(option as TimeRange)}
              style={{ cursor: "pointer" }}
            >
              <div className="small text-muted">{option}</div>
              <div
                className={
                  isPositive ? "text-success fw-bold" : "text-danger fw-bold"
                }
              >
                {isPositive ? "+" : ""}
                {mockPercentage.toFixed(2)}%
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div
        className="chart-container"
        style={{ position: "relative", height: "300px", width: "100%" }}
      >
        {loading ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <p className="text-muted">{error}</p>
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
