/**
 * Created by Scott Haley on 3/24/2017.
 */

const fs = require('fs')
const Guid = require('guid')

module.exports = (() => {
  const readLine = (uri, line) => {
    let lines = fs.readFileSync(uri, 'utf8').split('\n')

    if (line > lines.length) {
      throw new Error('File end reached without finding line')
    }

    return lines[line]
  }

  const writeLine = (uri, line, text) => {
    let lines = fs.readFileSync(uri, 'utf8').split(/\r?\n/)
    lines[line] = lines[line] + text
    let data = lines.join('\n')
    fs.writeFileSync(uri, data)
  }

  const getStepKeyword = step => {
    let line = readLine(step.uri, step.line - 1)
    return line.substring(0, line.indexOf('(')).trim()
  }

  const getTable = scenario => {
    let table = {}
    let cLine = scenario.line - 2
    let lineText = ''
    let columnNames = []
    let headerLine = 0
    while (lineText !== null && lineText.indexOf('Examples:') === -1) {
      columnNames = lineText.split('|').reduce((result, item) => {
        let header = item.trim()
        if (header !== '') {
          result.push(header)
        }
        return result
      }, [])
      headerLine = cLine
      lineText = readLine(scenario.uri_full, cLine)
      cLine--
    }

    for (let c in columnNames) {
      table[columnNames[c]] = []
    }

    cLine = headerLine + 2
    lineText = readLine(scenario.uri_full, cLine++)
    while (lineText !== null && lineText.match(/\|.*\|/)) {
      let rowData = lineText.split('|').reduce((result, item) => {
        let dataItem = item.trim()
        if (dataItem !== '') {
          result.push(dataItem)
        }
        return result
      }, [])
      for (let c in columnNames) {
        table[columnNames[c]].push(rowData[c])
      }
      lineText = readLine(scenario.uri_full, cLine++)
    }
    return table
  }

  const fixScenarioOutline = (scenario, table) => {
    for (let s in scenario.steps) {
      let step = scenario.steps[s]
      let line = readLine(scenario.uri_full, step.line - 1)
      for (let column in table) {
        if (line.indexOf(`<${column}>`) !== -1) {
          let newName = line.replace(step.keyword, '').trim()
          step.name = newName
        }
      }
    }
  }

  const getStepID = step => {
    let matches = step.code.match(/{cornichon: .*\w}/)
    if (matches) {
      return matches[0].match(/([0-9,a-z,A-Z]+-)+[0-9,a-z,A-Z]+/)[0]
    }
    var guid = Guid.create()
    let ID = guid
    writeLine(step.uri_full, step.line - 1, ` /* {cornichon: ${ID}} */`)
    return ID
  }

  return {
    getStepKeyword,
    getStepID,
    getTable,
    fixScenarioOutline
  }
})()
