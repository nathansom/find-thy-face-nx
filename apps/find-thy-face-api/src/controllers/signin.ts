import { Request, Response } from "express";
import { compareSync } from "bcrypt";
import { Knex } from "knex";

const handleSignin = (req: Request, res: Response, db: Knex) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json('Incorrect form submission');
  }
  db.select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then(async (data) => {
      const isValid = compareSync(password, data[0].hash);

      if (isValid) {
        try {
          const user = await db
            .select('*')
            .from('users')
            .where('email', '=', email);
            
          res.json(user[0]);
        } catch {
          return res.status(400).json('Unable to get the user');
        }
      } else {
        res.status(400).json('Wrong credentials');
      }
    })
    .catch(() => res.status(400).json('wrong credentials'));
};

export default { handleSignin };
