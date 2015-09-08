import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLID
} from 'graphql';

import { fromGlobalId } from 'graphql-relay';

import { mutationWithClientMutationId } from 'graphql-relay';
import { get } from 'lodash-fp';
import Post from '../Post';
import User from '../User';
import Slug, { createUniqueSlug, slugify } from '../Slug';

export default function createCreatePostMutation({ getType }) {
  const postType = getType('Post');
  const userType = getType('User');

  const createPostMutation = mutationWithClientMutationId({
    name: 'CreatePost',
    inputFields: {
      title: {
        type: GraphQLString
      },
      content: {
        type: GraphQLString
      },
      slug: {
        type: GraphQLString
      },
      authorId: {
        type: new GraphQLNonNull(GraphQLID)
      }
    },
    outputFields: {
      post: {
        type: postType,
        resolve: get('post')
      },
      author: {
        type: userType,
        resolve: get('author')
      }
    },
    mutateAndGetPayload: async input => {
      const { id: authorId } = fromGlobalId(input.authorId);

      const author = await User.getNode(User.get(authorId)).run()
        .catch(() => {
          throw new Error('Non-existent author id');
        });

      const slug = input.slug
        ? new Slug({ id: input.slug })
        : await createUniqueSlug(slugify(input.title));

      try {
        await slug.validate();
      } catch (error) {
        throw new Error('Invalid slug');
      }

      const post = new Post({
        title: input.title,
        content: input.content,
        authorId: author.id
      });

      post.slug = slug;
      slug.post = post;

      await post.saveAll({
        slug: true,
        author: true
      });

      return { post, author };
    }
  });

  return createPostMutation;
}
