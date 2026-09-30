import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About() {
  return (
    <>
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="about-hero">
        <div className="container">
          <div className="row align-items-center">

            {/* Left Content */}
            <div className="col-lg-6">
              <h1>
                About{" "}
                <span className="text-primary">
                  QuizNova
                </span>
              </h1>

              <p>
                QuizNova is an online learning platform designed
                to help students improve their knowledge through
                interactive quizzes.

                <br />

                Our mission is to make learning enjoyable,
                simple, and effective.
              </p>

              <Link
                to="/quiz"
                className="btn btn-primary btn-lg"
              >
                Start Learning
              </Link>
            </div>

            {/* Right Image */}
            <div className="col-lg-6 text-center">
              <img
                src="https://img.freepik.com/free-vector/online-learning-concept-illustration_114360-6186.jpg"
                className="img-fluid"
                alt="About QuizNova"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ================= OUR STORY ================= */}
      <section className="py-5">
        <div className="container">

          <div className="text-center mb-5">
            <h2>Our Story</h2>

            <p>
              Building a smarter way to learn.
            </p>
          </div>

          <div className="row">

            {/* Story Content */}
            <div className="col-lg-6">
              <p>
                QuizNova was created with the idea that learning
                should never be boring. Students often struggle
                with traditional study methods. Interactive quizzes
                help learners remember concepts faster and improve
                problem-solving skills.
              </p>

              <p>
                Today QuizNova offers multiple quiz categories,
                instant results, and performance analysis.
              </p>
            </div>

            {/* Story Image */}
            <div className="col-lg-6">
              <img
                src="https://img.freepik.com/free-vector/e-learning-concept-illustration_114360-3748.jpg"
                className="img-fluid rounded shadow"
                alt="Our Story"
              />
            </div>

          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}

export default About;