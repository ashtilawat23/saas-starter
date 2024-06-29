import clientPromise from './mongodb';

const handler = async (req, res, collectionName) => {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection(collectionName);

  switch (req.method) {
    case 'GET':
      try {
        const data = await collection.find({}).toArray();
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
      }
      break;
    case 'POST':
      try {
        const data = req.body;
        await collection.insertOne(data);
        res.status(201).json({ message: 'Data inserted' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to insert data' });
      }
      break;
    case 'PUT':
      try {
        const { _id, ...data } = req.body;
        await collection.updateOne({ _id: new ObjectId(_id) }, { $set: data });
        res.status(200).json({ message: 'Data updated' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to update data' });
      }
      break;
    case 'DELETE':
      try {
        const { _id } = req.body;
        await collection.deleteOne({ _id: new ObjectId(_id) });
        res.status(200).json({ message: 'Data deleted' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete data' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
