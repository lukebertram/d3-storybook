import * as d3 from "d3";
import { callAccessor } from "../../utils/chartUtils";

type BarsProps = {
  data: Datum[];
  keyAccessor: Accessor;
  xAccessor: Accessor;
  yAccessor: Accessor;
  widthAccessor: Accessor;
  heightAccessor: Accessor;
  [x: string]: unknown;
};

const Bars = ({
  data,
  keyAccessor,
  xAccessor,
  yAccessor,
  widthAccessor,
  heightAccessor,
  ...props
}: BarsProps) => (
  <>
    {data.map((d, i) => (
      <rect
        {...props}
        className="Bars__rect"
        key={keyAccessor(d, i)}
        x={callAccessor(xAccessor, d, i)}
        y={callAccessor(yAccessor, d, i)}
        width={d3.max([callAccessor(widthAccessor, d, i), 0])}
        height={d3.max([callAccessor(heightAccessor, d, i), 0])}
      />
    ))}
  </>
);

export default Bars;
