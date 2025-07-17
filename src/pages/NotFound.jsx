import React from 'react';
import { Link, useRouteError } from 'react-router-dom';

function NotFoundPage() {
  const error = useRouteError();
  const is404 = error?.status === 404;
  
  return (
    <div className="page not-found-page">
      <h1>{is404 ? 'Page Not Found' : 'Oops!'}</h1>
      <p>{is404 ? "Sorry, we couldn't find the page you're looking for." : "Sorry, an unexpected error has occurred."}</p>
      {!is404 && (
        <p className="error-message">
          {error?.statusText || error?.message || 'Unknown error'}
        </p>
      )}
      <Link to="/" className="home-link">Go back to homepage</Link>
    </div>
  );
}

export default NotFoundPage;
