import QuizAttempt from "../models/QuizAttempt.js";

export async function getProgress(req, res) {
  try {
    const attempts = await QuizAttempt.find({
      user: req.user._id,
    })
      .sort({ createdAt: 1 })
      .lean();

    // --------------------------------
    // No quiz attempts
    // --------------------------------

    if (attempts.length === 0) {
      return res.json({
        summary: {
          totalQuizzes: 0,
          totalQuestions: 0,
          averagePercentage: 0,
          bestPercentage: 0,
        },

        attempts: [],

        categoryPerformance: [],

        difficultyPerformance: [],

        feedback: {
          level: "Start Practicing",

          message:
            "You have not completed a quiz yet. Start your first quiz to begin tracking your learning progress.",

          recommendation:
            "Choose a category and attempt a quiz to build your performance history.",

          weakArea: null,

          improvement: null,
        },
      });
    }

    // --------------------------------
    // Overall statistics
    // --------------------------------

    const totalQuizzes = attempts.length;

    const totalQuestions = attempts.reduce(
      (sum, attempt) => sum + attempt.total,
      0
    );

    const averagePercentage = Math.round(
      attempts.reduce(
        (sum, attempt) => sum + attempt.percentage,
        0
      ) / totalQuizzes
    );

    const bestPercentage = Math.max(
      ...attempts.map((attempt) => attempt.percentage)
    );

    // --------------------------------
    // Attempt history
    // --------------------------------

    const attemptHistory = attempts.map((attempt, index) => ({
      attempt: index + 1,
      category: attempt.category,
      difficulty: attempt.difficulty,
      percentage: attempt.percentage,
      score: attempt.score,
      total: attempt.total,
      date: attempt.createdAt,
    }));

    // --------------------------------
    // Category performance
    // --------------------------------

    const categoryMap = {};

    attempts.forEach((attempt) => {
      if (!categoryMap[attempt.category]) {
        categoryMap[attempt.category] = {
          total: 0,
          percentage: 0,
        };
      }

      categoryMap[attempt.category].total += 1;

      categoryMap[attempt.category].percentage +=
        attempt.percentage;
    });

    const categoryPerformance = Object.entries(
      categoryMap
    ).map(([category, data]) => ({
      category,

      average: Math.round(
        data.percentage / data.total
      ),

      attempts: data.total,
    }));

    // --------------------------------
    // Difficulty performance
    // --------------------------------

    const difficultyMap = {};

    attempts.forEach((attempt) => {
      if (!difficultyMap[attempt.difficulty]) {
        difficultyMap[attempt.difficulty] = {
          total: 0,
          percentage: 0,
        };
      }

      difficultyMap[attempt.difficulty].total += 1;

      difficultyMap[attempt.difficulty].percentage +=
        attempt.percentage;
    });

    const difficultyPerformance = Object.entries(
      difficultyMap
    ).map(([difficulty, data]) => ({
      difficulty,

      average: Math.round(
        data.percentage / data.total
      ),

      attempts: data.total,
    }));

    // --------------------------------
    // Weak area
    // --------------------------------

    let weakArea = null;

    if (categoryPerformance.length > 0) {
      const lowestCategory = categoryPerformance.reduce(
        (weakest, current) =>
          current.average < weakest.average
            ? current
            : weakest
      );

      /*
       * Only show an improvement area if the
       * category is actually below 75%.
       *
       * Example:
       * Science = 100%  -> no weak area
       * DBMS = 60%      -> DBMS becomes weak area
       */
      if (lowestCategory.average < 75) {
        weakArea = lowestCategory;
      }
    }

    // --------------------------------
    // Latest and previous attempts
    // --------------------------------

    const latestAttempt =
      attempts[attempts.length - 1];

    const previousAttempt =
      attempts.length > 1
        ? attempts[attempts.length - 2]
        : null;

    // --------------------------------
    // Personalized feedback
    // --------------------------------

    let level;
    let message;
    let recommendation;

    const latestScore = latestAttempt.percentage;

    if (latestScore >= 90) {
      level = "Excellent";

      message =
        "Excellent performance! You have demonstrated strong understanding of the quiz topics.";

      recommendation =
        "You are performing excellently. Try Medium or Hard quizzes to challenge your current knowledge level.";
    } else if (latestScore >= 75) {
      level = "Very Good";

      message =
        "Very good performance! You have a strong understanding of the topics.";

      recommendation =
        "Review the questions you missed and continue practicing to reach an excellent score.";
    } else if (latestScore >= 60) {
      level = "Good Progress";

      message =
        "Good progress! You have a basic understanding of the topics.";

      recommendation =
        "Practice more quizzes and review the concepts where you made mistakes.";
    } else if (latestScore >= 40) {
      level = "Needs Practice";

      message =
        "Your current performance needs improvement.";

      recommendation =
        "Review the concepts carefully and practice more quizzes before moving to higher difficulty levels.";
    } else {
      level = "More Practice Recommended";

      message =
        "More practice is recommended to strengthen your understanding of the quiz topics.";

      recommendation =
        "Review the fundamental concepts and attempt easier quizzes regularly to build your understanding.";
    }

    // --------------------------------
    // Improvement compared with previous quiz
    // --------------------------------

    let improvement = null;

    if (previousAttempt) {
      const difference =
        latestAttempt.percentage -
        previousAttempt.percentage;

      if (difference > 0) {
        improvement = `Your latest score improved by ${difference}% compared with your previous attempt. Keep practicing!`;
      } else if (difference < 0) {
        improvement = `Your latest score is ${Math.abs(
          difference
        )}% lower than your previous attempt. Review the questions you missed and try again.`;
      } else {
        improvement =
          "Your latest score is the same as your previous attempt. Continue practicing to improve further.";
      }
    }

    // --------------------------------
    // Final response
    // --------------------------------

    return res.json({
      summary: {
        totalQuizzes,
        totalQuestions,
        averagePercentage,
        bestPercentage,
      },

      attempts: attemptHistory,

      categoryPerformance,

      difficultyPerformance,

      feedback: {
        level,
        message,
        recommendation,
        weakArea,
        improvement,
      },
    });
  } catch (error) {
    console.error("Progress error:", error);

    return res.status(500).json({
      message: "Failed to calculate progress",
    });
  }
}