import React, { useEffect, useState } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function Donutchart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    // Fetching data from the JSON server
    axios
      .get("http://localhost:3000/data")
      .then((response) => {
        const data = response.data; 

        // Separating ACV values for Existing and New Customers
        const existingCustomerACVs = data
          .filter((item) => item.Cust_Type === "Existing Customer")
          .reduce((sum, item) => sum + item.acv, 0);

        const newCustomerACVs = data
          .filter((item) => item.Cust_Type === "New Customer")
          .reduce((sum, item) => sum + item.acv, 0);

        // Set the chart data like updation
        setChartData({
          labels: ["Existing Customer ACV", "New Customer ACV"],
          datasets: [
            {
              data: [existingCustomerACVs, newCustomerACVs],
              backgroundColor: ["rgba(54,162,235,0.6)", "rgba(255,159,64,0.6)"],
              borderColor: ["rgba(54,162,235,1)", "rgba(255,159,64,1)"],
              borderWidth: 1,
            },
          ],
        });
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <div style={{ height: 350, width: 800 }}>
        <Doughnut
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: "ACV Distribution Between Existing and New Customers",
              },
              datalabels: {
                display: true,
                align: "center",
                color: "#000",
                formatter: (value) => value.toLocaleString(), // Format numbers with commas
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default Donutchart;
