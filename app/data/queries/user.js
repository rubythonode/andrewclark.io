import { GraphQLString } from 'graphql';
import thinky from '../thinky';
import User from '../User';

const { r, Query } = thinky;

export default function createUserQuery({ getType }) {
  const userType = getType('User');

  return {
    type: userType,
    args: {
      email: {
        type: GraphQLString
      }
    },
    resolve: async (root, args) => {
      const userQuery = new Query(User,
        r.table('Email')
          .get(args.email)
          .do(email => r.table('User').get(email('userId')))
      );
      return User.getNode(userQuery).run();
    }
  };
}
