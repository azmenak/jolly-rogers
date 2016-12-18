'use strict';
const fs = require('fs');

function generateAllCases(chars, count) {
  const charArray = chars.split('');
  const possibilitesArray = [];
  for (let i = 0; i < count; i++) {
    possibilitesArray.push(charArray.slice())
  }
  return possibilitesArray;
}

function useMathToGenerateResults(cases) {
  const divisors = [];
  for (let i = cases.length-1; i >= 0; i--) {
    divisors[i] = divisors[i+1]
      ? divisors[i+1] * cases[i+1].length
      : 1;
  }

  function getPermutation(n) {
    let result = '';
    let current;
    for (let i = 0; i < cases.length; i++) {
      current = cases[i];
      result += current[Math.floor(n / divisors[i]) % current.length];
    }
    return result;
  }

  const permuteCount = cases.reduce((prev, curr) => prev*curr.length, 1);
  let currentProgress = 0;

  console.time('Generate passwords');
  for (let i = 0; i < permuteCount; i++) {
    const password = getPermutation(i);

    const progress = (i*100)/permuteCount;
    if (progress > currentProgress) {
      process.stdout.write(progressBar(currentProgress++));
    }

    fs.appendFileSync('./passwords-hex.txt', password + 'Rogers\n', 'utf-8');
  }
  console.log();
  console.timeEnd('Generate passwords');
}

(function runner() {
  const characters = `ABCDEF1234567890`;
  const headCount = 5;

  const cases = generateAllCases(characters, headCount);
  const results = useMathToGenerateResults(cases);
})();

function progressBar(n) {
  const bars = '='.repeat(n);
  const space = ' '.repeat(100-n);
  return ` [${bars}${space}] ${n}%\r`;
}
