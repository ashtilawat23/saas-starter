import clientPromise from '../../../utils/mongodb';

export default async function (req, res) {
  const client = await clientPromise;
  const db = client.db(process.env.DATABASE_NAME);
  const collection = db.collection('users');

  switch (req.method) {
    case 'GET':
      try {
        const users = await collection.find({}).toArray();
        res.status(200).json(users);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
      }
      break;
    case 'POST':
      try {
        const { id, email_address, image_url, first_name, last_name } = req.body;
        await collection.insertOne({ id, email_address, image_url, first_name, last_name });
        res.status(201).json({ message: 'User created' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
      }
      break;
    case 'PUT':
      try {
        const { id, email_address, image_url } = req.body;
        await collection.updateOne(
          { id },
          { $set: { email_address, image_url } }
        );
        res.status(200).json({ message: 'User updated' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
      }
      break;
    case 'DELETE':
      try {
        const { id } = req.body;
        await collection.deleteOne({ id });
        res.status(200).json({ message: 'User deleted' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
