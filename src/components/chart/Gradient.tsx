type GradientProps = {
  id: string;
  colors: string[];
  [x: string]: unknown;
};

const Gradient = ({ id, colors, ...props }: GradientProps) => (
  <linearGradient
    id={id}
    gradientUnits="userSpaceOnUse"
    spreadMethod="pad"
    {...props}
  >
    {colors.map((color, i) => (
      <stop
        key={i}
        offset={`${(i * 100) / (colors.length - 1)}%`}
        stopColor={color}
      />
    ))}
  </linearGradient>
);

export default Gradient;
