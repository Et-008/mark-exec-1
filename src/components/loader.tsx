import React, { useEffect, useState } from "react";

function Loader() {
  const [i, setI] = useState<number>(0);

  let interval: NodeJS.Timeout | null = null;

  function draw() {
    if (i < 100) {
      setI((i) => {
        if (i < 99) {
          return i + 1;
        } else {
          clearInterval(interval);
          return 99;
        }
      });
    }
  }

  useEffect(() => {
    clearInterval(interval);
    interval = setInterval(() => {
      draw();
    }, 25);
  }, []);

  return (
    <div className="flex justify-center items-center h-full">
      {/* <div className="progress-bar" style={{ width: `${i}%` }} /> */}
      <div className="flex justify-center items-center relative">
        <div className="loader" />
        <h1 className="count">{Math.round(i)}%</h1>
      </div>
    </div>
  );
}

export default Loader;
