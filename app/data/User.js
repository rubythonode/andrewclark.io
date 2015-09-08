import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';

import { globalIdField } from 'graphql-relay';

import thinky from './thinky';
import bcrypt from 'bcrypt';
import { get } from 'lodash-fp';
import Email from './Email';

const { type } = thinky;

const User = thinky.createModel('User', {
  id: type.string(),
  firstName: type.string(),
  lastName: type.string(),
  password: type.string().required()
});

User.defineStatic('hashPassword', password => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (error1, salt) => {
      if (error1) {
        return reject(error1);
      }

      bcrypt.hash(password, salt, (error2, hash) => {
        if (error2) {
          return reject(error2);
        }
        resolve(hash);
      });
    });
  });
});

User.define('checkPassword', password => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, isPassword) => {
      if (err) reject(err);

      resolve(isPassword);
    });
  });
});

User.hasOne(Email, 'email', 'id', 'userId');
Email.belongsTo(User, 'user', 'userId', 'id');

User.defineStatic('getNode', query =>
  query.getJoin({ email: true })
);

User.defineStatic('createType', ({ getInterface }) =>
  new GraphQLObjectType({
    name: User.getTableName(),
    description: 'A user',
    interfaces: [getInterface('Node')],
    fields: () => ({
      id: globalIdField(User.getTableName()),

      email: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The user\'s email. Must be unique.',
        resolve: get(['email', 'id'])
      },

      firstName: {
        type: GraphQLString,
        description: 'The user\'s first name',
        resolve: get('firstName')
      },

      lastName: {
        type: GraphQLString,
        description: 'The user\'s last name',
        resolve: get('lastName')
      }
    })
  })
);

export default User;
