import React, { useEffect, useState } from "react";
import ScrollView from "./components/scroll";
import { mock } from "./data";
function App() {
  const [data, setData] = useState([]);
  const renderItem = ({ data: item }) => {
    return (
      <div key={item.id}>
        <div>{item.id}</div>
        <div>{item.name}</div>
        <div>
          <img src={item.img} alt="" />
        </div>
        <div>------------------------</div>
      </div>
    );
  };
  const getData = (f = false) => {
    if (f) {
      return;
    }
    // return fetch('http://172.16.2.123/mock/5eb53263e8930a18fe9123b9/list')
    return (
      mock()
        // .then((res) => res.json())
        .then((res) => {
          return res.result.data;
        })
    );
  };
  useEffect(() => {
    getData().then((d) => setData(d));
  }, []);

  return (
    <div className="App" style={{ height: "100vh" }}>
      <ScrollView data={data} renderItem={renderItem} />
    </div>
  );
}

export default App;
