/**
 * Created by Scott Haley on 3/24/2017.
 */

const fs = require('fs');

module.exports = (() => {

  const readLine = (uri, line) => {
    let lines = fs.readFileSync(uri, 'utf8').split('\n');

    if (line > lines.length) {
      throw new Error('File end reached without finding line');
    }

    return lines[line];
  };

  const writeLine = (uri, line, text) => {
    let lines = fs.readFileSync(uri, 'utf8').split('\n');
    lines.splice(line, 0, text);
    let data = lines.join('\n');
    fs.writeFileSync(uri, data);
  }

  const getStepKeyword = step => {
    let line = readLine(step.uri, step.line - 1);
    return line.substring(0, line.indexOf('(')).trim();
  };

  const getStepID = step => {
    writeLine(step.uri, step.line - 2, `/* cornichon: ${new Date().getTime()}`);
  }

  return {
    getStepKeyword
  };
})();
