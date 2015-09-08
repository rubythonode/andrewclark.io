import { GraphQLString } from 'graphql';
import thinky from '../thinky';
import Post from '../Post';

const { r, Query } = thinky;

export default function createPostQuery({ getType }) {
  const postType = getType('Post');

  return {
    type: postType,
    args: {
      slug: {
        type: GraphQLString
      }
    },
    resolve: (root, args) => {
      const postQuery = new Query(Post,
        r.table('Slug')
          .get(args.slug)
          .do(slug => r.table('Post').get(slug('postId')))
      );
      return Post.getNode(postQuery).run();
    }
  };
}
