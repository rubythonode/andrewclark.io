import thinky from './thinky';
import _slug from 'slug';

const { type } = thinky;

export function slugify(string) {
  return _slug(string, { lower: true });
}

export function validateSlug(string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(string);
}

const Slug = thinky.createModel('Slug', {
  id: type.string().validator(validateSlug),
  postId: type.string()
}, {
  pk: 'id'
});

export async function createUniqueSlug(originalString) {
  async function recurse(string, attempt = 1) {
    const unique = await Slug.getAll(string).count().eq(0).execute();

    if (!unique) {
      const nextAttempt = attempt + 1;
      return recurse(`${originalString}-${nextAttempt}`, nextAttempt);
    }

    const slug = new Slug({ id: string });
    await slug.save();
    return slug;
  }

  return await recurse(originalString);
}

export default Slug;
