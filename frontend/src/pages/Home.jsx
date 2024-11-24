import React from "react";

const HomePage = ({ isAuthenticated }) => {
  return (
    <div>
      <h1>Home Page</h1>
      {isAuthenticated ? (
        <div>Welcome back! You are logged in.</div>
      ) : (
        <div>Welcome! Please log in to access all features.</div>
      )}
    </div>
  );
};

export default HomePage;
