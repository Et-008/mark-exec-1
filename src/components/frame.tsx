import React from "react";

type FrameProps = {
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
};

const Frame: React.FC<FrameProps> = ({
  loading = false,
  className = "",
  children,
}) => {
  return (
    <div
      className={[
        "relative w-full h-[600px] rounded-xl border-4 border-gray-200 bg-white shadow-xl overflow-hidden",
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-lg before:shadow-[inset_0_0_0_2px_rgba(0,0,0,0.05)]",
        className,
      ].join(" ")}
    >
      <div
        className={[
          "absolute inset-2 rounded-md overflow-hidden bg-gray-50",
          loading ? "opacity-50" : "opacity-100",
        ].join(" ")}
      >
        {children}
      </div>

      <div
        className={[
          "pointer-events-none absolute inset-2 rounded-md overflow-hidden",
          loading ? "opacity-100" : "opacity-0",
          "transition-opacity duration-300",
        ].join(" ")}
        aria-hidden
      >
        <div
          className={["scanner-line", loading ? "" : "scanner-paused"].join(
            " "
          )}
        />
      </div>
    </div>
  );
};

export default Frame;
