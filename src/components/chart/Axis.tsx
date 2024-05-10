import * as d3 from "d3";
import { useDimensionsContext } from "./Chart";

const axisComponentsByDimension = {
  x: AxisHorizontal,
  y: AxisVertical,
};

type AxisProps = {
  dimension: "x" | "y";
  scale:
    | (number[] & d3.ScaleLinear<number, number, never>)
    | (Date[] & d3.ScaleTime<number, number, never>)
    | d3.ScaleLinear<number, number, never>;
  label?: string;
  // formatTick?: ((date: number) => string) | ((date: Date) => string);
  formatTick?: FormatDate;
  // [x: string]: unknown;
};

const Axis = ({
  dimension = "x",
  scale,
  // scale = null, <== Why this in the book?
  formatTick = d3.format(","),
  ...props
}: AxisProps) => {
  const dimensions = useDimensionsContext();
  const Component = axisComponentsByDimension[dimension];
  if (!Component) return null;

  return (
    <Component
      {...props}
      dimensions={dimensions}
      scale={scale}
      formatTick={formatTick}
    />
  );
};

export default Axis;

const formatNumber = d3.format(",");

type SubAxisProps = Omit<AxisProps, "dimension"> & {
  dimensions: BoundedDimensions;
};

function AxisHorizontal({
  dimensions,
  label,
  formatTick = formatNumber,
  scale,
  ...props
}: SubAxisProps) {
  const numberOfTicks =
    dimensions.boundedWidth < 600
      ? dimensions.boundedWidth / 100
      : dimensions.boundedWidth / 250;
  const ticks = scale.ticks(numberOfTicks);

  return (
    <g
      className="Axis AxisHorizontal"
      transform={`translate(0, ${dimensions.boundedHeight})`}
      {...props}
    >
      <line
        className="Axis__line stroke-slate-400"
        x2={dimensions.boundedWidth}
      />
      {label && (
        <text
          className="Axis__label anchor-middle text-base tracking-wide"
          transform={`translate(${dimensions.boundedWidth / 2}, 60)`}
        >
          {label}
        </text>
      )}
      {ticks.map((tick) => (
        <text
          key={tick.toString()}
          className="Axis__tick text-sm transition-all duration-300 ease-out anchor-middle"
          transform={`translate(${scale(tick)}, 25)`}
        >
          {formatTick(tick)}
        </text>
      ))}
    </g>
  );
}

function AxisVertical({
  dimensions,
  label,
  formatTick = formatNumber,
  scale,
  ...props
}: SubAxisProps) {
  const numberOfTicks = dimensions.boundedHeight / 70;
  const ticks = scale.ticks(numberOfTicks);

  return (
    <g className="Axis AxisVertical" {...props}>
      <line
        className="Axis__line stroke-slate-400"
        y2={dimensions.boundedHeight}
      />
      {ticks.map((tick) => (
        <text
          key={tick.toString()}
          className="Axis__tick Axis__tick text-sm transition-all duration-300 ease-out anchor-end baseline-middle"
          transform={`translate(-16, ${scale(tick)})`}
        >
          {formatTick(tick)}
        </text>
      ))}
      {label && (
        <text
          className="Axis__label anchor-middle text-base tracking-wide"
          style={{
            transform: `translate(-56px, ${
              dimensions.boundedHeight / 2
            }px) rotate(-90deg)`,
          }}
        >
          {label}
        </text>
      )}
    </g>
  );
}
