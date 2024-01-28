// eslint-disable-next-line jsdoc/require-jsdoc
export default async function* reportCodeCoverageTotalResultOnly(source) {
  // eslint-disable-next-line no-restricted-syntax
  for await (const event of source) {
    if (event.type !== 'test:coverage') {
      // eslint-disable-next-line no-continue
      continue;
    }

    const {
      coveredLinePercent,
      coveredBranchPercent,
      coveredFunctionPercent,
    } = event.data.summary.totals;

    if (coveredLinePercent + coveredBranchPercent + coveredFunctionPercent !== 300) {
      throw new Error('Code coverage is not 100%.');
    }

    yield 'Ok, code coverage is 100%.\n';
  }
}
