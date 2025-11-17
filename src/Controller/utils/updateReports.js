const DailyReportModel = require("../../Modals/dailyReport.modal");
const MonthlyReportModel = require("../../Modals/monthlyReport.modal");
const YearlyReportModel = require("../../Modals/yearlyReport.modal");
const TrackModel = require("../../Modals/track.modal");

// ✅ Helper function to calculate progress
const calculateProgress = (completed, total) => {
    return total === 0 ? 0 : Math.round((completed / total) * 100);
};

const updateReports = async (userId) => {
    try {
        // 1️⃣ Count user's tracks
        const totalTracks = await TrackModel.countDocuments({ ownerId: userId });
        const completedTracks = await TrackModel.countDocuments({
            ownerId: userId,
            answersCompleted: true,
        });
        // console.log("total tracks:",totalTracks);
        // console.log("complted tracks:",completedTracks);

        const progressNumber = calculateProgress(completedTracks, totalTracks);

        // 2️⃣ Get current date components
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0)); // midnight today
        const endOfDay = new Date(now.setHours(23, 59, 59, 999));

        const dayName = now.toLocaleDateString("en-US", { weekday: "long" });
        const weekNumber = Math.ceil(new Date().getDate() / 7);
        const month = new Date().getMonth() + 1;
        const year = new Date().getFullYear();

        // 3️⃣ Daily Report (Find by date range)
        let dailyReport = await DailyReportModel.findOne({
            ownerId: userId,
            date: { $gte: startOfDay, $lte: endOfDay },
        });

        if (!dailyReport) {
            dailyReport = new DailyReportModel({
                ownerId: userId,
                totalTasks: totalTracks,
                completedTasks: completedTracks,
                progress: progressNumber,
                date: new Date(),
                dayName,
                weekNumber,
                month,
                year,
            });
        } else {
            dailyReport.totalTasks = totalTracks;
            dailyReport.completedTasks = completedTracks;
            dailyReport.progress = progressNumber;
            dailyReport.date = new Date();
            dailyReport.dayName = dayName;
            dailyReport.weekNumber = weekNumber;
            dailyReport.month = month;
            dailyReport.year = year;
        }
        await dailyReport.save();

        // 4️⃣ Monthly Report
        let monthlyReport = await MonthlyReportModel.findOne({ ownerId: userId, month, year });
        if (!monthlyReport) {
            monthlyReport = new MonthlyReportModel({
                ownerId: userId,
                totalTasks: totalTracks,
                completedTasks: completedTracks,
                progress: progressNumber,
                month,
                year,
                monthName: new Date().toLocaleString("default", { month: "long" }),
            });
        } else {
            monthlyReport.totalTasks += totalTracks; // ✅ add instead of replace
            monthlyReport.completedTasks += completedTracks; // ✅ accumulate
            monthlyReport.progress = calculateProgress(
                monthlyReport.completedTasks,
                monthlyReport.totalTasks
            );
        }
        await monthlyReport.save();

        // 5️⃣ Yearly Report
        let yearlyReport = await YearlyReportModel.findOne({ ownerId: userId, year });
        if (!yearlyReport) {
            yearlyReport = new YearlyReportModel({
                ownerId: userId,
                totalTasks: totalTracks,
                completedTasks: completedTracks,
                progress: progressNumber,
                year,
                monthsTracked: [month],
                totalMonthsTracked: 1,
            });
        } else {
            yearlyReport.totalTasks += totalTracks; // ✅ accumulate
            yearlyReport.completedTasks += completedTracks;
            yearlyReport.progress = calculateProgress(
                yearlyReport.completedTasks,
                yearlyReport.totalTasks
            );

            // track unique months
            const monthsSet = new Set(yearlyReport.monthsTracked || []);
            monthsSet.add(month);
            yearlyReport.monthsTracked = Array.from(monthsSet);
            yearlyReport.totalMonthsTracked = monthsSet.size;
        }
        await yearlyReport.save();
        // console.log("daily reports: ", dailyReport)


        return {
            success: true,
            message: "Reports updated successfully",
        };
    } catch (error) {
        console.error("Error updating reports:", error);
        return {
            success: false,
            message: "Error updating reports",
            error: error.message,
        };
    }
};

module.exports = updateReports;
