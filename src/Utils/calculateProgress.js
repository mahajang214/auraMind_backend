
const calculateProgress = (completedTasks, totalTasks) => {
    if (totalTasks === 0) return 0;
    return Math.round((completedTasks / totalTasks) * 100).toFixed(2);

}

module.exports = calculateProgress;