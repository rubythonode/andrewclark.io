import thinky from './thinky';
import { get } from 'lodash-fp';

const { type } = thinky;

import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';

import { globalIdField } from 'graphql-relay';
import Slug from './Slug';
import User from './User';

const Post = thinky.createModel('Post', {
  id: type.string(),
  title: type.string(),
  content: type.string(),
  authorId: type.string()
});

Post.hasOne(Slug, 'slug', 'id', 'postId');
Slug.belongsTo(Post, 'post', 'postId', 'id');

Post.hasOne(User, 'author', 'id', 'postId');
User.hasMany(Post, 'posts', 'id', 'authorId');

Post.defineStatic('getNode', query =>
  query.getJoin({ slug: true })
);

Post.defineStatic('createType', ({ getInterface, getType }) =>
  new GraphQLObjectType({
    name: Post.getTableName(),
    description: 'A post',
    interfaces: [getInterface('Node')],
    fields: () => ({
      id: globalIdField(Post.getTableName()),

      title: {
        type: GraphQLString,
        description: 'The title of the post',
        resolve: get('title')
      },

      content: {
        type: GraphQLString,
        description: 'The content of the post',
        resolve: get('content')
      },

      slug: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The unique URL slug of the post',
        resolve: get(['slug', 'id'])
      },

      author: {
        type: new GraphQLNonNull(getType('User')),
        description: 'The author of the post',
        resolve: post => User.getNode(User.get(post.authorId))
      }
    })
  })
);

export default Post;
