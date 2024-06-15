import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const Table = () => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/data")
      .then((response) => {
        const data = response.data; 

        const quarters = ["2023-Q3", "2023-Q4", "2024-Q1", "2024-Q2"];
        const totalData = {
          count: 0,
          acv: 0,
          existing: { count: 0, acv: 0 },
          new: { count: 0, acv: 0 },
        };

        const tableData = quarters.map((quarter) => {
          const existingCustomer = data.find(
            (item) =>
              item.closed_fiscal_quarter === quarter &&
              item.Cust_Type === "Existing Customer"
          ) || { count: 0, acv: 0 };
          const newCustomer = data.find(
            (item) =>
              item.closed_fiscal_quarter === quarter &&
              item.Cust_Type === "New Customer"
          ) || { count: 0, acv: 0 };

          const totalACV = existingCustomer.acv + newCustomer.acv;

          totalData.count += existingCustomer.count + newCustomer.count;
          totalData.acv += totalACV;
          totalData.existing.count += existingCustomer.count;
          totalData.existing.acv += existingCustomer.acv;
          totalData.new.count += newCustomer.count;
          totalData.new.acv += newCustomer.acv;

          return {
            quarter,
            existingCustomer,
            newCustomer,
            totalACV,
            existingPercentage:
              totalACV > 0 ? (existingCustomer.acv / totalACV) * 100 : 0,
            newPercentage:
              totalACV > 0 ? (newCustomer.acv / totalACV) * 100 : 0,
          };
        });

        const finalTableData = tableData.map((row) => ({
          quarter: row.quarter,
          existingCustomer: {
            count: row.existingCustomer.count,
            acv: `$${row.existingCustomer.acv.toLocaleString()}`,
            percentage: `${row.existingPercentage.toFixed(0)}%`,
          },
          newCustomer: {
            count: row.newCustomer.count,
            acv: `$${row.newCustomer.acv.toLocaleString()}`,
            percentage: `${row.newPercentage.toFixed(0)}%`,
          },
          totalACV: `$${row.totalACV.toLocaleString()}`,
        }));

        const overallTotalACV = totalData.existing.acv + totalData.new.acv;

        finalTableData.push({
          quarter: "Total",
          existingCustomer: {
            count: totalData.existing.count,
            acv: `$${totalData.existing.acv.toLocaleString()}`,
            percentage: `${(
              (totalData.existing.acv / overallTotalACV) *
              100
            ).toFixed(0)}%`,
          },
          newCustomer: {
            count: totalData.new.count,
            acv: `$${totalData.new.acv.toLocaleString()}`,
            percentage: `${(
              (totalData.new.acv / overallTotalACV) *
              100
            ).toFixed(0)}%`,
          },
          totalACV: `$${overallTotalACV.toLocaleString()}`,
        });

        setTableData(finalTableData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // Handle error state if needed
      });
  }, []);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Closed Fiscal Quarter</th>
            <th># of Opps (Existing)</th>
            <th>ACV (Existing)</th>
            <th>% of Total (Existing)</th>
            <th># of Opps (New)</th>
            <th>ACV (New)</th>
            <th>% of Total (New)</th>
            <th>Total ACV</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              <td>{row.quarter}</td>
              <td>{row.existingCustomer.count}</td>
              <td>{row.existingCustomer.acv}</td>
              <td>{row.existingCustomer.percentage}</td>
              <td>{row.newCustomer.count}</td>
              <td>{row.newCustomer.acv}</td>
              <td>{row.newCustomer.percentage}</td>
              <td>{row.totalACV}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
