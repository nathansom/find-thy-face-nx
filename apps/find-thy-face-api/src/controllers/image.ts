import { Request, Response } from 'express';
import { Knex } from 'knex';

const handleEntry = (req: Request, res: Response, db: Knex) => {
  const { id } = req.body;

  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => {
      res.json(entries[0]);
    })
    .catch((reason: unknown) => {
      console.log(reason);
      return res.status(400).json('Unable to get entries');
    });
};

export default {
  handleEntry,
};
