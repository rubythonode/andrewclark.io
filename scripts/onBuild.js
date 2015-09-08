export default function onBuild(done) {
  return (error, stats) => {
    if (error) {
      console.log('Error', error);
      return;
    }

    console.log(stats.toString());

    if (done) {
      done();
    }
  };
}
