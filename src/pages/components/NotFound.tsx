import React from 'react';
import './NotFound.css';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404</h1>
      <h2 className="not-found-subtitle">Page Not Found</h2>
      <p className="not-found-text">
        Oops! The page you are looking for does not exist.
      </p>
      <Link to="/" className="not-found-link">
        Go back to the homepage
      </Link>
    </div>
  );
};

export default NotFound;
