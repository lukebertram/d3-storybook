import React, { useState } from "react";
import type { Meta } from "@storybook/react";
import Tooltip from "../components/chart/Tooltip";

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
  title: "Tooltip",
  decorators: [
    (Story) => {
      const [coords, setCoords] = useState<number[]>([0, 0]);
      const [isVisible, setVisible] = useState(false);
      const handleMouseMove: React.MouseEventHandler = ({ nativeEvent }) => {
        const newCoords = [nativeEvent.offsetX, nativeEvent.offsetY];
        console.log(newCoords);
        setCoords(newCoords);
      };
      const handleMouseEnter: React.MouseEventHandler = () => {
        console.log("MOUSEENTER");
        setVisible(true);
      };

      const handleMouseLeave: React.MouseEventHandler = () => {
        console.log("MOUSELEAVE");
        setVisible(false);
      };
      return (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          className="Wrapper relative h-96 w-full bg-slate-700"
        >
          <Story isVisible={isVisible} xPos={coords[0]} yPos={coords[1]} />
        </div>
      );
    },
  ],
  tags: ["autodocs"],
};

export const Default = {
  args: {
    children: (
      <>
        <div className="mb-1 font-semibold">
          Humidity: <span className="range">15-20%</span>
        </div>
        <div className="tooltip-value font-semibold">
          <span className="count">5</span>
          {` days`}
        </div>
      </>
    ),
  },
};

export default meta;
