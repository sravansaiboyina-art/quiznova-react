import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Question from "../models/Question.js";
import QuizAttempt from "../models/QuizAttempt.js";

export async function getStats(req, res) {
  const [users, admins, questions, attempts, aggregates] = await Promise.all([
    User.countDocuments({}),
    User.countDocuments({ role: "admin" }),
    Question.countDocuments({}),
    QuizAttempt.countDocuments({}),
    QuizAttempt.aggregate([
      {
        $group: {
          _id: null,
          averagePercentage: { $avg: "$percentage" },
          totalQuestions: { $sum: "$total" },
          totalCorrect: { $sum: "$score" },
        },
      },
    ]),
  ]);

  const summary = aggregates[0] || {
    averagePercentage: 0,
    totalQuestions: 0,
    totalCorrect: 0,
  };

  res.json({
    users,
    admins,
    students: users - admins,
    questions,
    attempts,
    averagePercentage: Math.round(summary.averagePercentage || 0),
    totalQuestions: summary.totalQuestions || 0,
    totalCorrect: summary.totalCorrect || 0,
  });
}

export async function getUsers(req, res) {
  const users = await User.find({})
    .select("-password")
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  res.json({ users });
}

export async function updateUserRole(req, res) {
  const { role } = req.body;
  if (!["student", "admin"].includes(role)) {
    return res.status(400).json({ message: "Role must be student or admin" });
  }

  if (String(req.user._id) === String(req.params.id) && role !== "admin") {
    return res.status(400).json({ message: "You cannot remove your own admin role." });
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ message: "User role updated", user });
}

export async function getQuestionsAdmin(req, res) {
  const questions = await Question.find({})
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();

  res.json({ questions });
}

function validateQuestion(body) {
  const { category, difficulty, question, options, answer } = body;

  if (!category || !difficulty || !question || !Array.isArray(options) || options.length < 2 || !answer) {
    return "Category, difficulty, question, at least two options, and answer are required.";
  }

  if (!["Easy", "Medium", "Hard"].includes(difficulty)) {
    return "Difficulty must be Easy, Medium, or Hard.";
  }

  const cleanedOptions = options.map((option) => String(option).trim()).filter(Boolean);

  if (cleanedOptions.length < 2) {
    return "At least two non-empty options are required.";
  }

  if (!cleanedOptions.includes(String(answer).trim())) {
    return "Answer must exactly match one of the options.";
  }

  return null;
}

export async function createQuestion(req, res) {
  const error = validateQuestion(req.body);
  if (error) return res.status(400).json({ message: error });

  const { category, difficulty, question, options, answer, legacyId } = req.body;

  const highest = await Question.findOne().sort({ legacyId: -1 }).select("legacyId").lean();
  const nextLegacyId = Number.isFinite(Number(legacyId))
    ? Number(legacyId)
    : (highest?.legacyId || 0) + 1;

  const created = await Question.create({
    legacyId: nextLegacyId,
    category: String(category).trim(),
    difficulty,
    question: String(question).trim(),
    options: options.map((option) => String(option).trim()).filter(Boolean),
    answer: String(answer).trim(),
  });

  res.status(201).json({ message: "Question created", question: created });
}

export async function updateQuestion(req, res) {
  const error = validateQuestion(req.body);
  if (error) return res.status(400).json({ message: error });

  const { category, difficulty, question, options, answer } = req.body;

  const updated = await Question.findByIdAndUpdate(
    req.params.id,
    {
      category: String(category).trim(),
      difficulty,
      question: String(question).trim(),
      options: options.map((option) => String(option).trim()).filter(Boolean),
      answer: String(answer).trim(),
    },
    { new: true, runValidators: true }
  );

  if (!updated) {
    return res.status(404).json({ message: "Question not found" });
  }

  res.json({ message: "Question updated", question: updated });
}

export async function deleteQuestion(req, res) {
  const deleted = await Question.findByIdAndDelete(req.params.id);

  if (!deleted) {
    return res.status(404).json({ message: "Question not found" });
  }

  res.json({ message: "Question deleted" });
}

export async function getAttempts(req, res) {
  const attempts = await QuizAttempt.find({})
    .populate("user", "name email")
    .select("-answers")
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  res.json({ attempts });
}

export async function createAdminFromEnvironment() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "QuizNova Admin";

  if (!email || !password) return null;

  if (password.length < 6) {
    throw new Error("ADMIN_PASSWORD must be at least 6 characters.");
  }

  let user = await User.findOne({ email });

  if (!user) {
    const hashedPassword = await bcrypt.hash(password, 12);
    user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });
    console.log("QuizNova admin account created.");
    return user;
  }

  if (user.role !== "admin") {
    user.role = "admin";
    await user.save();
    console.log("QuizNova admin role granted to configured account.");
  }

  return user;
}
