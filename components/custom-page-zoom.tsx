import { FC, memo, useEffect, useMemo, useRef, useState } from "react";
import { Page } from "react-pdf";

export type CustomPageProps = {
  pageNumber: number;
  scale: number;
  setCssScale: (b: number) => void;
  onPageRendered: (p: number, h: boolean) => void;
};

const CustomPage: FC<CustomPageProps> = ({
  pageNumber,
  scale,
  setCssScale,
  onPageRendered,
}) => {
  const [renderedScale, setRenderedScale] = useState<number | null>(1);
  const [renderedPageNumber, setRenderedPageNumber] = useState<null | number>(
    null
  );
  const isLoading =
    renderedScale !== scale || renderedPageNumber !== pageNumber;
  // console.log("scale", scale);
  // console.log("renderedScale", renderedScale);

  useEffect(() => {
    if (isLoading && renderedScale) {
      onPageRendered(pageNumber - 1, false);
      // "fake" zoom with css
      setCssScale(scale / renderedScale);
    }
  }, [
    setCssScale,
    isLoading,
    renderedScale,
    scale,
    pageNumber,
    onPageRendered,
  ]);

  return (
    <>
      {isLoading && renderedPageNumber && renderedScale ? (
        <Page
          key={`${renderedPageNumber}@${renderedScale}`}
          className="prevPage"
          pageNumber={renderedPageNumber}
          scale={renderedScale}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      ) : null}
      <Page
        key={`${pageNumber}@${scale}`}
        pageNumber={pageNumber}
        className={isLoading ? "mainPage" : ""}
        scale={scale}
        onRenderSuccess={() => {
          setRenderedPageNumber(pageNumber);
          setRenderedScale(scale);
          onPageRendered(pageNumber - 1, true);
        }}
        renderTextLayer={false}
        renderAnnotationLayer={false}
      />
    </>
  );
};

export default memo(CustomPage, (prev, next) => {
  if (prev.scale === next.scale) true;
  return false;
});
