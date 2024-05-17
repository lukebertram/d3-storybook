import * as d3 from "d3";
import Chart from "./chart/Chart";
import {
  getBoundedDimensions,
  getRandomNumberInRange,
  getRandomValue,
  useChartDimensionsPlus,
} from "../utils/chartUtils";
import { useRef } from "react";

type SankeyDatum = {
  sex: "male" | "female";
  ses: "low" | "middle" | "high";
  "<High School": number;
  "High School": number;
  "Some Post-secondary": number;
  "Post-secondary": number;
  "Associate's": number;
  "Bachelor's and up": number;
};

// type SankeyDimensions = BoundedDimensions & {
// 	pathwayHeight: number,
// 	pathwayBarWidth: number,
//   pathwayBarPadding: number,
// }

type SankeyProps = {
  dataset: SankeyDatum[];
};

function getSankeyDimensions(windowInnerWidth: number): BoundedDimensions {
  const baseDimensions = {
    width: d3.min([windowInnerWidth * 0.9, 1200]) ?? 0,
    height: 500,
    marginTop: 10,
    marginRight: 120,
    marginBottom: 10,
    marginLeft: 120,
    pathwayHeight: 50,
    pathwayBarWidth: 15,
    pathwayBarPadding: 3,
  };

  return getBoundedDimensions(baseDimensions);
}

const Sankey = ({ dataset }: SankeyProps) => {
  const personId = useRef(0);
  const ref = useRef<HTMLDivElement>(null);
  const dimensions = useChartDimensionsPlus({
    ref,
    passedDimensions: {
      height: 500,
      marginTop: 10,
      marginRight: 120,
      marginBottom: 10,
      marginLeft: 120,
      pathwayHeight: 50,
      pathwayBarWidth: 15,
      pathwayBarPadding: 3,
    },
  });

  // ACCESSORS
  const sexAccessor = (d) => d.sex;
  const sexes = ["female", "male"];
  const sexIds = d3.range(sexes.length);

  const educationAccessor = (d) => d.education;
  const educationNames = [
    "<High School",
    "High School",
    "Some Post-secondary",
    "Post-secondary",
    "Associate's",
    "Bachelor's and up",
  ];
  const educationIds = d3.range(educationNames.length);

  const getStatusKey = ({ sex, ses }: { sex: string; ses: string }) =>
    [sex, ses].join("--");

  // NOTE: "SES" is a necessary abbreviation for "Socioeconomic Status"
  const sesAccessor = (d: { [k: string]: string | number; ses: string }) =>
    d.ses;
  const sesNames = ["low", "middle", "high"];
  const sesIds = d3.range(sesNames.length);

  const stackedProbabilities: Record<string, number[]> = {};
  dataset.forEach((startingPoint) => {
    const key = getStatusKey(startingPoint);
    let stackedProbability = 0;
    stackedProbabilities[key] = educationNames.map((education, i) => {
      stackedProbability += startingPoint[education] / 100; //TODO: How can I let typescript know this is ok?
      if (i == educationNames.length - 1) {
        return 1; // prevent any rounding errors from leaving a gap in the last bucket
      } else {
        return stackedProbability;
      }
    });
  });

  const generatePerson = (elapsed: number) => {
    personId.current = personId.current + 1;
    const sex = getRandomValue(sexIds);
    const ses = getRandomValue(sesIds);
    const statusKey = getStatusKey({
      sex: sexes[sex],
      ses: sesNames[ses],
    });
    const probabilities = stackedProbabilities[statusKey];
    const education = d3.bisect(probabilities, Math.random());

    return {
      id: personId.current,
      sex,
      ses,
      education,
      startTime: elapsed + getRandomNumberInRange(-0.1, 0.1),
      yJitter: getRandomNumberInRange(-15, 15),
    };
  };

  // SCALES
  const xScale = d3
    .scaleLinear()
    .domain([0, 1])
    .range([0, dimensions.boundedWidth])
    .clamp(true);

  return (
    <div className="relative flex flex-col items-center bg-slate-200 p-2 text-slate-900">
      <h2 className="mb-0 mt-5 text-2xl">
        What do people achieve within 12 years of starting high school?
      </h2>
      <p className="mb-12 max-w-[40rem] text-xl opacity-50">
        Simulated data based on a National Center for Education Statistics study
        of where high school sophomores are ten years later
      </p>
      <div ref={ref} className="wrapper min-h-[500px] w-11/12 min-w-[1200px]">
        <Chart dimensions={dimensions}>
          {dimensions.boundedWidth ? (
            <>
              <g className="Pathways" />
              <g className="SankeyStartLabels" />
              <g className="SankeyEndLabels" />
              <g className="SankeyLegend" />
              <g className="MalePeopleGroup" />
              <g className="FemalePeopleGroup" />
            </>
          ) : null}
        </Chart>
      </div>

      <p className="absolute bottom-4 left-8 text-sm italic opacity-50">
        Data from{" "}
        <a href="https://nces.ed.gov/programs/digest/d14/tables/dt14_104.91.asp">
          the U.S. Department of Education, National Center for Education
          Statistics, Education Longitudinal Study of 2002
        </a>
      </p>
    </div>
  );
};

export default Sankey;
