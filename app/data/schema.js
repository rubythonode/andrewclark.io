import {
  GraphQLSchema,
  GraphQLObjectType
} from 'graphql';

import {
  fromGlobalId,
  nodeDefinitions,
} from 'graphql-relay';

import {
  flow,
  filter,
  forEach,
  find,
  isFunction,
  identity
} from 'lodash-fp';

import Email from './Email';
import Slug from './Slug';
import User from './User';
import Post from './Post';

import createPostQuery from './queries/post';
import createUserQuery from './queries/user';

import createCreatePostMutation from './mutations/createPost';

const models = {
  Email,
  Slug,
  User,
  Post
};

const interfaces = {};
const types = {};

function getInterface(name) {
  return interfaces[name];
}

function getType(name) {
  return types[name];
}

const { nodeInterface, nodeField } = nodeDefinitions(
  /**
   * Map a global id to an object.
   */
  globalId => {
    const { type, id } = fromGlobalId(globalId);
    const Model = find(M => M.getTableName() === type, models);

    if (!Model) return null;

    return Model.getNode(Model.get(id)).run();
  },

  /**
   * Map an object to a type.
   */
  object => {
    const Model = find(models, M => object.getModel() === M);

    if (!Model) return null;

    return getType(Model.getTableName());
  }
);

interfaces.Node = nodeInterface;

const accessors = { getType, getInterface };

flow(
  filter(Model => isFunction(Model.createType)),
  forEach(Model => {
    types[Model.getTableName()] = Model.createType(accessors);

    if (!isFunction(Model.getNode)) {
      Model.defineStatic('getNode', identity);
    }
  })
)(models);

/**
 * The query type, with our root queries
 */
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    post: createPostQuery(accessors),
    user: createUserQuery(accessors)
  })
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createPost: createCreatePostMutation(accessors)
  })
});

/**
 * Create and export the schema
 */
export default new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
