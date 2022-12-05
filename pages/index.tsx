import Head from "next/head";
import styles from "../styles/Home.module.css";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Document, pdfjs } from "react-pdf";
import Toolbar from "../components/toolbar";
import CustomPage from "../components/custom-page-zoom";

function useDebounce(value: any, delay: number) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}

export default function Home() {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [pageState, setPageState] = useState<boolean[]>([]);

  // actual scale
  const [scale, setScale] = useState<number>(1);

  // css scale, this will change depending of the user AND on when loading the canvas
  const [cssScale, setCssScale] = useState<number>(1);

  const areAllPagesRendered = useMemo(() => {
    if (pageState.length > 0 && pageState.every((it) => !!it)) return true;
    return false;
  }, [pageState]);

  const onPageRendered = useCallback(
    (pageNumber: number, hasRendered: boolean) => {
      setPageState((prevPageState) => {
        const cp = [...prevPageState];
        cp[pageNumber] = hasRendered;
        return cp;
      });
    },
    []
  );

  useEffect(() => {
    if (areAllPagesRendered && cssScale !== 1) {
      setCssScale(1);
    }
  }, [areAllPagesRendered, cssScale]);

  return (
    <div className={styles.container}>
      <Document
        file="book.pdf"
        onLoadSuccess={({ numPages }) => setTotalPages(numPages)}
      >
        <div
          style={{
            transform: `scale(${cssScale})`,
            transformOrigin: "0 0",
          }}
        >
          {/* <CustomPage
            key={1}
            pageNumber={1}
            scale={scale}
            setCssScale={setCssScale}
            onPageRendered={onPageRendered}
            renderedScale={renderedScale}
            setRenderedScale={setRenderedScale}
            areAllPagesRendered={areAllPagesRendered}
          /> */}
          {Array.from(Array(totalPages).keys()).map((pageNumber) => (
            <CustomPage
              key={pageNumber + 1}
              pageNumber={pageNumber + 1}
              scale={scale}
              setCssScale={setCssScale}
              onPageRendered={onPageRendered}
            />
          ))}
        </div>
      </Document>
      <Toolbar scale={scale} setScale={setScale} />
    </div>
  );
}
