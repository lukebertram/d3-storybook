// Global types
type ScatterDatum = {
  temperature: number;
  humidity: number;
};
type TimelineDatum = {
  temperature: number;
  date: string;
};

type DateDatum = Datum & {
  date: string;
};

type FormatDateInput = Date | number;
type FormatDate = (date: Date) => string;

type WeatherDatum = ScatterDatum | TimelineDatum;

type XYDatum = Datum & {
  x: number | string;
  y: number | string;
};

type Accessor = (d: Datum, i?: number) => number | string | null;

type DateAccessor = (d: DateDatum, i?: number) => Date | null;

type WeatherAccessor = (d: WeatherDatum, i?: number) => number | string | null;

type BaseDimensions = {
  height?: number;
  width?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
};

type BoundedDimensions = BaseDimensions & {
  boundedHeight: number;
  boundedWidth: number;
};
