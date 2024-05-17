import React from "react";

export type TooltipProps = {
  isVisible: boolean;
  xPos: number;
  yPos: number;
  children?: React.ReactNode;
};

const Tooltip = ({ isVisible, xPos, yPos, children }: TooltipProps) => {
  return (
    <div
      className={`absolute -top-3 left-0 z-10 rounded-md border-2 border-solid border-slate-400 bg-white px-2 py-4 ${isVisible ? "opacity-1" : "opacity-0"} transition-all duration-200 ease-out`}
      style={{
        transform:
          `translate(` +
          `calc(-50% + ${xPos}px),` +
          `calc(-100% + ${yPos}px)` +
          `)`,
      }}
    >
      <div
        className={`absolute bottom-0 left-1/2 z-10 h-3 w-3 origin-center -translate-x-1/2 translate-y-1/2 rotate-45 border-2 border-solid border-slate-400 border-l-transparent border-t-transparent bg-white`}
      ></div>
      {children}
    </div>
  );
};

export default Tooltip;
