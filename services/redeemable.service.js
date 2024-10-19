import Redeemable from '../models/redeemable.model.js';
import User from '../models/user.model.js';

export const createRedeemableService = async (redeemableData) => {
  const { adminId } = redeemableData;

  // Check if the user is an admin
  const adminUser = await User.findById(adminId);
  if (!adminUser || !adminUser.isAdmin) {
    throw new Error('Access denied: Admins only');
  }

  const newRedeemable = new Redeemable(redeemableData);
  await newRedeemable.save();

  return { message: 'Redeemable created successfully.', redeemable: newRedeemable };
};

export const updateRedeemableService = async (id, updateData) => {
  const { adminId } = updateData;

  // Check if the user is an admin
  const adminUser = await User.findById(adminId);
  if (!adminUser || !adminUser.isAdmin) {
    throw new Error('Access denied: Admins only');
  }

  const updatedRedeemable = await Redeemable.findByIdAndUpdate(id, updateData, { new: true });

  if (!updatedRedeemable) {
    throw new Error('Redeemable not found.');
  }

  return { message: 'Redeemable updated successfully.', redeemable: updatedRedeemable };
};

export const deleteRedeemableService = async (id, adminId) => {
  // Check if the user is an admin
  const adminUser = await User.findById(adminId);
  if (!adminUser || !adminUser.isAdmin) {
    throw new Error('Access denied: Admins only');
  }

  const deletedRedeemable = await Redeemable.findByIdAndDelete(id);

  if (!deletedRedeemable) {
    throw new Error('Redeemable not found.');
  }

  return { message: 'Redeemable deleted successfully.' };
};

export const getAllRedeemablesService = async () => {
  const redeemables = await Redeemable.find();
  return { redeemables };
};

export const getAvailableRedeemablesService = async (userId) => {
  // Fetch the user from the database to get their current points and redeemed items
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const userPoints = user.points;

  // Fetch redeemables that the user has enough points for
  const redeemables = await Redeemable.find({
    cost: { $lte: userPoints },  // Only include redeemables the user can afford
    isActive: true  // Only include active redeemables
  });

  console.log("User Redeemed Items:", user.redeemedItems); // Debugging line
  console.log("Fetched Redeemables:", redeemables); // Debugging line

  // Filter out redeemables that the user has already redeemed
  const availableRedeemables = redeemables.filter((redeemable) => {
    const isRedeemed = user.redeemedItems.some(
      (item) => item.redeemableId.toString() === redeemable._id.toString()
    );

    if (isRedeemed) {
      console.log(`Redeemed Item Found: ${redeemable.name}`); // Debugging line
    }

    return !isRedeemed; // Keep the item if it's not redeemed
  });

  // Prepare the response data
  const data = {
    availableRedeemables,
    points: userPoints,
  };

  return { data };
};



export const redeemItemService = async (userId, redeemableId) => {
  // Fetch the user from the database
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found.');

  // Fetch the redeemable item from the database
  const redeemable = await Redeemable.findById(redeemableId);
  if (!redeemable) throw new Error('Redeemable not found.');

  // Check if the user has already redeemed this item
  const hasRedeemed = user.redeemedItems.some(item =>
    item.redeemableId.equals(redeemable._id)
  );
  if (hasRedeemed) {
    throw new Error('This item has already been redeemed.');
  }

  // Check if the user has enough points to redeem the item based on cost
  if (user.points < redeemable.cost) {
    throw new Error('Insufficient points to redeem this item.');
  }

  // Deduct the cost from the user's points
  user.points -= redeemable.cost;
  user.allTimePoints += redeemable.cost; // Track all-time points if necessary

  // Add the redeemed item to the user's redeemed items
  user.redeemedItems.push({
    redeemableId: redeemable._id,
    redeemedAt: new Date(),
  });

  // Save changes
  await user.save();

  return { message: 'Item redeemed successfully.', remainingPoints: user.points };
};


export const getRedeemedItemsService = async (userId) => {
  const user = await User.findById(userId).populate('redeemedItems.redeemableId'); // Populate to get redeemable details
  if (!user) throw new Error('User not found.');

  return { redeemedItems: user.redeemedItems };
};
