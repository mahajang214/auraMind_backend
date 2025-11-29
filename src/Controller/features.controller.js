require("dotenv").config();
const mongoose = require("mongoose");
const TrackModal = require("../Modals/track.modal.js");
const UserModal = require("../Modals/User.modal.js");
const jwt = require("jsonwebtoken");
const calculateProgress = require("../Utils/calculateProgress.js");
const DailyReportModel = require("../Modals/dailyReport.modal.js");
const HabitsModal = require("../Modals/habits.modal.js");
const passionsModal = require("../Modals/passion.modal.js");
const QuestionModal = require("../Modals/Question.modal.js");
const updateReports = require("./utils/updateReports.js");
const MonthlyReportModel = require("../Modals/monthlyReport.modal.js");
const YearlyReportModel = require("../Modals/yearlyReport.modal.js");
const IkigaiModal = require("../Modals/ikigai.modal.js");
const FiveTwentyFiveModal = require("../Modals/fiveTwentyFive.modal.js");

const addNewTrack = async (req, res) => {
  try {
    const { title, category, duration, max_duration } = req.body;
    const userId = req.user.id;
    const validCategories = [
      "Health",
      "Work",
      "Learning",
      "Productivity",
      "Social",
      "Financial",
      "Entertainment",
      "Other",
    ];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }
    if (max_duration) {
      if (
        typeof max_duration.hr !== "number" ||
        typeof max_duration.min !== "number" ||
        typeof max_duration.sec !== "number"
      ) {
        return res.status(400).json({ message: "Invalid max_duration format" });
      }
    }
    if (
      !duration ||
      typeof duration.hr !== "number" ||
      typeof duration.min !== "number" ||
      typeof duration.sec !== "number"
    ) {
      return res.status(400).json({ message: "Invalid duration format" });
    }
    const newTrack = await TrackModal.create({
      title,
      category,
      duration,
      max_duration,
      ownerId: userId,
    });
    const user = await UserModal.findById(userId);
    user.tracks.push(newTrack._id);
    await user.save();
    return res.status(201).json({
      message: "Track created successfully",
      data: newTrack,
    });
  } catch (error) {
    console.error("Error during new track creation : ", error);
    return res.status(500).json({
      message: "Something went wrong during track creation",
      error: error.message,
    });
  }
};

// Update a track by updating its name or duration
const updateTrack = async (req, res) => {
  try {
    const trackId = req.params.id;
    const userId = req.user.id;
    const { title, duration } = req.body;

    // Validate input
    if (
      !duration ||
      typeof duration.hr !== "number" ||
      typeof duration.min !== "number" ||
      typeof duration.sec !== "number"
    ) {
      return res.status(400).json({ message: "Invalid duration format" });
    }

    //  Use _id for MongoDB
    const track = await TrackModal.findOne({ _id: trackId, ownerId: userId });
    if (!track) {
      return res
        .status(404)
        .json({ message: "Track not found or unauthorized" });
    }

    // Update title if provided
    if (title) track.title = title;

    const isDurationChanged =
      duration.hr !== track.duration.hr ||
      duration.min !== track.duration.min ||
      duration.sec !== track.duration.sec;

    if (isDurationChanged) {
      // Store previous duration in old_durations array
      track.old_durations.unshift({
        hr: track.duration.hr,
        min: track.duration.min,
        sec: track.duration.sec,
        updatedAt: Date.now(),
      });

      // Keep only the last 2 durations
      if (track.old_durations.length > 2) {
        track.old_durations = track.old_durations.slice(0, 2);
      }

      //  Update new duration
      track.duration = {
        hr: duration.hr,
        min: duration.min,
        sec: duration.sec,
      };
    }
    await track.save();





    return res.status(200).json({
      message: "Track updated successfully",
      data: track,
    });
  } catch (error) {
    console.error("Error updating track:", error);
    return res.status(500).json({
      message: "Something went wrong during track update",
      error: error.message,
    });
  }
};

const updateTrackWithoutDuration = async (req, res) => {
  try {
    const trackId = req.params.id;
    const userId = req.user.id;
    const { title, category, max_duration } = req.body;

    // Fetch track
    const track = await TrackModal.findOne({ _id: trackId, ownerId: userId });
    if (!track) {
      return res
        .status(404)
        .json({ message: "Track not found or unauthorized" });
    }

    // Update title
    if (title) track.title = title;

    // Update category
    if (category) track.category = category;

    // Update max_duration only if user provided values
    if (max_duration) {
      track.max_duration = {
        hr: max_duration.hr ?? track.max_duration.hr,
        min: max_duration.min ?? track.max_duration.min,
        sec: max_duration.sec ?? track.max_duration.sec,
      };
    }

    await track.save();

    return res.status(200).json({
      message: "Track updated successfully",
      data: track,
    });
  } catch (error) {
    console.log("Error updating track:", error.message);
    return res.status(500).json({
      message: "Something went wrong during track update",
      error: error.message,
    });
  }
};


// Delete a track
const deleteTrack = async (req, res) => {
  try {
    const trackId = req.params.id;
    const userId = req.user.id;

    const track = await TrackModal.findOneAndDelete({
      _id: trackId,
      userId: userId,
    });

    if (!track) {
      return res
        .status(404)
        .json({ message: "Track not found or unauthorized" });
    }

    return res.status(200).json({
      message: "Track deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting track : ", error);
    return res.status(500).json({
      message: "Something went wrong during track deletion",
      error: error.message,
    });
  }
};

const allTracks = async (req, res) => {
  try {
    const userId = req.user.id;
    const tracks = await TrackModal.find({ ownerId: userId });
    return res.status(200).json({
      message: "Tracks fetched successfully",
      data: tracks,
    });
  } catch (error) {
    console.error("Error fetching tracks : ", error);
    return res.status(500).json({
      message: "Something went wrong during fetching tracks",
      error: error.message,
    });
  }
};

const answersCompleted = async (req, res) => {
  try {
    const userId = req.user.id;
    const trackId = req.params.id;

    const track = await TrackModal.findOne({ _id: trackId, ownerId: userId });
    if (!track) {
      return res
        .status(404)
        .json({ message: "Track not found or unauthorized" });
    }

    track.answersCompleted = true;
    await track.save();
    // update reports
    await updateReports(userId);

    return res.status(200).json({
      message: "Track updated successfully",
      data: track,
    });
  } catch (error) {
    console.error("Error updating track : ", error);
    return res.status(500).json({
      message: "Something went wrong during track update",
      error: error.message,
    });
  }
};



const checkAllTasksCompleted = async (req, res) => {
  try {
    const userId = req.user.id;
    const tracks = await TrackModal.find({ ownerId: userId });
    const allCompleted = tracks.every(track => track.answersCompleted);

    // update all reports

    return res.status(200).json({
      message: "Check completed successfully",
      allCompleted,
    });
  } catch (error) {
    console.error("Error checking tasks : ", error);
    return res.status(500).json({
      message: "Something went wrong during checking tasks",
      error: error.message,
    });
  }
};

const createHabit = async (req, res) => {
  try {
    const userId = req.user.id;
    const { habitName, frequency, description } = req.body;

    // 1️⃣ Validate user
    const user = await UserModal.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ Validate required fields
    if (!habitName || !frequency) {
      return res
        .status(400)
        .json({ message: "Habit name and frequency are required" });
    }

    // 3️⃣ Validate frequency
    const allowedFrequencies = ["Daily", "Weekly", "Monthly", "Yearly"];
    if (!allowedFrequencies.includes(frequency)) {
      return res.status(400).json({ message: "Invalid frequency value" });
    }

    // 4️⃣ Create new habit
    const isHabitExist = await HabitsModal.findOne({ ownerId: userId });
    let newHabit;
    if (isHabitExist) {
      // If habit document exists for user, push new habit to habits array
      isHabitExist.habits.push({
        name: habitName,
        frequency,
        description,
      });
      newHabit = isHabitExist;
    } else {
      // If no habit document exists, create a new one
      newHabit = new HabitsModal({
        ownerId: userId,
        habits: [
          {
            name: habitName,
            frequency,
            description,
          },
        ],
      });
    }

    // 5️⃣ Save to DB
    await newHabit.save();

    // 6️⃣ Respond
    return res.status(201).json({
      success: true,
      message: "Habit created successfully",
      data: newHabit,
    });
  } catch (error) {
    console.error("Error creating habit:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during habit creation",
      error: error.message,
    });
  }
};


const createPassion = async (req, res) => {
  try {
    const userId = req.user.id;
    const { passionName, description, frequency } = req.body;

    const user = await UserModal.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!passionName) {
      return res.status(400).json({ message: "Passion name is required" });
    }
    if (frequency && !['Daily', 'Weekly', 'Monthly', 'Yearly'].includes(frequency)) {
      return res.status(400).json({ message: "Invalid frequency value" });
    }


    const isPassionExist = await passionsModal.findOne({ ownerId: userId });
    let newPassion;
    if (isPassionExist) {
      // If passion document exists for user, push new passion to passions array
      isPassionExist.passions.push({
        name: passionName,
        frequency,
        description,
      });
      newPassion = isPassionExist;
    } else {
      // If no passion document exists, create a new one
      newPassion = new passionsModal({
        ownerId: userId,
        passions: [
          {
            name: passionName,
            frequency,
            description,
          },
        ],
      });
    }
    await newPassion.save();


    return res.status(201).json({
      message: "Passion created successfully",
      data: newPassion,
    });
  } catch (error) {
    console.error("Error creating passion : ", error);
    return res.status(500).json({
      message: "Something went wrong during passion creation",
      error: error.message,
    });
  }
};

const getHabits = async (req, res) => {
  try {
    const userId = req.user.id;

    // findOne instead of find
    let habitsData = await HabitsModal.findOne({ ownerId: userId });

    // If doesn't exist -> create new one
    if (!habitsData) {
      habitsData = await HabitsModal.create({
        ownerId: userId,
        habits: []
      });
    }

    return res.status(200).json({
      message: "Habits fetched successfully",
      data: habitsData,
    });

  } catch (error) {
    console.error("Error fetching habits : ", error);
    return res.status(500).json({
      message: "Something went wrong during fetching habits",
      error: error.message,
    });
  }
};


const getPassions = async (req, res) => {
  try {
    const userId = req.user.id;

    let passionsData = await passionsModal.findOne({ ownerId: userId });

    // If not found → create it
    if (!passionsData) {
      passionsData = await passionsModal.create({
        ownerId: userId,
        passions: []
      });
      await passionsData.save();
    }

    return res.status(200).json({
      message: "Passions fetched successfully",
      data: passionsData
    });

  } catch (error) {
    console.error("Error fetching passions :", error);
    return res.status(500).json({
      message: "Something went wrong during fetching passions",
      error: error.message
    });
  }
};

const updateWhoAmIQuestions = async (req, res) => {
  const userId = req.user.id;
  const { question, answer } = req.body;
  try {
    const user = await UserModal.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isModalExist = await QuestionModal.findOne({ ownerId: userId });
    if (isModalExist) {
      isModalExist.data.push({ question, answer, answeredAt: Date.now() });
      user.gems += 1; // Reward user with 1 gems for answering a question
      await isModalExist.save();
      await user.save();
      return res.status(200).json({
        message: "Question added successfully",
        data: isModalExist.data,
      });
    } else {
      const newModal = await QuestionModal.create({
        ownerId: userId,
        data: [{ question, answer, answeredAt: Date.now() }],
      });
      user.gems += 1;
      await newModal.save();
      await user.save();
      return res.status(201).json({
        message: "Question added successfully",
        data: newModal,
      });
    }
  } catch (error) {
    console.error("Error updating WhoAmI questions : ", error);
    return res.status(500).json({
      message: "Something went wrong during updating WhoAmI questions",
      error: error.message,
    });
  }
};

const getEmail = async (req, res) => {
  try {
    const user = req.user.id;
    const userData = await UserModal.findById(user).select("+email");
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      message: "Email fetched successfully",
      data: userData.email,
    });
  } catch (error) {
    console.error("Error fetching email : ", error);
    return res.status(500).json({
      message: "Something went wrong during fetching email",
      error: error.message,
    });
  }
};

const getReports = async (req, res) => {
  try {
    const userId = req.user.id;
    const dailyReports = await DailyReportModel.find({ ownerId: userId });
    const monthlyReports = await MonthlyReportModel.find({ ownerId: userId });
    const yearlyReports = await YearlyReportModel.find({ ownerId: userId });
    return res.status(200).json({
      message: "Reports fetched successfully",
      data: { dailyReports, monthlyReports, yearlyReports },
    });
  } catch (error) {
    console.error("Error fetching reports : ", error);
    return res.status(500).json({
      message: "Something went wrong during fetching reports",
      error: error.message,
    });
  }
};

const deleteHabit = async (req, res) => {
  try {
    const userId = req.user.id;
    const habitId = req.params.id;
    console.log("Deleting habit:", habitId, "for user:", userId);

    // 1. Check user document exists
    const habitOwner = await HabitsModal.findOne({ ownerId: userId });
    if (!habitOwner) {
      return res.status(404).json({ message: "No habits found for user" });
    }

    // 2. Check if habit exists in user's habits
    const habitExists = habitOwner.habits.some(
      (habit) => habit._id.toString() === habitId
    );
    console.log("habitExists", habitExists);


    if (!habitExists) {
      return res.status(404).json({ message: "Habit not found" });
    }

    // 3. Delete habit using $pull
    await HabitsModal.updateOne(
      { ownerId: userId },
      { $pull: { habits: { _id: habitId } } }
    );

    // 4. Return updated habits list
    const updatedUserHabits = await HabitsModal.findOne({ ownerId: userId });

    res.status(200).json({
      message: "Habit deleted successfully",
      habits: updatedUserHabits.habits,
    });

  } catch (error) {
    console.error("Error deleting habit:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const deletePassion = async (req, res) => {
  const userId = req.user.id;
  const passionId = req.params.id;
  try {
    const passionOwner = await passionsModal.findOne({ ownerId: userId });
    if (!passionOwner) {
      return res.status(404).json({ message: "No passions found for user" });
    }

    const passionExists = passionOwner.passions.some(
      (passion) => passion._id.toString() === passionId
    );
    if (!passionExists) {
      return res.status(404).json({ message: "Passion not found" });
    }

    await passionsModal.updateOne(
      { ownerId: userId },
      { $pull: { passions: { _id: passionId } } }
    );
    const updatedUserPassions = await passionsModal.findOne({ ownerId: userId });

    res.status(200).json({
      message: "Passion deleted successfully",
      passions: updatedUserPassions.passions,
    });
  } catch (error) {
    console.error("Error deleting passion:", error);
    res.status(500).json({ message: "Server error" });
  }

};

const deleteTracks = async (req, res) => {
  const userId = req.user.id;
  const trackId = req.params.id;
  try {
    const track = await TrackModal.findOneAndDelete({
      _id: trackId,
      ownerId: userId,
    });

    if (!track) {
      return res
        .status(404)
        .json({ message: "Track not found or unauthorized" });
    }

    return res.status(200).json({
      message: "Track deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting track : ", error);
    return res.status(500).json({
      message: "Something went wrong during track deletion",
      error: error.message,
    });
  }
}

const updateIkigai = async (req, res) => {
  try {
    const userId = req.user.id;
    const { whatYouLove, whatTheWorldNeeds, whatYouAreGoodAt, whatYouCanBePayedFor, passion, mission, vocation, profession } = req.body;
    const updateIkigaiData = {
      whatYouLove,
      whatTheWorldNeeds,
      whatYouAreGoodAt,
      whatYouCanBePayedFor,
      data: {
        passion,
        mission,
        vocation,
        profession
      }
    };

    // Create new Ikigai document if it doesn't exist
    const updatedIkigai = await IkigaiModal.findOneAndUpdate(
      { ownerId: userId },
      updateIkigaiData,
      { new: true, upsert: true } // Create new document if not exists
    );

    return res.status(200).json({
      message: "Ikigai created successfully",
      data: updatedIkigai,
    });


    return res.status(200).json({
      message: "Ikigai updated successfully",
      data: updatedIkigai,
    });

  } catch (error) {
    console.error("Error updating Ikigai : ", error);
    return res.status(500).json({
      message: "Something went wrong during Ikigai update",
      error: error.message,
    });

  }
}

const getIkigai = async (req, res) => {
  try {
    const userId = req.user.id;

    let ikigaiData = await IkigaiModal.findOne({ ownerId: userId });

    // If no data → create new one
    if (!ikigaiData) {
      ikigaiData = await IkigaiModal.create({
        ownerId: userId,
        data: {
          passion: [],
          mission: [],
          vocation: [],
          profession: [],
        },
      });
    }

    return res.status(200).json({
      message: "Ikigai data fetched successfully",
      data: ikigaiData,
    });

  } catch (error) {
    console.error("Error fetching Ikigai data:", error);
    return res.status(500).json({
      message: "Something went wrong during fetching Ikigai data",
      error: error.message,
    });
  }
};

const updateStreak = async (req, res) => {
  try {
    const userId = req.user.id; // Already from auth middleware

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize date

    const user = await UserModal.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if today's streak entry already exists
    const todayStreak = user.streak.find((entry) => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    });

    if (todayStreak) {
      // Do NOT add twice — streak for today already exists
      return res.status(200).json({
        message: "Already updated streak for today",
        streak: user.streak
      });
    }

    // Add NEW streak entry with +1 point
    user.streak.push({
      points: 1,
      date: today
    });

    await user.save();

    return res.status(200).json({
      message: "Streak updated (+1)",
      streak: user.streak
    });

  } catch (error) {
    console.error("Error updating daily streak:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// helper: convert strings → { goal: "..." }
const normalize = (arr) =>
  (arr ?? []).map((g) => ({ goal: g?.trim() || "" }));


// ----------------------------------------------------------
// GET 5/25 DATA
// ----------------------------------------------------------
const getFiveTwentyFive = async (req, res) => {
  try {
    const userId = req.user.id;

    const data = await FiveTwentyFiveModal.findOne({ ownerId: userId }).lean();

    if (!data) {
      return res.status(200).json({
        data: { fiveGoals: [], twentyGoals: [] },
      });
    }

    return res.status(200).json({
      data: {
        fiveGoals: data.fiveGoals.map((g) => g.goal),
        twentyGoals: data.twentyGoals.map((g) => g.goal),
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Unable to fetch goals" });
  }
};


// ----------------------------------------------------------
// UPDATE / UPSERT
// ----------------------------------------------------------
const updateFiveTwentyFive = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fiveGoals, twentyGoals } = req.body;

    const normalizedFive = normalize(fiveGoals);
    const normalizedTwenty = normalize(twentyGoals);

    if (normalizedFive.length > 5)
      return res.status(400).json({ message: "Top 5 goals must be 5 max" });

    if (normalizedTwenty.length > 20)
      return res.status(400).json({ message: "Twenty goals must be 20 max" });

    const data = await FiveTwentyFiveModal.findOneAndUpdate(
      { ownerId: userId },
      {
        fiveGoals: normalizedFive,
        twentyGoals: normalizedTwenty,
      },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      message: "5/25 goals updated",
      data,
    });
  } catch (err) {
    console.log("Error update:", err);
    return res.status(500).json({ message: "Update failed" });
  }
};


// ----------------------------------------------------------
// RESET
// ----------------------------------------------------------
const resetFiveTwentyFive = async (req, res) => {
  try {
    const userId = req.user.id;

    const data = await FiveTwentyFiveModal.findOneAndUpdate(
      { ownerId: userId },
      { $set: { fiveGoals: [], twentyGoals: [] } },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      message: "5/25 reset successful",
      data,
    });
  } catch (err) {
    return res.status(500).json({ message: "Reset failed" });
  }
};






module.exports = {
  addNewTrack,
  updateTrack,
  deleteTrack,
  allTracks,
  answersCompleted,
  checkAllTasksCompleted,
  createHabit,
  createPassion,
  getHabits,
  getPassions,
  updateWhoAmIQuestions,
  getEmail, getReports,
  deleteHabit,
  deletePassion,
  deleteTracks,
  updateIkigai,
  getIkigai,
  updateStreak,
  updateTrackWithoutDuration,
  getFiveTwentyFive,
  updateFiveTwentyFive,
  resetFiveTwentyFive
};
