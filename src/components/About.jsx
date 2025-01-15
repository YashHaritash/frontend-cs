import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const About = () => {
  return (
    <div
      style={{
        backgroundColor: "#f7f9fc",
        paddingTop: "50px",
        paddingBottom: "50px",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            {/* Title Section */}
            <div className="text-center mb-5">
              <h1
                className="display-4"
                style={{ color: "#4a90e2", fontWeight: "600" }}
              >
                About CodeSync
              </h1>
              <p
                className="lead"
                style={{
                  color: "#4a4a4a",
                  fontWeight: "300",
                  fontSize: "1.2rem",
                  marginBottom: "30px",
                }}
              >
                A collaborative coding platform that allows developers to work
                together in real-time on coding projects.
              </p>
            </div>

            {/* Card Section */}
            <div className="card shadow-lg border-0 rounded-lg">
              <div className="card-body">
                {/* What is CodeSync */}
                <h3
                  className="card-title mb-4"
                  style={{
                    color: "#4a90e2",
                    fontWeight: "500",
                    fontSize: "1.8rem",
                  }}
                >
                  What is CodeSync?
                </h3>
                <p style={{ color: "#555", lineHeight: "1.6" }}>
                  CodeSync is a real-time collaborative platform designed for
                  developers to collaborate, code, and learn together. With
                  CodeSync, you can start a new session, invite your team, and
                  work on code in multiple languages in a shared environment.
                </p>

                {/* Features */}
                <h3
                  className="card-title mt-5 mb-4"
                  style={{
                    color: "#4a90e2",
                    fontWeight: "500",
                    fontSize: "1.8rem",
                  }}
                >
                  Features
                </h3>
                <ul style={{ color: "#555", lineHeight: "1.6" }}>
                  <li>
                    Real-time collaboration: Work on code together instantly.
                  </li>
                  <li>
                    Multiple language support: C, C++, JavaScript, Python, Java.
                  </li>
                  <li>
                    Session management: Create, join, or leave sessions with
                    unique IDs.
                  </li>
                  <li>
                    Secure and private: Sessions are protected with JWT
                    authentication.
                  </li>
                </ul>

                {/* How it Works */}
                <h3
                  className="card-title mt-5 mb-4"
                  style={{
                    color: "#4a90e2",
                    fontWeight: "500",
                    fontSize: "1.8rem",
                  }}
                >
                  How it Works
                </h3>
                <p style={{ color: "#555", lineHeight: "1.6" }}>
                  Simply log in, create or join a session, and start coding!
                  Whether you're working with a team or learning new concepts,
                  CodeSync makes real-time collaboration easy and efficient.
                </p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center mt-5">
              <h4 style={{ color: "#333" }}>Get Started Today!</h4>
              <p style={{ color: "#555", fontWeight: "300" }}>
                Sign up or log in to begin your collaborative coding journey.
              </p>
              <a
                href="/signup"
                className="btn btn-primary btn-lg px-4"
                style={{
                  backgroundColor: "#4a90e2",
                  borderColor: "#4a90e2",
                  fontWeight: "500",
                }}
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
