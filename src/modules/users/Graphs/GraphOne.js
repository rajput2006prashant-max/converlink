
import React, { useState, useEffect, Fragment } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

function Graphpage() {
  const [c, d] = useState([]);
  const [a, b] = useState([]);
  const [x, y] = useState([]);

  const myapi = () => {
    axios.get("https://dummyjson.com/products").then((r) => {
      const products = r.data.products;

      console.log(products);

      y(products);
      d(products);

      const mydata = products.map((item) => {
        return item.category;
      });

      const que = [...new Set(mydata)];
      b(que);
    });
  };

  const mydatafilter = (v) => {
    const value = v.target.value;

    if (value === "all") {
      y(c);
    } else {
      const filteredData = c.filter((f) => {
        return f.category === value;
      });

      y(filteredData);
    }
  };

  useEffect(() => {
    myapi();
  }, []);

  return (
    <Fragment>
      <div className="container-fluid py-4">
        <div className="row mb-4">
          <div className="col-md-3">
            <select
              className="form-select"
              onChange={mydatafilter}
            >
              <option value="all">All Categories</option>

              {a.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ width: "100%", height: "400px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={x}>
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Bar dataKey="price" fill="red" name="Price" />
              <Bar dataKey="stock" fill="green" name="Stock" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Fragment>
  );
}

export default Graphpage;
