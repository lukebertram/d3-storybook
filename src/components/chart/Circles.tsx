type CirclesProps = {
  data: Datum[];
  keyAccessor: Accessor;
  xAccessor: Accessor;
  yAccessor: Accessor;
  radius?: number | ((d) => number);
};

const Circles = ({
  data,
  keyAccessor,
  xAccessor,
  yAccessor,
  radius = 5,
}: CirclesProps) => (
  <>
    {data.map((d, i) => (
      <circle
        className="Circles__circle"
        key={keyAccessor(d, i)}
        cx={xAccessor(d, i)}
        cy={yAccessor(d, i)}
        r={typeof radius == "function" ? radius(d) : radius}
      />
    ))}
  </>
);

export default Circles;
