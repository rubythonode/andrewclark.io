import { expect } from 'chai';
import { describe, it, after } from 'mocha';
import { graphql } from 'graphql';
import schema from '../schema';
import {
  resetDatabase,
  createCersei,
  queryCersei,
  CERSEI_EMAIL
} from './utils';

describe('Data', () => {
  describe('Post', () => {
    async function createCerseiPost(cersei, input, fragment) {
      const mutation = `
        mutation CreateTestPostQuery($input: CreatePostInput!) {
          createPost(input: $input) {
            post {
              ...postInfo
            }
          }
        }
        fragment postInfo on Post ${fragment}
      `;
      const params = {
        input: {
          authorId: cersei.id,
          clientMutationId: 'abcde',
          ...input
        }
      };

      return graphql(schema, mutation, null, params);
    }

    describe('post query', () => {
      it('gets a post by its slug', async () => {
        await resetDatabase();
        await createCersei();
        const cersei = await queryCersei(`{ id }`);
        const result = await createCerseiPost(
          cersei,
          {
            title: 'The dwarf killing will continue until morale improves',
            content: 'Mine, that is. So not anytime soon.'
          },
          `{
            slug
          }`
        );

        const { slug } = result.data.createPost.post;

        const query = `
          query GetCerseiPost($slug: String!) {
            post(slug: $slug) {
              author {
                email
              }
            }
          }
        `;
        const params = { slug };

        const { data } = await graphql(schema, query, null, params);
        expect(data.post.author.email).to.equal(CERSEI_EMAIL);
      });
    });

    describe('createPost mutation', () => {
      after(resetDatabase);

      it('creates new posts', async () => {
        await resetDatabase();
        await createCersei();

        const cersei = await queryCersei(`{ id }`);

        const mutation = `
          mutation CreateTestPostQuery($input: CreatePostInput!) {
            createPost(input: $input) {
              post {
                title,
                slug
              }
              author {
                email
              }
              clientMutationId
            }
          }
        `;
        const params = {
          input: {
            title: 'The Targaryens had some good ideas',
            authorId: cersei.id,
            clientMutationId: 'abcde',
          }
        };
        const expected = {
          createPost: {
            post: {
              title: 'The Targaryens had some good ideas',
              slug: 'the-targaryens-had-some-good-ideas'
            },
            author: {
              email: CERSEI_EMAIL
            },
            clientMutationId: 'abcde',
          }
        };
        const { data } = await graphql(schema, mutation, null, params);
        expect(data).to.eql(expected);
      });

      it('requires a valid author id', async () => {
        await resetDatabase();
        await createCersei();

        const mutation = `
          mutation CreateTestPostQuery($input: CreatePostInput!) {
            createPost(input: $input) {
              author {
                email
              }
            }
          }
        `;
        const params = {
          input: {
            title: 'Lies, damn lies, and Stannis Baratheon',
            authorId: 'lolnope',
            clientMutationId: 'abcde',
          }
        };
        const { errors } = await graphql(schema, mutation, null, params);
        expect(errors[0].message).to.equal(
          'Non-existent author id'
        );
      });

      it('rejects invalid slugs', async () => {
        await resetDatabase();
        await createCersei();
        const cersei = await queryCersei(`{ id }`);

        const { data } = await createCerseiPost(
          cersei,
          { slug: 'this-is-a-slug' },
          `{ slug }`
        );
        expect(data.createPost.post.slug).to.equal('this-is-a-slug');

        const { errors } = await createCerseiPost(
          cersei,
          { slug: 'This is not slug' },
          `{ slug }`
        );
        expect(errors[0].message).to.equal(
          'Invalid slug'
        );

        await resetDatabase();
      });

      it('generates slug from title if slug not given', async () => {
        await resetDatabase();
        await createCersei();
        const cersei = await queryCersei(`{ id }`);

        const { data } = await createCerseiPost(
          cersei,
          { title: 'FMK: Kingsguard edition' },
          `{ slug }`
        );
        expect(data.createPost.post.slug).to.equal('fmk-kingsguard-edition');

        const { data: data2 } = await createCerseiPost(
          cersei,
          { title: 'FMK: Kingsguard edition' },
          `{ slug }`
        );
        expect(data2.createPost.post.slug).to.equal('fmk-kingsguard-edition-2');

        const { data: data3 } = await createCerseiPost(
          cersei,
          { title: 'FMK: Kingsguard edition' },
          `{ slug }`
        );
        expect(data3.createPost.post.slug).to.equal('fmk-kingsguard-edition-3');

        await resetDatabase();
      });
    });
  });
});
