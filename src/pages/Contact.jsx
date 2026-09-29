import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <Navbar />

      <section className="contact-hero">
        <div className="container">
          <div className="text-center">

            <span className="contact-badge">
              <i className="bi bi-chat-dots-fill"></i>
              Get In Touch
            </span>

            <h1>
              Contact <span>QuizNova</span>
            </h1>

            <p>
              Have a question, suggestion, or feedback?
              We would love to hear from you.
            </p>

          </div>
        </div>
      </section>

      <section className="contact-section py-5">

        <div className="container">

          <div className="row g-5">

            <div className="col-lg-5">

              <div className="contact-info">

                <span className="section-label">
                  CONTACT US
                </span>

                <h2>
                  Let's Start a Conversation
                </h2>

                <p>
                  If you have any questions about
                  QuizNova or want to share your
                  feedback, feel free to contact us.
                </p>

                <div className="contact-info-item">
                  <div className="contact-icon">
                    <i className="bi bi-envelope-fill"></i>
                  </div>

                  <div>
                    <span>Email</span>
                    <strong>
                      info@quiznova.com
                    </strong>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-icon">
                    <i className="bi bi-telephone-fill"></i>
                  </div>

                  <div>
                    <span>Phone</span>
                    <strong>
                      +91 9876543210
                    </strong>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-icon">
                    <i className="bi bi-geo-alt-fill"></i>
                  </div>

                  <div>
                    <span>Location</span>
                    <strong>
                      Visakhapatnam, Andhra Pradesh
                    </strong>
                  </div>
                </div>

              </div>

            </div>

            <div className="col-lg-7">

              <div className="contact-form">

                <form onSubmit={handleSubmit}>

                  <div className="mb-3">
                    <label className="form-label">
                      Your Name
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Email Address
                    </label>

                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Subject
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter subject"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Message
                    </label>

                    <textarea
                      className="form-control"
                      rows="5"
                      placeholder="Write your message..."
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary contact-submit"
                  >
                    <i className="bi bi-send-fill me-2"></i>
                    Send Message
                  </button>

                  {submitted && (
                    <div className="contact-success mt-3">
                      <i className="bi bi-check-circle-fill me-2"></i>
                      Your message has been submitted
                      successfully!
                    </div>
                  )}

                </form>

              </div>

            </div>

          </div>

        </div>

      </section>

      <section className="faq-section py-5">

        <div className="container">

          <div className="text-center mb-5">

            <span className="section-label">
              FAQ
            </span>

            <h2>
              Frequently Asked Questions
            </h2>

            <p>
              Find quick answers to common questions.
            </p>

          </div>

          <div
            className="accordion"
            id="contactFaq"
          >

            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button"
                  data-bs-toggle="collapse"
                  data-bs-target="#contactFaqOne"
                >
                  How do I start a quiz?
                </button>
              </h2>

              <div
                id="contactFaqOne"
                className="accordion-collapse collapse show"
                data-bs-parent="#contactFaq"
              >
                <div className="accordion-body">
                  Select a category and difficulty,
                  then click Start Quiz.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  data-bs-toggle="collapse"
                  data-bs-target="#contactFaqTwo"
                >
                  Is QuizNova free?
                </button>
              </h2>

              <div
                id="contactFaqTwo"
                className="accordion-collapse collapse"
                data-bs-parent="#contactFaq"
              >
                <div className="accordion-body">
                  Yes. QuizNova is completely free
                  for students to practice quizzes.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  data-bs-toggle="collapse"
                  data-bs-target="#contactFaqThree"
                >
                  Will I get my score instantly?
                </button>
              </h2>

              <div
                id="contactFaqThree"
                className="accordion-collapse collapse"
                data-bs-parent="#contactFaq"
              >
                <div className="accordion-body">
                  Yes. Your score and performance
                  are displayed immediately after
                  submission.
                </div>
              </div>
            </div>

          </div>

        </div>

      </section>

      <Footer />
    </>
  );
}

export default Contact;