import './DNALoader.css';

const DNALoader = ({ isVisible = true, message = "Processing...", overlay = true }) => {
  if (!isVisible) return null;

  const content = (
    <>
      <div className="dna">
        <div className="link">
          <div></div>
          <div></div>
        </div>
        <div className="link">
          <div></div>
          <div></div>
        </div>
        <div className="link">
          <div></div>
          <div></div>
        </div>
        <div className="link">
          <div></div>
          <div></div>
        </div>
        <div className="link">
          <div></div>
          <div></div>
        </div>
        <div className="link">
          <div></div>
          <div></div>
        </div>
        <div className="link">
          <div></div>
          <div></div>
        </div>
        <div className="link">
          <div></div>
          <div></div>
        </div>
        <div className="link">
          <div></div>
          <div></div>
        </div>
        <div className="link">
          <div></div>
          <div></div>
        </div>
        <div className="link">
          <div></div>
          <div></div>
        </div>
        <div className="link">
          <div></div>
          <div></div>
        </div>
        <div className="link">
          <div></div>
          <div></div>
        </div>
        <div className="link">
          <div></div>
          <div></div>
        </div>
        <div className="link">
          <div></div>
          <div></div>
        </div>
        <div className="link">
          <div></div>
          <div></div>
        </div>
        <div className="link">
          <div></div>
          <div></div>
        </div>
        <div className="link">
          <div></div>
          <div></div>
        </div>
        <div className="link">
          <div></div>
          <div></div>
        </div>
        <div className="link">
          <div></div>
          <div></div>
        </div>
        <div className="link">
          <div></div>
          <div></div>
        </div>
        <div className="link">
          <div></div>
          <div></div>
        </div>
        <div className="link">
          <div></div>
          <div></div>
        </div>
        <div className="link">
          <div></div>
          <div></div>
        </div>
      </div>
      {message && (
        <p className="dna-loader-message">{message}</p>
      )}
    </>
  );

  if (overlay) {
    return (
      <div className="dna-loader-overlay">
        <div className="dna-loader-container">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="dna-loader-container">
      {content}
    </div>
  );
};

export default DNALoader;
