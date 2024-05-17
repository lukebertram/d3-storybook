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
import Tooltip from "./chart/Tooltip";

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

export type HistogramProps = {
  data: ScatterDatum[];
  xAccessor: NumberAccessor<ScatterDatum>;
  label: string;
};
const Histogram = ({ data, xAccessor, label }: HistogramProps) => {
  // const [hoveredElement, setHoveredElement] = useState(null);
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

  const xExtent = d3.extent(data, xAccessor);
  if (!xExtent[0] || !xExtent[1])
    throw new Error("Unable to generate xScale extent from supplied data");

  const xScale = d3
    .scaleLinear()
    .domain(xExtent)
    .range([0, dimensions.boundedWidth])
    .nice();

  // xScale.domain() usually returns a 2 element array of numbers (the highest & lowest
  // values of the scale's domain), but can return more when creating a
  // a domain for a piecewise scale. The following type cast should be only require
  // revision if this component needs to handle piecewise data in the future.
  const xDomain = xScale.domain() as [number, number];
  const binsGenerator = d3
    .bin()
    .domain(xDomain)
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

  const handleMouseEnter = (data: ScatterDatum) => {
    console.log("MOUSEENTER", data);
  };

  const handleMouseLeave = () => {
    console.log("MOUSELEAVE");
    // setHoveredElement(null);
  };

  return (
    <div
      className="Histogram relative h-[500px] min-w-[500px] flex-1 overflow-hidden"
      ref={ref}
    >
      {/* <Tooltip isVisible={} xPos={} yPos={}>
        Hello!
      </Tooltip> */}
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
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          </>
        )}
      </Chart>
    </div>
  );
};

export default Histogram;
