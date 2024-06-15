import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

function Verticalchart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    // Fetching data from the API
    axios
      .get(`http://localhost:3000/data`)
      .then((response) => {
        const data = response.data;

        // Getting unique closed_fiscal_quarter values
        const quarters = [
          ...new Set(data.map((item) => item.closed_fiscal_quarter)),
        ];

        // Initializing arrays for storing ACV values for each quarter
        const newCustomerACVs = Array(quarters.length).fill(0);
        const existingCustomerACVs = Array(quarters.length).fill(0);

        // Populatating the arrays with ACV values
        data.forEach((item) => {
          const index = quarters.indexOf(item.closed_fiscal_quarter);
          if (item.Cust_Type === "New Customer") {
            newCustomerACVs[index] += item.acv;
          } else if (item.Cust_Type === "Existing Customer") {
            existingCustomerACVs[index] += item.acv;
          }
        });

        // Set the chart data like updating of data
        setChartData({
          labels: quarters,
          datasets: [
            {
              label: "New Customer ACV",
              data: newCustomerACVs,
              backgroundColor: "rgba(255,159,64,0.6)",
            },
            {
              label: "Existing Customer ACV",
              data: existingCustomerACVs,
              backgroundColor: "rgba(54,162,235,0.6)",
            },
          ],
        });
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div style={{ height: 400, width: 800 }}>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "ACV by Fiscal Quarter",
            },
            datalabels: {
              display: true,
              color: "black",
              anchor: "end",
              align: "start",
              formatter: (value) => value.toLocaleString(),
            },
          },
        }}
      />
    </div>
  );
}

export default Verticalchart;
