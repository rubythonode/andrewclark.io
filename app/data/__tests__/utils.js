import { r } from '../thinky';
import { graphql } from 'graphql';
import schema from '../schema';
import User from '../User';
import Email from '../Email';

export async function resetDatabase() {
  const tables = await r.tableList().run();
  await Promise.all(
    tables.map(table => r.db('test').table(table).delete().run())
  );
}

export const CERSEI_EMAIL = 'cersei@kingslanding.wes';

export async function createCersei() {
  const user = new User({
    email: new Email({
      id: CERSEI_EMAIL
    }),
    password: await User.hashPassword('imthequeen')
  });

  await user.saveAll({
    email: true
  });

  return user;
}

export async function queryCersei(fragment) {
  const query = `
    query QueryCersei($email: String) {
      cersei: user(email: $email) {
        ...cerseiInfo
      }
    }
    fragment cerseiInfo on User ${fragment}
  `;
  const params = {
    email: CERSEI_EMAIL
  };

  const response = await graphql(schema, query, null, params);
  return response.data.cersei;
}
