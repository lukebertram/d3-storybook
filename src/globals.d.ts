// Global types
type ScatterDatum = Datum & {
  temperature: number;
  humidity: number;
};
type TimelineDatum = Datum & {
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

type Datum = {
  [key?: string]: string | number;
};

type;
type NumberAccessor<T> = (d: T, i: number, data: Iterable<T>) => number;
type Accessor<T, U> = (d: T, i: number, data: Iterable<T>) => U;

type DateAccessor = Accessor<Date>;

type WeatherAccessor = (d: WeatherDatum, i?: number) => number | string | null;

type BaseDimensions = {
  height?: number;
  width?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  pathwayHeight?: number;
  pathwayBarWidth?: number;
  pathwayBarPadding?: number;
};

type BoundedDimensions = BaseDimensions & {
  boundedHeight: number;
  boundedWidth: number;
};
