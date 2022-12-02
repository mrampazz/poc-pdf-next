import { FC } from "react";

export type ToolbarProps = {
  scale: number;
  setScale: (s: number) => void;
};

const Toolbar: FC<ToolbarProps> = ({ scale, setScale }) => {
  return (
    <div
      style={{
        position: "fixed",
        right: 0,
        top: 15,
      }}
    >
      <span>current scale: {scale}</span>
      <button onClick={() => setScale(Math.round((scale + 0.1) * 10) / 10)}>
        zoom in
      </button>
      <button onClick={() => setScale(Math.round((scale - 0.1) * 10) / 10)}>
        zoom out
      </button>
    </div>
  );
};

export default Toolbar;
