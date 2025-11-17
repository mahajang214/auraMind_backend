const DailyReportModel = require("../../Modals/dailyReport.modal");
const MonthlyReportModel = require("../../Modals/monthlyReport.modal");
const YearlyReportModel = require("../../Modals/yearlyReport.modal");
const TrackModel = require("../../Modals/track.modal");
const UserModel = require("../../Modals/User.modal");



// ✅ Utility function (does NOT send HTTP response)
const resetTracks = async (userId) => {
  try {
    

    // 6️⃣ Reset user's tracks and reward
    await TrackModel.updateMany({ ownerId: userId }, { answersCompleted: false });
    await UserModel.findByIdAndUpdate(userId, { dailyReward: null });

    // ✅ Return instead of sending res
    return {
      success: true,
      message: "Tracks are successfully reset",
    };
  } catch (error) {
    console.error("Error resetting tracks:", error);
    return {
      success: false,
      message: "Error resetting tracks",
      error: error.message,
    };
  }
};


module.exports = resetTracks;