import { Request, Response } from 'express';
import { Knex } from 'knex';

const handleProfile = (req: Request, res: Response, db: Knex) => {
  const { id } = req.params;

  db.select('*')
    .from('users')
    .where({ id })
    .then((user: unknown[]) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json('Not found');
      }
    })
    .catch(() => res.status(400).json('Not Found'));
};

export default { handleProfile };
