import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="hero py-5">
        <div className="container">
          <div className="row align-items-center">

            <div className="col-lg-6">
              <span className="badge bg-primary mb-3">
                Smart Quiz Generator
              </span>

              <h1 className="display-4 fw-bold mb-3">
                Learn, Practice & Improve Your Skills
              </h1>

              <p className="lead text-muted mb-4">
                QuizNova helps students practice quizzes,
                improve knowledge, and get instant results
                with an interactive learning experience.
              </p>

              <div className="mb-4">
                <p>✅ 500+ Questions</p>
                <p>✅ 10+ Categories</p>
                <p>✅ Instant Results</p>
              </div>

              <Link
                to="/quiz"
                className="btn btn-primary btn-lg me-3"
              >
                Start Quiz
              </Link>

              <Link
                to="/about"
                className="btn btn-outline-primary btn-lg"
              >
                Learn More
              </Link>
            </div>

            <div className="col-lg-6 text-center">
              <img
                src="https://img.freepik.com/free-vector/online-test-concept-illustration_114360-5524.jpg"
                className="img-fluid"
                alt="QuizNova Hero"
              />
            </div>

          </div>
        </div>
      </section>


      {/* WHY CHOOSE QUIZNOVA */}
      <section className="py-5 bg-light">
        <div className="container">

          <div className="text-center mb-5">
            <h2 className="fw-bold">
              Why Choose QuizNova?
            </h2>

            <p className="text-muted">
              Everything you need for an interactive learning experience.
            </p>
          </div>

          <div className="row g-4">

            <Feature
              icon="bi-lightning-charge-fill"
              title="Instant Results"
              text="Get your score immediately after completing the quiz."
            />

            <Feature
              icon="bi-grid-fill"
              title="Multiple Categories"
              text="Practice Programming, Aptitude, GK, Science and more."
            />

            <Feature
              icon="bi-phone-fill"
              title="Responsive Design"
              text="Access quizzes from desktop, tablet and mobile devices."
            />

            <Feature
              icon="bi-graph-up-arrow"
              title="Performance Analysis"
              text="Track your score and improve your learning progress."
            />

          </div>
        </div>
      </section>


      {/* CATEGORIES */}
      <section className="categories py-5" id="categories">
        <div className="container">

          <div className="text-center mb-5">
            <h2 className="fw-bold">
              Quiz <span className="text-primary">Categories</span>
            </h2>

            <p className="text-muted">
              Choose your favorite category and start learning today.
            </p>
          </div>

          <div className="row g-4">

            <Category
              icon="bi-code-slash"
              title="Programming"
              text="HTML, CSS, JavaScript, Python, Java, C and more."
            />

            <Category
              icon="bi-calculator-fill"
              title="Aptitude"
              text="Improve logical thinking and problem-solving skills."
            />

            <Category
              icon="bi-globe2"
              title="General Knowledge"
              text="Explore current affairs, history, geography and more."
            />

            <Category
              icon="bi-rocket-takeoff-fill"
              title="Science"
              text="Physics, Chemistry and Biology quizzes."
            />

            <Category
              icon="bi-lightbulb-fill"
              title="Reasoning"
              text="Sharpen analytical and logical reasoning abilities."
            />

            <Category
              icon="bi-book-half"
              title="English"
              text="Grammar, vocabulary, comprehension and communication."
            />

          </div>
        </div>
      </section>


      {/* HOW IT WORKS */}
      <section className="how-it-works py-5" id="how-it-works">
        <div className="container">

          <div className="text-center mb-5">
            <h2 className="fw-bold">
              How <span className="text-primary">QuizNova</span> Works
            </h2>

            <p className="text-muted">
              Complete your quiz in three simple steps.
            </p>
          </div>

          <div className="row g-4">

            <Step
              number="1"
              icon="bi-grid-fill"
              title="Select Category"
              text="Choose your favorite subject such as Programming, Aptitude, Science or General Knowledge."
            />

            <Step
              number="2"
              icon="bi-pencil-square"
              title="Answer Questions"
              text="Read every question carefully and choose the best answer before moving to the next question."
            />

            <Step
              number="3"
              icon="bi-trophy-fill"
              title="View Result"
              text="Submit the quiz and instantly view your score, percentage and performance analysis."
            />

          </div>
        </div>
      </section>


      {/* FEATURES */}
      <section className="features py-5" id="features">
        <div className="container">

          <div className="text-center mb-5">
            <h2 className="fw-bold">
              Amazing <span className="text-primary">Features</span>
            </h2>

            <p className="text-muted">
              Everything you need for an excellent online quiz experience.
            </p>
          </div>

          <div className="row g-4">

            <FeatureBox
              icon="bi-stopwatch-fill"
              title="Live Timer"
              text="Keep track of your quiz time with an integrated countdown timer."
            />

            <FeatureBox
              icon="bi-bar-chart-line-fill"
              title="Progress Tracking"
              text="Monitor your quiz performance and improve every attempt."
            />

            <FeatureBox
              icon="bi-trophy-fill"
              title="Leaderboard"
              text="Compare your scores with other learners and stay motivated."
            />

            <FeatureBox
              icon="bi-phone-fill"
              title="Responsive Design"
              text="Works perfectly on desktop, tablet and mobile devices."
            />

            <FeatureBox
              icon="bi-shield-lock-fill"
              title="Secure Quiz"
              text="Secure and reliable quiz environment with accurate scoring."
            />

            <FeatureBox
              icon="bi-moon-stars-fill"
              title="Dark Mode"
              text="Dark mode support will be available in future updates."
            />

          </div>
        </div>
      </section>


      {/* STATISTICS */}
      <section className="statistics py-5">
        <div className="container">

          <div className="text-center text-white mb-5">
            <h2 className="fw-bold">
              Our Achievements
            </h2>

            <p>
              Thousands of learners trust QuizNova to improve their skills.
            </p>
          </div>

          <div className="row g-4">

            <Stat
              icon="bi-people-fill"
              number="10,000+"
              title="Students"
            />

            <Stat
              icon="bi-patch-question-fill"
              number="25,000+"
              title="Questions"
            />

            <Stat
              icon="bi-journal-check"
              number="50,000+"
              title="Quizzes Taken"
            />

            <Stat
              icon="bi-star-fill"
              number="4.9★"
              title="User Rating"
            />

          </div>
        </div>
      </section>


      {/* TESTIMONIALS */}
      <section className="testimonials py-5" id="testimonials">
        <div className="container">

          <div className="text-center mb-5">
            <h2 className="fw-bold">
              What Our{" "}
              <span className="text-primary">
                Students Say
              </span>
            </h2>

            <p className="text-muted">
              Thousands of learners trust QuizNova to improve their knowledge.
            </p>
          </div>

          <div className="row g-4">

            <Testimonial
              image="https://i.pravatar.cc/100?img=12"
              name="Rahul Kumar"
              role="B.Tech Student"
              text="QuizNova helped me improve my aptitude skills before placements. The quizzes are simple, fast, and very useful."
            />

            <Testimonial
              image="https://i.pravatar.cc/100?img=32"
              name="Priya Sharma"
              role="Engineering Student"
              text="The interface is beautiful and easy to use. I enjoy solving quizzes every day."
            />

            <Testimonial
              image="https://i.pravatar.cc/100?img=15"
              name="Arjun Reddy"
              role="Software Learner"
              text="The Programming quizzes helped me prepare for interviews. Highly recommended!"
            />

          </div>
        </div>
      </section>


      {/* FAQ */}
      <section className="faq py-5" id="faq">
        <div className="container">

          <div className="text-center mb-5">
            <h2 className="fw-bold">
              Frequently Asked{" "}
              <span className="text-primary">
                Questions
              </span>
            </h2>

            <p className="text-muted">
              Find answers to the most common questions about QuizNova.
            </p>
          </div>

          <div className="accordion" id="faqAccordion">

            <FaqItem
              id="faq1"
              question="Is QuizNova free to use?"
              answer="Yes. QuizNova is completely free for students to practice quizzes."
              open
            />

            <FaqItem
              id="faq2"
              question="Can I attempt quizzes multiple times?"
              answer="Yes. You can practice the same quiz as many times as you want."
            />

            <FaqItem
              id="faq3"
              question="Will I get my score instantly?"
              answer="Yes. Once you submit the quiz, your score and performance will be displayed immediately."
            />

            <FaqItem
              id="faq4"
              question="Is QuizNova mobile friendly?"
              answer="Yes. QuizNova works perfectly on desktops, tablets, and smartphones."
            />

          </div>
        </div>
      </section>


      {/* CONTACT */}
      <section className="contact py-5" id="contact">
        <div className="container">

          <div className="text-center mb-5">
            <h2 className="fw-bold">
              Contact <span className="text-primary">Us</span>
            </h2>

            <p className="text-muted">
              Have questions? We'd love to hear from you.
            </p>
          </div>

          <div className="row g-5">

            <div className="col-lg-5">
              <div className="contact-info">

                <div className="contact-item">
                  <i className="bi bi-geo-alt-fill"></i>

                  <div>
                    <h5>Address</h5>
                    <p>
                      Visakhapatnam, Andhra Pradesh, India
                    </p>
                  </div>
                </div>

                <div className="contact-item">
                  <i className="bi bi-envelope-fill"></i>

                  <div>
                    <h5>Email</h5>
                    <p>support@quiznova.com</p>
                  </div>
                </div>

                <div className="contact-item">
                  <i className="bi bi-telephone-fill"></i>

                  <div>
                    <h5>Phone</h5>
                    <p>+91 9876543210</p>
                  </div>
                </div>

              </div>
            </div>

            <div className="col-lg-7">

              <form onSubmit={(e) => e.preventDefault()}>

                <div className="row">

                  <div className="col-md-6 mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your Name"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email Address"
                    />
                  </div>

                </div>

                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Subject"
                />

                <textarea
                  className="form-control mb-3"
                  rows="5"
                  placeholder="Your Message"
                />

                <button
                  type="submit"
                  className="btn btn-primary px-5"
                >
                  Send Message
                </button>

              </form>

            </div>
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}


/* ---------- Reusable Home Components ---------- */

function Feature({ icon, title, text }) {
  return (
    <div className="col-md-6 col-lg-3">
      <div className="feature-card text-center p-4">

        <i className={`bi ${icon} feature-icon`}></i>

        <h4 className="mt-3">{title}</h4>

        <p>{text}</p>

      </div>
    </div>
  );
}


function Category({ icon, title, text }) {
  return (
    <div className="col-lg-4 col-md-6">
      <div className="category-card">

        <i className={`bi ${icon} category-icon`}></i>

        <h4>{title}</h4>

        <p>{text}</p>

        <Link
          to="/quiz"
          className="btn btn-primary"
        >
          Start Quiz
        </Link>

      </div>
    </div>
  );
}


function Step({ number, icon, title, text }) {
  return (
    <div className="col-lg-4 col-md-6">
      <div className="step-card text-center">

        <div className="step-number">
          {number}
        </div>

        <div className="step-icon">
          <i className={`bi ${icon}`}></i>
        </div>

        <h4>{title}</h4>

        <p>{text}</p>

      </div>
    </div>
  );
}


function FeatureBox({ icon, title, text }) {
  return (
    <div className="col-lg-4 col-md-6">
      <div className="feature-box">

        <i className={`bi ${icon} feature-icon`}></i>

        <h4>{title}</h4>

        <p>{text}</p>

      </div>
    </div>
  );
}


function Stat({ icon, number, title }) {
  return (
    <div className="col-lg-3 col-md-6">
      <div className="stats-card">

        <i className={`bi ${icon} stats-icon`}></i>

        <h2>{number}</h2>

        <p>{title}</p>

      </div>
    </div>
  );
}


function Testimonial({ image, name, role, text }) {
  return (
    <div className="col-lg-4 col-md-6">
      <div className="testimonial-card">

        <div className="stars">
          ★★★★★
        </div>

        <p className="review">
          "{text}"
        </p>

        <div className="user-info">

          <img
            src={image}
            alt={name}
          />

          <div>
            <h5>{name}</h5>
            <span>{role}</span>
          </div>

        </div>

      </div>
    </div>
  );
}


function FaqItem({
  id,
  question,
  answer,
  open = false,
}) {
  return (
    <div className="accordion-item">

      <h2 className="accordion-header">

        <button
          className={`accordion-button ${
            open ? "" : "collapsed"
          }`}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#${id}`}
          aria-expanded={open}
          aria-controls={id}
        >
          {question}
        </button>

      </h2>

      <div
        id={id}
        className={`accordion-collapse collapse ${
          open ? "show" : ""
        }`}
        data-bs-parent="#faqAccordion"
      >
        <div className="accordion-body">
          {answer}
        </div>
      </div>

    </div>
  );
}


export default Home;