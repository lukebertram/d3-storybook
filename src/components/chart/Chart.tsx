import { createContext, useContext } from "react";

type ChartProps = {
  dimensions: BoundedDimensions;
  children?: React.ReactNode;
};

const defaultDimensions = {
  width: 0,
  height: 0,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,
  boundedWidth: 0,
  boundedHeight: 0,
};

const ChartContext = createContext<BoundedDimensions>(defaultDimensions);
export const useDimensionsContext = () => useContext(ChartContext);

const Chart = ({ dimensions, children }: ChartProps) => (
  <ChartContext.Provider value={dimensions}>
    <svg
      className="overflow-visible text-slate-500"
      width={dimensions.width}
      height={dimensions.height}
    >
      <g
        transform={`translate(${dimensions.marginLeft},${dimensions.marginTop})`}
      >
        {children}
      </g>
    </svg>
  </ChartContext.Provider>
);

export default Chart;
