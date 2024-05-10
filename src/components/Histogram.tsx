import * as d3 from "d3";

import Chart from "./chart/Chart";
import Bars from "./chart/Bars";
import Axis from "./chart/Axis";
import Gradient from "./chart/Gradient";
import {
  useChartDimensions,
  useChartDimensionsPlus,
  useUniqueId,
} from "../utils/chartUtils";
import { useRef, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

const DEFAULT_DIMENSIONS = {
  width: 0,
  height: 0,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,
  boundedWidth: 0,
  boundedHeight: 0,
};

const gradientColors = ["#9980FA", "rgb(225, 222, 243)"];
const Histogram = ({ data, xAccessor, label }) => {
  // const [dimensions, setDimensions] =
  //   useState<BoundedDimensions>(DEFAULT_DIMENSIONS);
  const gradientId = useUniqueId("Histogram-gradient");
  const ref = useRef<HTMLDivElement>(null);
  // const handleResize = useDebounceCallback(setDimensions, 200);
  const dimensions = useChartDimensionsPlus({
    ref,
    passedDimensions: {
      marginBottom: 77,
    },
    // onResize: handleResize,
  });

  const numberOfThresholds = 9;

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice();

  const binsGenerator = d3
    .bin()
    .domain(xScale.domain())
    .value(xAccessor)
    .thresholds(xScale.ticks(numberOfThresholds));

  const bins = binsGenerator(data);

  const yAccessor = (d) => d.length;
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(bins, yAccessor)])
    .range([dimensions.boundedHeight, 0])
    .nice();

  const barPadding = 2;

  const xAccessorScaled = (d) => xScale(d.x0) + barPadding;
  const yAccessorScaled = (d) => yScale(yAccessor(d));
  const widthAccessorScaled = (d) => xScale(d.x1) - xScale(d.x0) - barPadding;
  const heightAccessorScaled = (d) =>
    dimensions.boundedHeight - yScale(yAccessor(d));
  const keyAccessor = (_d, i: number) => i;

  return (
    <div
      className="Histogram h-[500px] flex-1 min-w-[500px] overflow-hidden"
      ref={ref}
    >
      <Chart dimensions={dimensions}>
        <defs>
          <Gradient id={gradientId} colors={gradientColors} x2="0" y2="100%" />
        </defs>
        {dimensions.boundedWidth && (
          <>
            <Axis dimension="x" scale={xScale} label={label} />
            <Axis dimension="y" scale={yScale} label="Count" />
            <Bars
              data={bins}
              keyAccessor={keyAccessor}
              xAccessor={xAccessorScaled}
              yAccessor={yAccessorScaled}
              widthAccessor={widthAccessorScaled}
              heightAccessor={heightAccessorScaled}
              style={{ fill: `url(#${gradientId})` }}
            />
          </>
        )}
      </Chart>
    </div>
  );
};

export default Histogram;
