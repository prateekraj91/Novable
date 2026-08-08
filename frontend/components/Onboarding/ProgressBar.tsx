type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
  titles: string[];
};

export default function ProgressBar({
  currentStep,
  totalSteps,
  titles,
}: ProgressBarProps) {
  // Same fraction the label shows, so the bar and the number never disagree.
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div style={{ marginBottom: 34 }}>
      {/* Step indicator */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <span className="nb-kicker" style={{ margin: 0 }}>
          Step {currentStep} of {totalSteps}
        </span>
        <span className="nb-quiet" style={{ fontSize: 13 }}>
          {Math.round((currentStep / totalSteps) * 100)}%
        </span>
      </div>

      {/* Progress track */}
      <div
        className="nb-step-track"
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`Step ${currentStep} of ${totalSteps}`}
      >
        <div className="nb-step-fill" style={{ width: `${percentage}%` }} />
      </div>

      {/* Step markers */}
      <div className="nb-steps">
        {titles.map((title, index) => {
          const step = index + 1;
          const state =
            step < currentStep
              ? "complete"
              : step === currentStep
                ? "active"
                : "upcoming";

          return (
            <div key={title} className="nb-step" data-state={state}>
              <div className="nb-step-dot">{state === "complete" ? "✓" : step}</div>
              <span className="nb-step-name">{title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
