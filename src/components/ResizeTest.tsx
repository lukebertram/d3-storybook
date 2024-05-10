import { useRef } from "react";
import { useChartDimensionsPlus } from "../utils/chartUtils";

const ResizeTest = () => {
  const ref = useRef<HTMLDivElement>(null);

  const dimensions = useChartDimensionsPlus({ ref });

  return (
    <div
      className={`bg-slate-800 w-[${dimensions.width}] h-[${dimensions.height}]`}
    >
      THIS IS A TEST
    </div>
  );
};

export default ResizeTest;
