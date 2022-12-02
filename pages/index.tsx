import Head from "next/head";
import styles from "../styles/Home.module.css";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Document, pdfjs } from "react-pdf";
import Toolbar from "../components/toolbar";
import CustomPage from "../components/custom-page-zoom";

export default function Home() {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

  const [scale, setScale] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [cssScale, setCssScale] = useState<number>(1);
  const [pageState, setPageState] = useState<boolean[]>([]);

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
    if (areAllPagesRendered) {
      setCssScale(1);
    }
  }, [areAllPagesRendered]);

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
          <CustomPage
            key={1}
            pageNumber={1}
            scale={scale}
            setCssScale={setCssScale}
            onPageRendered={onPageRendered}
          />
          {/* {Array.from(Array(totalPages).keys()).map((pageNumber) => (
            <CustomPage
              key={pageNumber + 1}
              pageNumber={pageNumber + 1}
              scale={scale}
              setCssScale={setCssScale}
              onPageRendered={onPageRendered}
            />
          ))} */}
        </div>
      </Document>
      <Toolbar scale={scale} setScale={setScale} />
    </div>
  );
}
