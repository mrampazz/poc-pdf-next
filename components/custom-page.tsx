import { FC, useEffect, useMemo, useRef, useState } from "react";
import { Page } from "react-pdf";

export type CustomPageProps = {
  pageNumber: number;
  scale: number;
  setIsScaling: (b: number) => void;
};

const CustomPage: FC<CustomPageProps> = ({
  pageNumber,
  scale,
  setIsScaling,
}) => {
  const [renderedPageNumber, setRenderedPageNumber] = useState<null | number>(
    null
  );
  const [renderedScale, setRenderedScale] = useState<null | number>(null);
  const isLoading =
    renderedScale !== scale || renderedPageNumber !== pageNumber;

  useEffect(() => {
    if (isLoading && renderedScale) {
      setIsScaling(scale / renderedScale);
    }
  }, [setIsScaling, isLoading, renderedScale, scale]);

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
          setIsScaling(1);
        }}
        renderTextLayer={false}
        renderAnnotationLayer={false}
      />
    </>
  );
};

export default CustomPage;
