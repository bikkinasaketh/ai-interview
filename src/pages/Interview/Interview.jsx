import "./Interview.css";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaMicrophone, FaArrowRight } from "react-icons/fa";

function Interview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const topic = searchParams.get("topic") || "React";
  const difficulty =
    searchParams.get("difficulty") || "medium";

  const API_URL = "http://localhost:8081";

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState([]);
  const [answer, setAnswer] = useState("");

  const [isLoadingQuestions, setIsLoadingQuestions] =
    useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const [isListening, setIsListening] =
    useState(false);

  const [error, setError] = useState("");


  // =========================================================
  // GET USER JWT TOKEN
  // =========================================================

  const getToken = () => {
    const token =
      localStorage.getItem("userToken");

    return token;
  };


  // =========================================================
  // LOAD AI QUESTIONS
  // =========================================================

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoadingQuestions(true);
        setError("");

        const selectedTopic =
          topic || "React";

        const selectedDifficulty =
          difficulty || "medium";

        const url =
          `${API_URL}/api/interviews/questions` +
          `?topic=${encodeURIComponent(selectedTopic)}` +
          `&difficulty=${encodeURIComponent(selectedDifficulty)}` +
          `&numberOfQuestions=10`;

        console.log(
          "Loading questions:",
          url
        );


        // =====================================================
        // GET JWT
        // =====================================================

        const token = getToken();

        console.log(
          "User token available:",
          Boolean(token)
        );


        if (!token) {
          throw new Error(
            "Your login session is missing. Please login again."
          );
        }


        // =====================================================
        // QUESTIONS API
        // =====================================================

        const response =
          await fetch(
            url,
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
          "Question generation status:",
          response.status
        );


        if (!response.ok) {

          let message =
            `Question generation failed: ${response.status}`;

          try {

            const data =
              await response.json();

            if (data?.message) {
              message =
                data.message;
            }

            if (data?.error) {
              message =
                data.error;
            }

          } catch {
            // Backend may not return JSON.
          }


          if (
            response.status === 401 ||
            response.status === 403
          ) {

            message =
              "Your login session is invalid or expired. Please login again.";
          }


          throw new Error(message);
        }


        const data =
          await response.json();


        console.log(
          "Generated questions:",
          data
        );


        if (
          !Array.isArray(data) ||
          data.length === 0
        ) {

          throw new Error(
            "AI did not return any questions."
          );
        }


        setQuestions(data);

      } catch (err) {

        console.error(
          "Question generation error:",
          err
        );


        setError(
          err.message ||
            "Unable to generate interview questions."
        );

      } finally {

        setIsLoadingQuestions(false);
      }
    };


    loadQuestions();

  }, [topic, difficulty]);


  // =========================================================
  // VOICE INPUT
  // =========================================================

  const handleSpeak = () => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

      alert(
        "Speech recognition is not supported in this browser. Please use Google Chrome."
      );

      return;
    }


    if (
      isListening ||
      isSaving
    ) {
      return;
    }


    const recognition =
      new SpeechRecognition();


    recognition.lang =
      "en-US";

    recognition.continuous =
      false;

    recognition.interimResults =
      false;


    recognition.onstart = () => {
      setIsListening(true);
    };


    recognition.onresult = (event) => {

      const transcript =
        event.results[0][0]
          .transcript;


      setAnswer(
        (previousAnswer) => {

          if (
            !previousAnswer.trim()
          ) {
            return transcript;
          }


          return `${previousAnswer} ${transcript}`;
        }
      );
    };


    recognition.onerror = (event) => {

      console.error(
        "Speech recognition error:",
        event.error
      );


      setIsListening(false);


      if (
        event.error ===
        "not-allowed"
      ) {

        alert(
          "Microphone permission was denied. Please allow microphone access."
        );

      } else {

        alert(
          "Could not recognize your voice. Please try again."
        );
      }
    };


    recognition.onend = () => {
      setIsListening(false);
    };


    try {

      recognition.start();

    } catch (error) {

      console.error(
        "Unable to start speech recognition:",
        error
      );


      setIsListening(false);
    }
  };


  // =========================================================
  // GET LOGGED-IN USER
  // =========================================================

  const getLoggedInUser = () => {

    const savedUser =
      localStorage.getItem("user");


    if (!savedUser) {
      return null;
    }


    try {

      const user =
        JSON.parse(savedUser);


      if (!user?.id) {
        return null;
      }


      return user;

    } catch (error) {

      console.error(
        "Invalid saved user:",
        error
      );


      return null;
    }
  };


  // =========================================================
  // EVALUATE COMPLETE INTERVIEW
  // =========================================================

  const evaluateCompleteInterview =
    async (
      finalAnswers
    ) => {

      console.log(
        "Starting complete AI evaluation..."
      );


      const token =
        getToken();


      if (!token) {

        throw new Error(
          "Your login session is missing. Please login again."
        );
      }


      const response =
        await fetch(
          `${API_URL}/api/ai/evaluate`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              "Authorization":
                `Bearer ${token}`
            },

            body: JSON.stringify({

              topic:
                topic,

              difficulty:
                difficulty,

              answers:
                finalAnswers.map(
                  (item) => ({

                    question:
                      item.question,

                    answer:
                      item.answer
                  })
                )
            })
          }
        );


      console.log(
        "AI evaluation status:",
        response.status
      );


      if (!response.ok) {

        let message =
          `AI evaluation failed: ${response.status}`;


        try {

          const data =
            await response.json();


          if (data?.message) {
            message =
              data.message;
          }


          if (data?.error) {
            message =
              data.error;
          }

        } catch {
          // Backend may not return JSON.
        }


        if (
          response.status === 401 ||
          response.status === 403
        ) {

          message =
            "Your login session is invalid or expired. Please login again.";
        }


        throw new Error(message);
      }


      const evaluationResults =
        await response.json();


      console.log(
        "Complete AI evaluation:",
        evaluationResults
      );


      if (
        !Array.isArray(
          evaluationResults
        )
      ) {

        throw new Error(
          "Invalid AI evaluation response."
        );
      }


      if (
        evaluationResults.length !==
        finalAnswers.length
      ) {

        throw new Error(
          `AI returned ${evaluationResults.length} evaluations for ${finalAnswers.length} answers.`
        );
      }


      return evaluationResults;
    };


  // =========================================================
  // SAVE INTERVIEW TO BACKEND
  // =========================================================

  const saveInterview = async (
    completeAnswers,
    overallScore,
    user
  ) => {

    console.log(
      "Saving interview to PostgreSQL..."
    );


    console.log(
      "Final AI score:",
      overallScore
    );


    console.log(
      "Answers being saved:",
      completeAnswers
    );


    const token =
      getToken();


    if (!token) {

      throw new Error(
        "Your login session is missing. Please login again."
      );
    }


    const response =
      await fetch(
        `${API_URL}/api/interviews/save`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            "Authorization":
              `Bearer ${token}`
          },

          body: JSON.stringify({

            userId:
              user.id,

            topic:
              topic,

            difficulty:
              difficulty,

            score:
              overallScore,

            totalQuestions:
              completeAnswers.length,

            answers:
              completeAnswers
          })
        }
      );


    console.log(
      "Interview save status:",
      response.status
    );


    if (!response.ok) {

      let message =
        `Failed to save interview: ${response.status}`;


      try {

        const data =
          await response.json();


        if (data?.message) {
          message =
            data.message;
        }


        if (data?.error) {
          message =
            data.error;
        }

      } catch {
        // Backend may return non-JSON.
      }


      if (
        response.status === 401 ||
        response.status === 403
      ) {

        message =
          "Your login session is invalid or expired. Please login again.";
      }


      throw new Error(message);
    }


    const savedInterview =
      await response.json();


    console.log(
      "Interview saved:",
      savedInterview
    );


    return savedInterview;
  };


  // =========================================================
  // NEXT / FINISH INTERVIEW
  // =========================================================

  const handleNext = async () => {

    if (isSaving) {
      return;
    }


    if (questions.length === 0) {
      return;
    }


    const currentAnswer =
      answer.trim();


    if (!currentAnswer) {

      alert(
        "Please enter your answer first."
      );

      return;
    }


    const currentQuestionText =
      questions[currentQuestion];


    const currentAnswerObject = {

      question:
        currentQuestionText,

      answer:
        currentAnswer
    };


    // =======================================================
    // BUILD NEW ANSWER ARRAY
    // =======================================================

    const finalAnswers = [
      ...answers,
      currentAnswerObject
    ];


    setAnswers(finalAnswers);


    // =======================================================
    // NEXT QUESTION
    // =======================================================

    if (
      currentQuestion <
      questions.length - 1
    ) {

      setCurrentQuestion(
        currentQuestion + 1
      );


      setAnswer("");

      return;
    }


    // =======================================================
    // FINAL QUESTION VALIDATION
    // =======================================================

    if (
      finalAnswers.length !==
      questions.length
    ) {

      console.error(
        "Answer count mismatch:",
        {
          answers:
            finalAnswers.length,

          questions:
            questions.length
        }
      );


      alert(
        `Answer count mismatch. Collected ${finalAnswers.length} of ${questions.length} answers.`
      );


      return;
    }


    setIsSaving(true);
    setError("");


    // =======================================================
    // GET USER
    // =======================================================

    const user =
      getLoggedInUser();


    if (!user) {

      setIsSaving(false);


      alert(
        "Please login first."
      );


      navigate("/login");

      return;
    }


    // =======================================================
    // CHECK TOKEN
    // =======================================================

    const token =
      getToken();


    if (!token) {

      setIsSaving(false);


      alert(
        "Your login session is missing. Please login again."
      );


      navigate("/login");

      return;
    }


    try {

      // =====================================================
      // STEP 1
      // ONE AI EVALUATION REQUEST
      // =====================================================

      const evaluationResults =
        await evaluateCompleteInterview(
          finalAnswers
        );


      // =====================================================
      // STEP 2
      // COMBINE ANSWERS + AI RESULTS
      // =====================================================

      const completeAnswers =
        finalAnswers.map(
          (item, index) => {

            const evaluation =
              evaluationResults[index];


            const aiScore =
              Number(
                evaluation?.score
              );


            if (
              Number.isNaN(aiScore)
            ) {

              throw new Error(
                `Invalid AI score for question ${index + 1}`
              );
            }


            return {

              question:
                item.question,

              answer:
                item.answer,

              aiScore:
                aiScore,

              feedback:
                evaluation?.feedback ||
                "",

              correctPoints:
                evaluation?.correctPoints ||
                [],

              improvements:
                evaluation?.improvements ||
                [],

              learnNext:
                evaluation?.learnNext ||
                [],

              betterAnswer:
                evaluation?.betterAnswer ||
                ""
            };
          }
        );


      console.log(
        "Complete interview answers:",
        completeAnswers
      );


      // =====================================================
      // STEP 3
      // CALCULATE REAL AI SCORE
      // =====================================================

      const scores =
        completeAnswers
          .map(
            (item) =>
              Number(item.aiScore)
          )
          .filter(
            (value) =>
              !Number.isNaN(value)
          );


      if (
        scores.length !==
        completeAnswers.length
      ) {

        throw new Error(
          "Some answers do not have valid AI scores."
        );
      }


      const totalScore =
        scores.reduce(
          (sum, value) =>
            sum + value,
          0
        );


      const overallScore =
        Math.round(
          totalScore /
          scores.length
        );


      console.log(
        "Overall AI score:",
        overallScore
      );


      // =====================================================
      // STEP 4
      // SAVE LOCAL RESULTS
      // =====================================================

      localStorage.setItem(
        "interviewAnswers",
        JSON.stringify(
          completeAnswers
        )
      );


      localStorage.setItem(
        "interviewScore",
        overallScore.toString()
      );


      localStorage.setItem(
        "userId",
        user.id.toString()
      );


      localStorage.setItem(
        "interviewTopic",
        topic
      );


      localStorage.setItem(
        "interviewDifficulty",
        difficulty
      );


      // =====================================================
      // STEP 5
      // SAVE TO POSTGRESQL
      // =====================================================

      const savedInterview =
        await saveInterview(
          completeAnswers,
          overallScore,
          user
        );


      // =====================================================
      // STEP 6
      // SAVE INTERVIEW ID
      // =====================================================

      if (
        savedInterview?.id
      ) {

        localStorage.setItem(
          "latestInterviewId",
          savedInterview.id.toString()
        );
      }


      // =====================================================
      // STEP 7
      // UPDATE COMPLETED COUNT
      // =====================================================

      const oldCount =
        Number(
          localStorage.getItem(
            "interviewsCompleted"
          ) || 0
        );


      localStorage.setItem(
        "interviewsCompleted",
        (
          oldCount + 1
        ).toString()
      );


      // =====================================================
      // STEP 8
      // GO TO RESULTS
      // =====================================================

      navigate("/results");


    } catch (error) {

      console.error(
        "Interview completion error:",
        error
      );


      setError(
        error.message ||
          "Unable to complete interview."
      );


      alert(
        error.message ||
          "Something went wrong while completing the interview."
      );

    } finally {

      setIsSaving(false);
    }
  };


  // =========================================================
  // LOADING QUESTIONS
  // =========================================================

  if (isLoadingQuestions) {

    return (
      <section className="interview">

        <div className="question-box">

          <h3>
            🤖 AI Interview Coach
          </h3>

          <h2>
            Generating interview questions...
          </h2>

          <p>
            Please wait while AI prepares
            your interview.
          </p>

        </div>

      </section>
    );
  }


  // =========================================================
  // QUESTION ERROR
  // =========================================================

  if (
    error &&
    questions.length === 0
  ) {

    return (
      <section className="interview">

        <div className="question-box">

          <h3>
            🤖 AI Interview Coach
          </h3>

          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "16px",
              borderRadius: "12px",
              marginTop: "20px"
            }}
          >
            {error}
          </div>


          <button
            type="button"
            className="next-btn"
            style={{
              marginTop: "20px"
            }}
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>

        </div>

      </section>
    );
  }


  // =========================================================
  // SAFETY CHECK
  // =========================================================

  if (
    questions.length === 0
  ) {

    return (
      <section className="interview">

        <div className="question-box">

          <h3>
            🤖 AI Interview Coach
          </h3>

          <p>
            No interview questions available.
          </p>

        </div>

      </section>
    );
  }


  // =========================================================
  // CURRENT QUESTION
  // =========================================================

  const currentQuestionText =
    questions[currentQuestion];


  // =========================================================
  // RENDER
  // =========================================================

  return (
    <section className="interview">

      <div className="question-box">

        {/* HEADER */}

        <h3>
          🤖 AI Interview Coach
        </h3>


        {/* TOPIC + DIFFICULTY */}

        <div className="selected-topic">

          <strong>
            Topic:
          </strong>{" "}

          {topic}

          {" | "}

          <strong>
            Difficulty:
          </strong>{" "}

          {difficulty}

        </div>


        {/* PROGRESS */}

        <div className="progress">

          Question{" "}

          {currentQuestion + 1}

          {" "}of{" "}

          {questions.length}

        </div>


        {/* QUESTION */}

        <h2>
          {currentQuestionText}
        </h2>


        {/* ANSWER */}

        <textarea
          placeholder="Type your answer here..."
          rows="8"
          value={answer}
          disabled={isSaving}
          onChange={(event) =>
            setAnswer(
              event.target.value
            )
          }
        />


        {/* ERROR */}

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "12px 16px",
              borderRadius: "10px",
              marginTop: "15px"
            }}
          >
            {error}
          </div>
        )}


        {/* BUTTONS */}

        <div className="buttons">

          {/* VOICE */}

          <button
            type="button"
            className="voice-btn"
            disabled={
              isSaving ||
              isListening
            }
            onClick={handleSpeak}
          >

            <FaMicrophone />

            {isListening
              ? "Listening..."
              : "Speak"}

          </button>


          {/* NEXT / FINISH */}

          <button
            type="button"
            className="next-btn"
            disabled={isSaving}
            onClick={handleNext}
          >

            {isSaving
              ? "AI Evaluating..."
              : currentQuestion ===
                questions.length - 1
              ? "Finish Interview"
              : "Next"}

            {!isSaving && (
              <FaArrowRight />
            )}

          </button>

        </div>


        {/* SAVING MESSAGE */}

        {isSaving && (

          <p
            style={{
              textAlign: "center",
              marginTop: "20px",
              color: "#475569",
              fontWeight: "600"
            }}
          >

            🤖 AI is analyzing your answers...

            <br />

            Checking correctness,
            improvements,
            learning topics and
            better answers.

          </p>
        )}

      </div>

    </section>
  );
}

export default Interview;