import migrate from 'migrate';

const set = migrate.load('app/data/migration/.migrate', 'app/data/migration');

set.up(error => {
  if (error) throw error;
  console.log('Migration completed');
});
