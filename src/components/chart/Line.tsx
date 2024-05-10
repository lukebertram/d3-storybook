import * as d3 from "d3";

type LineType = "line" | "area";
type LineProps = {
  type?: LineType;
  data: Record<string, unknown>[];
  xAccessor: (d: Datum) => number;
  yAccessor: (d: Datum) => number;
  y0Accessor?: Accessor | number;
  interpolation?: d3.CurveFactory;
  [x: string]: unknown;
};

const Line = ({
  type = "line",
  data,
  xAccessor,
  yAccessor,
  y0Accessor = 0,
  interpolation = d3.curveMonotoneX,
  ...props
}: LineProps) => {
  const lineGenerator = d3[type]()
    .x(xAccessor)
    .y(yAccessor)
    .curve(interpolation);

  if (type === "area") {
    lineGenerator.y0(y0Accessor).y1(yAccessor);
  }

  return (
    <path
      {...props}
      className={`Line Line--type-${type}`}
      d={lineGenerator(data)}
    />
  );
};

export default Line;
