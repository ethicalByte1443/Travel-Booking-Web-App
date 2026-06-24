'use client';

export default function FeedbackModal({ isOpen, onClose, feedback }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="modal" role="dialog" aria-modal="true" aria-label="Feedback details" onClick={(event) => event.stopPropagation()}>
        <div className="stack-medium">
          <h2>{feedback.tourName}</h2>
          <p>{feedback.comment}</p>
          <button type="button" className="button primary" onClick={onClose}>Close</button>
        </div>
      </section>
    </div>
  );
}
