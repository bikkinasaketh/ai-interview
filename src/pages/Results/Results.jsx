import "./Results.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function Results() {
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  const API_URL = "http://localhost:8081";


  // =========================================================
  // LOAD RESULTS
  // =========================================================

  useEffect(() => {

    const loadResults = async () => {

      try {

        // =====================================================
        // GET USER ID
        // =====================================================

        let userId =
          localStorage.getItem("userId");


        // =====================================================
        // GET USER ID FROM SAVED USER
        // =====================================================

        if (!userId) {

          const savedUser =
            localStorage.getItem("user");

          if (savedUser) {

            try {

              const user =
                JSON.parse(savedUser);

              if (user?.id) {

                userId =
                  String(user.id);

                localStorage.setItem(
                  "userId",
                  userId
                );
              }

            } catch (error) {

              console.error(
                "Unable to read user:",
                error
              );
            }
          }
        }


        // =====================================================
        // VALIDATE USER ID
        // =====================================================

        if (
          !userId ||
          !/^\d+$/.test(userId)
        ) {

          setError(
            "Unable to identify the logged-in user."
          );

          return;
        }


        // =====================================================
        // GET JWT TOKEN
        // =====================================================

        const token =
          localStorage.getItem("userToken");


        console.log(
          "Results JWT token available:",
          Boolean(token)
        );


        if (!token) {

          setError(
            "Your login session is missing. Please login again."
          );

          return;
        }


        // =====================================================
        // GET USER INTERVIEW HISTORY
        // =====================================================

        console.log(
          "Loading interview history for user:",
          userId
        );


        const response =
          await fetch(
            `${API_URL}/api/interviews/user/${userId}`,
            {
              method: "GET",

              headers: {
                "Content-Type":
                  "application/json",

                "Authorization":
                  `Bearer ${token}`
              }
            }
          );


        console.log(
          "Interview history status:",
          response.status
        );


        // =====================================================
        // HANDLE AUTH ERROR
        // =====================================================

        if (
          response.status === 401 ||
          response.status === 403
        ) {

          throw new Error(
            "Your login session is invalid or expired. Please login again."
          );
        }


        // =====================================================
        // HANDLE OTHER ERRORS
        // =====================================================

        if (!response.ok) {

          let message =
            `Failed to load interview history: ${response.status}`;

          try {

            const errorData =
              await response.json();

            if (errorData?.message) {
              message =
                errorData.message;
            }

            if (errorData?.error) {
              message =
                errorData.error;
            }

          } catch {
            // Backend may not return JSON.
          }

          throw new Error(message);
        }


        // =====================================================
        // READ INTERVIEWS
        // =====================================================

        const interviews =
          await response.json();


        console.log(
          "Interview history:",
          interviews
        );


        if (
          !Array.isArray(interviews) ||
          interviews.length === 0
        ) {

          setError(
            "No interview results found."
          );

          return;
        }


        // =====================================================
        // SORT BY DATE
        // =====================================================

        const sortedInterviews =
          [...interviews].sort(
            (a, b) => {

              const dateA =
                new Date(
                  a.completedAt || 0
                ).getTime();

              const dateB =
                new Date(
                  b.completedAt || 0
                ).getTime();

              return dateB - dateA;
            }
          );


        // =====================================================
        // LATEST INTERVIEW
        // =====================================================

        const latestInterview =
          sortedInterviews[0];


        const interviewId =
          latestInterview.id;


        console.log(
          "Latest interview:",
          latestInterview
        );


        console.log(
          "Latest interview ID:",
          interviewId
        );


        // =====================================================
        // TOPIC
        // =====================================================

        setTopic(
          latestInterview.topic || ""
        );


        // =====================================================
        // DIFFICULTY
        // =====================================================

        setDifficulty(
          latestInterview.difficulty || ""
        );


        // =====================================================
        // SCORE
        // =====================================================

        const backendScore =
          Number(
            latestInterview.score
          );


        if (
          !Number.isNaN(backendScore)
        ) {

          const finalScore =
            Math.min(
              100,
              Math.max(
                0,
                backendScore
              )
            );


          setScore(
            finalScore
          );


          localStorage.setItem(
            "interviewScore",
            String(finalScore)
          );
        }


        // =====================================================
        // GET ANSWERS
        // =====================================================

        console.log(
          "Loading interview answers..."
        );


        const answersResponse =
          await fetch(
            `${API_URL}/api/interviews/${interviewId}/answers`,
            {
              method: "GET",

              headers: {
                "Content-Type":
                  "application/json",

                "Authorization":
                  `Bearer ${token}`
              }
            }
          );


        console.log(
          "Interview answers status:",
          answersResponse.status
        );


        // =====================================================
        // ANSWERS AUTH ERROR
        // =====================================================

        if (
          answersResponse.status === 401 ||
          answersResponse.status === 403
        ) {

          throw new Error(
            "Your login session is invalid or expired. Please login again."
          );
        }


        // =====================================================
        // ANSWERS OTHER ERROR
        // =====================================================

        if (!answersResponse.ok) {

          let message =
            `Failed to load interview answers: ${answersResponse.status}`;

          try {

            const errorData =
              await answersResponse.json();

            if (errorData?.message) {
              message =
                errorData.message;
            }

            if (errorData?.error) {
              message =
                errorData.error;
            }

          } catch {
            // Backend may not return JSON.
          }

          throw new Error(message);
        }


        // =====================================================
        // READ ANSWERS
        // =====================================================

        const backendAnswers =
          await answersResponse.json();


        console.log(
          "Backend answers:",
          backendAnswers
        );


        if (
          Array.isArray(
            backendAnswers
          )
        ) {

          setAnswers(
            backendAnswers
          );


          localStorage.setItem(
            "interviewAnswers",
            JSON.stringify(
              backendAnswers
            )
          );
        }


      } catch (err) {

        console.error(
          "Unable to load interview results:",
          err
        );


        setError(
          err.message ||
          "Unable to load latest interview result."
        );

      } finally {

        setLoading(false);
      }
    };


    loadResults();

  }, []);


  // =========================================================
  // DOWNLOAD RESULT PDF
  // =========================================================

  const downloadResultPDF =
    async () => {

      if (downloading) {
        return;
      }


      const element =
        document.querySelector(
          ".results-container"
        );


      if (!element) {

        alert(
          "Result content is not available."
        );

        return;
      }


      try {

        setDownloading(true);


        const canvas =
          await html2canvas(
            element,
            {
              scale: 2,

              useCORS: true,

              backgroundColor:
                "#ffffff",

              logging: false,

              scrollX: 0,

              scrollY:
                -window.scrollY,

              windowWidth:
                element.scrollWidth,

              windowHeight:
                element.scrollHeight
            }
          );


        const imageData =
          canvas.toDataURL(
            "image/png",
            1.0
          );


        const pdf =
          new jsPDF(
            "p",
            "mm",
            "a4"
          );


        const pageWidth =
          pdf.internal.pageSize.getWidth();


        const pageHeight =
          pdf.internal.pageSize.getHeight();


        const margin =
          8;


        const usableWidth =
          pageWidth -
          margin * 2;


        const imageHeight =
          (
            canvas.height *
            usableWidth
          ) /
          canvas.width;


        let heightLeft =
          imageHeight;


        let position =
          margin;


        pdf.addImage(
          imageData,
          "PNG",
          margin,
          position,
          usableWidth,
          imageHeight
        );


        heightLeft -=
          pageHeight -
          margin * 2;


        while (
          heightLeft > 0
        ) {

          position =
            margin -
            (
              imageHeight -
              heightLeft
            );


          pdf.addPage();


          pdf.addImage(
            imageData,
            "PNG",
            margin,
            position,
            usableWidth,
            imageHeight
          );


          heightLeft -=
            pageHeight -
            margin * 2;
        }


        // =====================================================
        // FILE NAME
        // =====================================================

        const safeTopic =
          topic
            ? topic.replace(
                /[^a-z0-9]/gi,
                "_"
              )
            : "Interview";


        const date =
          new Date()
            .toISOString()
            .slice(
              0,
              10
            );


        const fileName =
          `AI_Interview_Result_${safeTopic}_${date}.pdf`;


        pdf.save(
          fileName
        );


      } catch (error) {

        console.error(
          "PDF download error:",
          error
        );


        alert(
          "Unable to generate PDF. Please try again."
        );

      } finally {

        setDownloading(false);
      }
    };


  // =========================================================
  // PERFORMANCE
  // =========================================================

  let performance =
    "Needs Improvement";


  if (score >= 80) {

    performance =
      "Excellent Performance";

  } else if (score >= 60) {

    performance =
      "Good Performance";

  } else if (score >= 40) {

    performance =
      "Average Performance";
  }


  // =========================================================
  // STAR RATING
  // =========================================================

  const getStars =
    (value) => {

      if (value >= 80) {
        return "⭐⭐⭐⭐⭐";
      }

      if (value >= 60) {
        return "⭐⭐⭐⭐☆";
      }

      if (value >= 40) {
        return "⭐⭐⭐☆☆";
      }

      if (value >= 20) {
        return "⭐⭐☆☆☆";
      }

      return "⭐☆☆☆☆";
    };


  // =========================================================
  // TECHNICAL SCORE
  // =========================================================

  const aiScores =
    answers
      .map(
        (item) =>
          Number(
            item.aiScore
          )
      )
      .filter(
        (value) =>
          !Number.isNaN(value)
      );


  const averageAiScore =
    aiScores.length > 0
      ? Math.round(
          aiScores.reduce(
            (sum, value) =>
              sum + value,
            0
          ) /
            aiScores.length
        )
      : score;


  // =========================================================
  // COMMUNICATION
  // =========================================================

  const communicationScore =
    answers.length > 0
      ? Math.round(
          answers.reduce(
            (sum, item) => {

              const text =
                item.answer || "";


              const length =
                text.trim().length;


              let value =
                0;


              if (
                length >= 100
              ) {

                value =
                  100;

              } else if (
                length >= 70
              ) {

                value =
                  85;

              } else if (
                length >= 40
              ) {

                value =
                  70;

              } else if (
                length >= 20
              ) {

                value =
                  50;

              } else if (
                length > 0
              ) {

                value =
                  30;
              }


              return (
                sum +
                value
              );

            },
            0
          ) /
            answers.length
        )
      : 0;


  // =========================================================
  // CONFIDENCE
  // =========================================================

  const confidenceScore =
    answers.length > 0
      ? Math.round(
          answers.reduce(
            (sum, item) => {

              const text =
                item.answer || "";


              const words =
                text
                  .trim()
                  .split(/\s+/)
                  .filter(Boolean)
                  .length;


              let value =
                0;


              if (
                words >= 30
              ) {

                value =
                  100;

              } else if (
                words >= 20
              ) {

                value =
                  85;

              } else if (
                words >= 10
              ) {

                value =
                  70;

              } else if (
                words >= 5
              ) {

                value =
                  50;

              } else if (
                words > 0
              ) {

                value =
                  30;
              }


              return (
                sum +
                value
              );

            },
            0
          ) /
            answers.length
        )
      : 0;


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <section className="results">

        <div className="loading-card">

          <h1>
            🤖 Analyzing Your Interview...
          </h1>

          <p>
            AI is reviewing your answers.
          </p>

        </div>

      </section>

    );
  }


  // =========================================================
  // UI
  // =========================================================

  return (

    <section className="results">

      <div className="results-container">


        {/* =================================================
            TITLE
        ================================================= */}

        <h1 className="results-title">

          Interview Completed 🎉

        </h1>


        {/* =================================================
            INTERVIEW INFO
        ================================================= */}

        {topic && (

          <p className="interview-info">

            Topic:

            <strong>
              {topic}
            </strong>


            {" • "}


            Difficulty:

            <strong>
              {difficulty}
            </strong>

          </p>

        )}


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="error-message">

            {error}

          </div>

        )}


        {/* =================================================
            OVERALL SCORE
        ================================================= */}

        <div className="score-card">

          <h2>
            Overall Score
          </h2>

          <div className="score-number">
            {score}%
          </div>

          <p>
            {performance}
          </p>

        </div>


        {/* =================================================
            SUMMARY
        ================================================= */}

        <div className="feedback">


          <div className="summary-card">

            <h3>
              Questions Answered
            </h3>

            <p>

              {answers.length} /{" "}

              {answers.length || 10}

            </p>

          </div>


          <div className="summary-card">

            <h3>
              Technical Skills
            </h3>

            <p>
              {getStars(
                averageAiScore
              )}
            </p>

            <small>
              {averageAiScore} / 100
            </small>

          </div>


          <div className="summary-card">

            <h3>
              Communication
            </h3>

            <p>
              {getStars(
                communicationScore
              )}
            </p>

            <small>
              {communicationScore} / 100
            </small>

          </div>


          <div className="summary-card">

            <h3>
              Confidence
            </h3>

            <p>
              {getStars(
                confidenceScore
              )}
            </p>

            <small>
              {confidenceScore} / 100
            </small>

          </div>

        </div>


        {/* =================================================
            AI ANSWER REVIEW
        ================================================= */}

        <div className="answer-review">

          <h2>
            🤖 AI Answer Review
          </h2>

          <p className="review-subtitle">

            Understand what you did well,
            what you need to improve and
            what you should learn next.

          </p>


          {answers.length === 0 ? (

            <div className="no-answers">

              No answers available.

            </div>

          ) : (

            answers.map(
              (item, index) => (

                <div
                  className="answer-item"
                  key={
                    item.id ||
                    index
                  }
                >


                  {/* QUESTION */}

                  <div className="question-header">

                    <span>
                      Question {index + 1}
                    </span>

                    <strong>

                      {item.aiScore || 0}

                      /100

                    </strong>

                  </div>


                  <h3 className="question">

                    {item.question}

                  </h3>


                  {/* YOUR ANSWER */}

                  <div className="review-section your-answer">

                    <h4>
                      🗣️ Your Answer
                    </h4>

                    <p>

                      {item.answer ||
                        "No answer provided."}

                    </p>

                  </div>


                  {/* AI FEEDBACK */}

                  <div className="review-section ai-feedback-box">

                    <h4>
                      🤖 AI Feedback
                    </h4>

                    <p>

                      {item.feedback ||
                        "No feedback available."}

                    </p>

                  </div>


                  {/* CORRECT */}

                  <div className="review-section correct-box">

                    <h4>
                      ✅ What You Did Well
                    </h4>


                    {item.correctPoints ? (

                      item.correctPoints
                        .split("\n")
                        .filter(Boolean)
                        .map(
                          (point, i) => (

                            <p key={i}>
                              ✓ {point}
                            </p>

                          )
                        )

                    ) : (

                      <p>

                        No specific strengths
                        identified.

                      </p>

                    )}

                  </div>


                  {/* IMPROVEMENTS */}

                  <div className="review-section improvement-box">

                    <h4>
                      ❌ What You Need To Improve
                    </h4>


                    {item.improvements ? (

                      item.improvements
                        .split("\n")
                        .filter(Boolean)
                        .map(
                          (point, i) => (

                            <p key={i}>
                              • {point}
                            </p>

                          )
                        )

                    ) : (

                      <p>

                        No improvement points
                        available.

                      </p>

                    )}

                  </div>


                  {/* LEARN NEXT */}

                  <div className="review-section learn-box">

                    <h4>
                      📚 What You Should Learn Next
                    </h4>


                    {item.learnNext ? (

                      item.learnNext
                        .split("\n")
                        .filter(Boolean)
                        .map(
                          (point, i) => (

                            <p key={i}>
                              → {point}
                            </p>

                          )
                        )

                    ) : (

                      <p>

                        Review the core concepts
                        related to this question.

                      </p>

                    )}

                  </div>


                  {/* BETTER ANSWER */}

                  <div className="review-section better-answer-box">

                    <h4>
                      💡 Better Interview Answer
                    </h4>

                    <p>

                      {item.betterAnswer ||
                        "No improved answer available."}

                    </p>

                  </div>


                </div>

              )

            )

          )}

        </div>


        {/* =================================================
            BUTTONS
        ================================================= */}

        <div className="result-buttons">


          {/* DOWNLOAD PDF */}

          <button
            type="button"
            className="download-btn"
            onClick={
              downloadResultPDF
            }
            disabled={
              downloading
            }
          >

            {downloading
              ? "⏳ Generating PDF..."
              : "📥 Download Result"}

          </button>


          {/* DASHBOARD */}

          <Link
            to="/dashboard"
            className="dashboard-btn"
          >

            Go to Dashboard

          </Link>


          {/* RETRY */}

          <Link
            to={
              topic
                ? `/difficulty?topic=${encodeURIComponent(
                    topic
                  )}`
                : "/topics"
            }
            className="retry-btn"
            onClick={() => {

              localStorage.removeItem(
                "interviewAnswers"
              );

              localStorage.removeItem(
                "interviewScore"
              );

              localStorage.removeItem(
                "currentInterviewCounted"
              );

            }}
          >

            Try Again

          </Link>


        </div>


      </div>

    </section>

  );
}

export default Results;