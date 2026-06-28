export default function BookingStepper({ status }) {
  const steps = ['CREATED', 'CONFIRMED', 'STARTED', 'COMPLETED'];
  const currentIndex = steps.indexOf(status);

  if (status === 'CANCELLED') {
    return (
      <span className="badge badge-cancelled" style={{ alignSelf: 'flex-start' }}>
        CANCELLED
      </span>
    );
  }

  return (
    <div className="stepper">
      {steps.map((step, index) => {
        const isActive = index <= currentIndex;
        return (
          <div key={step} className={`step ${isActive ? 'step-active' : ''}`}>
            <div className="step-dot"></div>
            <span className="step-label">{step}</span>
            {index < steps.length - 1 && <div className="step-line"></div>}
          </div>
        );
      })}
    </div>
  );
}
