import { Request, Response } from 'express';
import { hashSync } from 'bcrypt';
import { Knex } from 'knex';

const handleRegister = (req: Request, res: Response, db: Knex) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json('Incorrect form submission');
  }

  const saltRounds = 10,
    hash = hashSync(password, saltRounds);

  db.transaction((trx: Knex.Transaction) => {
    trx
      .insert({
        hash,
        email,
      })
      .into('login')
      .returning('email')
      .then(async (loginEmail) => {
        const user = await trx('users').returning('*').insert({
          email: loginEmail[0].email,
          name: name,
          joined: new Date(),
        });

        res.json(user[0]);
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((reason: unknown) => {
    console.log(reason);
    return res.status(400).json('unable to register');
  });
};

export default {
  handleRegister,
};
