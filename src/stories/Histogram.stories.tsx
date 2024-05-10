import type { Meta } from "@storybook/react";
import Histogram from "../components/Histogram";
import { getScatterData } from "../utils/dummyData";

const dummyData = getScatterData(100);

const meta: Meta<typeof Histogram> = {
  component: Histogram,
  title: "Histogram",
  decorators: [
    (Story) => (
      <div className="m-12 max-h-96">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
};

export const Default = {
  args: {
    data: dummyData,
    xAccessor: (d: ScatterDatum) => d.humidity,
    label: "Humidity",
  },
};

export default meta;
