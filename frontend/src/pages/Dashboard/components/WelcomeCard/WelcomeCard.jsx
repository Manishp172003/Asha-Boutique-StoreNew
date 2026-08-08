import "./WelcomeCard.css";

const WelcomeCard = ({ firstName }) => {
  const getCurrentDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <div className="welcome-card">
      <div className="welcome-content">
        <h1>Welcome back, {firstName}</h1>
        <p className="tagline">Your boutique journey continues</p>
        <p className="date">{getCurrentDate()}</p>
      </div>
    </div>
  );
};

export default WelcomeCard;
