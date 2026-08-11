import "./Testimonials.css";
import { FaStar } from "react-icons/fa";

function Testimonials() {
  return (
    <section className="testimonials">

      <h1>What Our Students Say</h1>

      <p className="subtitle">
        Thousands of students trust AI Interview Coach
        to prepare for technical and HR interviews.
      </p>

      <div className="review-grid">

        <div className="review">

          <div className="stars">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </div>

          <p>
            "This platform helped me crack my placement
            interview. The UI is amazing and very easy
            to use."
          </p>

          <h3>Rahul Kumar</h3>

          <span>Software Engineer</span>

        </div>

        <div className="review">

          <div className="stars">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </div>

          <p>
            "The interview flow feels realistic.
            I improved my confidence after practicing
            here."
          </p>

          <h3>Priya Sharma</h3>

          <span>Frontend Developer</span>

        </div>

        <div className="review">

          <div className="stars">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </div>

          <p>
            "Best interview preparation website.
            Clean design and very responsive."
          </p>

          <h3>Arjun Reddy</h3>

          <span>Java Developer</span>

        </div>

      </div>

    </section>
  );
}

export default Testimonials;