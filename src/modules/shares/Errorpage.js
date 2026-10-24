
import React from "react";

function ErrorPage() {
  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">

      <div className="text-center">

        <h1 className="display-1 fw-bold text-primary">
          404
        </h1>

        <h2 className="fw-bold">
          Oops! Page Not Found
        </h2>

        <p className="text-secondary mt-3">
          The page you are looking for doesn't exist
          or has been moved.
        </p>

        <a href="/" className="btn btn-primary mt-3 px-4">
          <i className="bi bi-house me-2"></i>
          Go to Home
        </a>

      </div>

    </div>
  );
}

export default ErrorPage;
