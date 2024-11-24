import React from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";
import "../index.css";

const HomePage = ({ isAuthenticated }) => {
  const categories = [
    { icon: "pi pi-desktop", name: "Digital Services", count: "1.2k+" },
    { icon: "pi pi-camera", name: "Creative & Design", count: "800+" },
    { icon: "pi pi-chart-line", name: "Marketing", count: "500+" },
    { icon: "pi pi-code", name: "Programming", count: "900+" },
  ];

  return (
    <div className="homepage">
      <section className="welcome-section">
        <Card className="welcome-card">
          <div className="welcome-content">
            <h1>Find the Perfect Service for Your Business</h1>
            <p className="subtitle">
              Connect with skilled professionals and get your work done
            </p>
            <div className="welcome-actions">
              <Button
                label="Browse Services"
                icon="pi pi-search"
                className="p-button-lg"
              />
              {!isAuthenticated && (
                <Button
                  label="Join Now"
                  icon="pi pi-user-plus"
                  className="p-button-outlined p-button-lg"
                />
              )}
            </div>
          </div>
        </Card>
      </section>

      <section className="categories-section">
        <h2>Popular Categories</h2>
        <Divider />
        <div className="categories-grid">
          {categories.map((category, index) => (
            <Card key={index} className="category-card">
              <div className="category-content">
                <i className={`${category.icon} category-icon`}></i>
                <h3>{category.name}</h3>
                <Tag value={category.count} severity="info" />
              </div>
            </Card>
          ))}
        </div>
      </section>

      {isAuthenticated ? (
        <section className="actions-section">
          <Card className="action-card">
            <div className="action-content">
              <h2>Ready to Start Selling?</h2>
              <p>
                Create your service and reach thousands of potential clients
              </p>
              <Button
                label="Create Service"
                icon="pi pi-plus"
                className="p-button-success p-button-lg"
              />
            </div>
          </Card>
        </section>
      ) : (
        <section className="join-section">
          <Card className="join-card">
            <div className="join-content">
              <h2>Join Our Growing Community</h2>
              <p>Get access to exclusive features and opportunities</p>
              <Button
                label="Sign Up Now"
                icon="pi pi-sign-in"
                className="p-button-lg"
              />
            </div>
          </Card>
        </section>
      )}
    </div>
  );
};

export default HomePage;
