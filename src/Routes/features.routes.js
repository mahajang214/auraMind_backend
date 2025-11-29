const express = require("express")
const { allTracks, addNewTrack, updateTrack, deleteTrack, answersCompleted, checkAllTasksCompleted, createHabit, createPassion, getHabits, getPassions, updateWhoAmIQuestions, getEmail, getReports, deleteHabit, deletePassion, deleteTracks, getIkigai, updateIkigai, updateStreaks, updateStreak, updateTrackWithoutDuration, getFiveTwentyFive, updateFiveTwentyFive, resetFiveTwentyFive } = require("../Controller/features.controller.js");
const protection = require("../Middlewares/protection.js");

const router = express.Router();

router.get("/all-tracks", protection, allTracks);
router.patch("/update-tracks/:id", protection, updateTrack);
router.patch("/update-track-without-duration/:id", protection, updateTrackWithoutDuration);
router.post("/add-new-track", protection, addNewTrack);
router.delete("/delete-track/:id", protection, deleteTrack);
router.patch("/answers-completed/:id", protection, answersCompleted);
router.get("/check-all-tasks-completed", protection, checkAllTasksCompleted);

router.post("/create-habit", protection, createHabit);
router.post("/create-passion", protection, createPassion);
router.get("/get-habits", protection, getHabits);
router.get("/get-passions", protection, getPassions);

// router.post("/reset-tracks", protection, resetTracks);
router.put("/update-whoami-questions", protection, updateWhoAmIQuestions);

router.get("/get-email", protection, getEmail);

router.patch("/update-streaks", protection, updateStreak);

router.delete("/delete-habit/:id", protection, deleteHabit);
router.delete("/delete-passion/:id", protection, deletePassion);
router.delete("/delete-tracks/:id", protection, deleteTracks);

router.get("/get-reports", protection, getReports);

router.patch("/update-ikigai", protection, updateIkigai);
router.get("/get-ikigai", protection, getIkigai);

// 5-25 rules
router.get("/get-5-25", protection, getFiveTwentyFive);
router.post("/update-5-25", protection, updateFiveTwentyFive);
router.patch("/reset-5-25", protection, resetFiveTwentyFive);



module.exports = router;