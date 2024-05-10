import { useState } from "react";
import { getDummyData } from "./utils/dummyData";
import { useInterval } from "usehooks-ts";
import Histogram from "./components/Histogram";

function App() {
  const [data, setData] = useState(getDummyData);

  // useInterval(() => {
  //   setData(getDummyData());
  // }, 5000);

  return (
    <div className="App">
      <h1>Weather Dashboard</h1>
      <div className="App__charts">
        <Histogram
          data={data.scatter}
          xAccessor={(d: ScatterDatum) => d.humidity}
          label="Humidity"
        />
      </div>
    </div>
  );
}

export default App;
