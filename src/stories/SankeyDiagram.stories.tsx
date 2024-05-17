import type { Meta } from "@storybook/react";
import Sankey from "../components/Sankey";
import dataset from "../assets/education.json";

const meta: Meta<typeof Sankey> = {
  component: Sankey,
  title: "Sankey",
  // decorators: [
  //   (Story) => (
  //     <div className="m-12 max-h-96">
  //       <Story />
  //     </div>
  //   ),
  // ],
  // tags: ["autodocs"],
};

export const Default = {
  args: {
    dataset,
  },
};

export default meta;
