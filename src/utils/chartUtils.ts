import React, { useEffect, useState, useRef } from "react";
import { useIsMounted, useResizeObserver } from "usehooks-ts";

export const callAccessor = (
  accessor: (d: Record<string, unknown>) => number | string,
  d: Record<string, unknown>,
  i: number,
) => (typeof accessor === "function" ? accessor(d, i) : accessor);

const DEFAULT_CHART_DIMENSIONS = {
  width: 0,
  height: 0,
  marginTop: 40,
  marginRight: 30,
  marginBottom: 40,
  marginLeft: 75,
};

export function getBoundedDimensions(
  dimensions?: Partial<BaseDimensions>,
): BoundedDimensions {
  // apply default margins if unspecified in input
  const parsedDimensions = {
    ...DEFAULT_CHART_DIMENSIONS,
    ...dimensions,
  };

  return {
    ...parsedDimensions,
    boundedHeight: Math.max(
      parsedDimensions.height -
        parsedDimensions.marginTop -
        parsedDimensions.marginBottom,
      0,
    ),
    boundedWidth: Math.max(
      parsedDimensions.width -
        parsedDimensions.marginLeft -
        parsedDimensions.marginRight,
      0,
    ),
  };
}

type Size = {
  width: number | undefined;
  height: number | undefined;
};

type UseResizeObserverOptions<T extends HTMLElement = HTMLElement> = {
  ref: React.RefObject<T>;
  passedDimensions?: BaseDimensions;
  onResize?: (dimensions: BoundedDimensions) => void;
  box?: "border-box" | "content-box" | "device-pixel-content-box";
};

const initialSize: Size = {
  width: undefined,
  height: undefined,
};
const initialBoundedDimensions: BoundedDimensions = {
  width: undefined,
  height: undefined,
  marginTop: undefined,
  marginRight: undefined,
  marginBottom: undefined,
  marginLeft: undefined,
  boundedHeight: 0,
  boundedWidth: 0,
};
export function useChartDimensionsPlus<T extends HTMLElement = HTMLElement>(
  options: UseResizeObserverOptions<T>,
): BoundedDimensions {
  const { ref, box = "content-box", passedDimensions } = options;
  const [{ width, height }, setSize] = useState<Size>(initialSize);
  const isMounted = useIsMounted();
  const previousSize = useRef<Size>({ ...initialSize });
  const onResize = useRef<((size: BoundedDimensions) => void) | undefined>(
    undefined,
  );
  onResize.current = options.onResize;

  useEffect(() => {
    if (!ref.current) return;

    if (typeof window === "undefined" || !("ResizeObserver" in window)) return;

    const observer = new ResizeObserver(([entry]) => {
      const boxProp =
        box === "border-box"
          ? "borderBoxSize"
          : box === "device-pixel-content-box"
            ? "devicePixelContentBoxSize"
            : "contentBoxSize";

      const newWidth = extractSize(entry, boxProp, "inlineSize");
      const newHeight = extractSize(entry, boxProp, "blockSize");

      const hasChanged =
        previousSize.current.width !== newWidth ||
        previousSize.current.height !== newHeight;

      if (hasChanged) {
        const newSize: Size = { width: newWidth, height: newHeight };
        previousSize.current.width = newWidth;
        previousSize.current.height = newHeight;

        if (onResize.current) {
          onResize.current(newSize);
        } else {
          if (isMounted()) {
            setSize(newSize);
          }
        }
      }
    });

    observer.observe(ref.current, { box });

    return () => {
      observer.disconnect();
    };
  }, [box, ref, isMounted]);

  const newBoundedDimensions = getBoundedDimensions({
    ...passedDimensions,
    width,
    height,
  });
  return newBoundedDimensions;
}

type BoxSizesKey = keyof Pick<
  ResizeObserverEntry,
  "borderBoxSize" | "contentBoxSize" | "devicePixelContentBoxSize"
>;

function extractSize(
  entry: ResizeObserverEntry,
  box: BoxSizesKey,
  sizeType: keyof ResizeObserverSize,
): number | undefined {
  if (!entry[box]) {
    if (box === "contentBoxSize") {
      return entry.contentRect[sizeType === "inlineSize" ? "width" : "height"];
    }
    return undefined;
  }

  return Array.isArray(entry[box])
    ? entry[box][0][sizeType]
    : // @ts-expect-error Support Firefox's non-standard behavior
      (entry[box][sizeType] as number);
}

export const useChartDimensions = (
  passedDimensions?: BaseDimensions,
): [React.RefObject<HTMLDivElement>, BoundedDimensions] => {
  const ref = useRef<HTMLDivElement>(null);
  const dimensions = getBoundedDimensions(passedDimensions);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  // if (dimensions.width && dimensions.height) return [ref, dimensions]
  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      if (!Array.isArray(entries)) return;
      if (!entries.length) return;

      const entry = entries[0];

      if (width !== entry.contentRect.width) {
        setWidth(entry.contentRect.width);
      }
      if (height !== entry.contentRect.height) {
        setHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(element);

    return () => resizeObserver.unobserve(element);
  }, [passedDimensions, height, width, dimensions]);

  const newDimensions = getBoundedDimensions({
    ...dimensions,
    width: dimensions.width || width,
    height: dimensions.height || height,
  });

  return [ref, newDimensions];
};

let lastId = 0;
export const useUniqueId = (prefix = "") => {
  lastId++;
  return [prefix, lastId].join("-");
};

export const getRandomNumberInRange = (min: number, max: number) =>
  Math.random() * (max - min) + min;
export const getRandomValue = (arr: Array<number>): number =>
  arr[Math.floor(getRandomNumberInRange(0, arr.length))];
export const sentenceCase = (str: string) =>
  [str.slice(0, 1).toUpperCase(), str.slice(1)].join("");
