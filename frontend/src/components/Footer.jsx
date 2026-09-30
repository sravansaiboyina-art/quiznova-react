import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">

      <div className="container">

        <div className="row">

          {/* Logo */}
          <div className="col-lg-4">

            <h3 className="text-white">

              <i className="bi bi-mortarboard-fill"></i>{" "}
              QuizNova

            </h3>

            <p className="mt-3">
              Learn, Practice and Improve your skills with QuizNova.
            </p>

          </div>


          {/* Quick Links */}
          <div className="col-lg-2">

            <h5>Quick Links</h5>

            <ul className="list-unstyled">

              <li>
                <Link to="/">
                  Home
                </Link>
              </li>

              <li>
                <Link to="/about">
                  About
                </Link>
              </li>

              <li>
                <Link to="/quiz">
                  Quiz
                </Link>
              </li>

              <li>
                <Link to="/contact">
                  Contact
                </Link>
              </li>

            </ul>

          </div>


          {/* Categories */}
          <div className="col-lg-3">

            <h5>Categories</h5>

            <ul className="list-unstyled">

              <li>Programming</li>
              <li>Aptitude</li>
              <li>Science</li>
              <li>Reasoning</li>

            </ul>

          </div>


          {/* Social */}
          <div className="col-lg-3">

            <h5>Follow Us</h5>

            <div className="social-icons">

              <a href="#" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>

              <a href="#" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>

              <a href="#" aria-label="Twitter">
                <i className="bi bi-twitter-x"></i>
              </a>

              <a href="#" aria-label="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>

              <a href="#" aria-label="GitHub">
                <i className="bi bi-github"></i>
              </a>

            </div>

          </div>

        </div>


        <hr />

        <div className="text-center">

          <p>
            © 2026 QuizNova. All Rights Reserved.
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;