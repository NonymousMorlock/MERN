const mongoose = require('mongoose');

const session = await mongoose.startSession();
session.startTransaction();
try {
  // do stuff with the transaction
  const result = await Model.create([...yourElements], { session });
  //commit the transaction
  await session.commitTransaction();
  return result;
} catch (error) {
  // If an error occurred, abort the transaction and undo any changes that may have happened
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}