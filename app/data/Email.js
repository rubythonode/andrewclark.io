import thinky from './thinky';
const { type } = thinky;

const Email = thinky.createModel('Email', {
  id: type.string().email(),
  userId: type.string()
}, {
  pk: 'id'
});

export default Email;
