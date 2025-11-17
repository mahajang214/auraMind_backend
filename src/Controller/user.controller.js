const UserModal = require("../Modals/User.modal");

const getUserInfo=async(req,res)=>{
    try {
        const userId = req.user.id;
        // Fetch user info from database using userId
        const user=await UserModal.find({_id:userId});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        return res.status(200).json({
            message:"User info fetched successfully",
            data:user,
        });
    } catch (error) {
        console.error("Error fetching user info : ",error);
        return res.status(500).json({
            message:"Something went wrong during fetching user info",
            error:error.message,
        });
    }
};
const setupDailyReward = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await UserModal.findById(userId);
    const { dailyReward } = req.body;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.dailyReward) {
      user.dailyReward = dailyReward;
      await user.save();
      return res.status(200).json({ message: "Daily reward set successfully", data: user.dailyReward });
    } else {
      return res.status(400).json({ message: "Daily reward already set for today" });
    }
  } catch (error) {
    console.error("Error setting daily reward : ", error.message);
    return res.status(500).json({
      message: "Something went wrong during setting daily reward",
      error: error.message,
    });
  }

}

module.exports={getUserInfo, setupDailyReward};