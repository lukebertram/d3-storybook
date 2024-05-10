import type { Meta } from "@storybook/react";
import ResizeTest from "../components/ResizeTest";
// import { getScatterData } from "../utils/dummyData";

// const dummyData = getScatterData(100);

const meta: Meta<typeof ResizeTest> = {
  component: ResizeTest,
  title: "ResizeTest",
};

export const Default = {
  args: {},
};

export default meta;
