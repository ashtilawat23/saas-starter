import handler from '../../../utils/crudHandler';

export default async function (req, res) {
  await handler(req, res, 'users');
}