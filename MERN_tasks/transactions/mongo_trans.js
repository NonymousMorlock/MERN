// I already left comments in the mongoose_trans.js, so check it first before this
const { MongoClient } = require("mongodb");
const client = new MongoClient(uri, { useUnifiedTopology: true });
await client.connect();

const session = client.startSession();
session.startTransaction();
try {
  const result = await Model.create([...yourElements], { session });
  await session.commitTransaction();
  return result;
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
  client.close();
}