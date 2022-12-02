import { FC, memo, useEffect, useMemo, useRef, useState } from "react";
import { Page } from "react-pdf";

export type CustomPageProps = {
  pageNumber: number;
  scale: number;
  setCssScale: (b: number) => void;
  onPageRendered: (p: number, h: boolean) => void;
  renderedScale: number | null;
  setRenderedScale: (b: number | null) => void;
  areAllPagesRendered: boolean;
};

const CustomPage: FC<CustomPageProps> = ({
  pageNumber,
  scale,
  setCssScale,
  onPageRendered,
  renderedScale,
  setRenderedScale,
  areAllPagesRendered,
}) => {
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

  // console.count("counter");
  if (pageNumber === 1) console.log("isLoading", isLoading);

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
          setRenderedScale(scale);
          setRenderedPageNumber(pageNumber);
          onPageRendered(pageNumber - 1, true);
        }}
        renderTextLayer={false}
        renderAnnotationLayer={false}
      />
    </>
  );
};

export default memo(CustomPage);
