import React from "react";
import Verticalchart from "./Verticalchart";
import Donutchart from "./Donutchart";
import "./App.css";
import Table from "./Table";

const App = () => {
  return (
    <div>
      <h4 className="heading">Won ACV mix by Cust Type</h4>
      <div className="box-1">
        <div className="box-2">
          <Verticalchart />
        </div>
        <div>
          <Donutchart />
        </div>
      </div>
      <div>
        <Table />
      </div>
    </div>
  );
};

export default App;
