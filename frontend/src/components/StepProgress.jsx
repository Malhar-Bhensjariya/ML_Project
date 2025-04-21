import React from "react";

function StepProgress({ stepCount, setStepCount, data }) {
  return (
    <div className="flex gap-5 items-center mt-5">
      {/* Previous Button */}
      {stepCount !== 0 && (
        <button
          className="px-4 py-2 border rounded bg-gray-300 hover:bg-gray-400 transition-all"
          onClick={() => setStepCount(stepCount - 1)}
        >
          Previous
        </button>
      )}

      {/* Progress Bar */}
      <div className="flex gap-2 w-full">
        {data?.map((_, index) => (
          <div
            key={index}
            className={`w-full h-2 rounded-full ${
              index < stepCount ? "bg-blue-500" : "bg-gray-200"
            }`}
          ></div>
        ))}
      </div>

      {/* Next Button */}
      {stepCount < data.length - 1 && (
        <button
          className="px-4 py-2 border rounded bg-gray-300 hover:bg-gray-400 transition-all"
          onClick={() => setStepCount(stepCount + 1)}
        >
          Next
        </button>
      )}
    </div>
  );
}

export default StepProgress;
