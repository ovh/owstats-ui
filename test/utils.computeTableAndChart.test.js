import utils from '../src/services/utils.js'

test('computeTableAndChartData for simple chart and table', () => {
  const aggregatedData = {
    aggregatedDataPerKey: {
      Chrome: 20,
      Firefox: 10,
      Safari: 5
    },
    keyColumnsDisplay: {},
    sumValues: 35
  }

  const columns = [
    {
      key: 'id',
      label: 'browser.id'
    },
    {
      key: 'browser',
      label: 'browser.browser'
    },
    {
      key: 'count',
      label: 'browser.count'
    },
    {
      key: 'ratio',
      label: 'browser.ratio'
    }
  ]

  const expectedLabels = ['Chrome', 'Firefox', 'Safari']
  const expectedValues = [20, 10, 5]
  const expectedTableData = [
    {
      id: 1,
      browser: 'Chrome',
      count: '20',
      ratio: '57.1'
    },
    {
      id: 2,
      browser: 'Firefox',
      count: '10',
      ratio: '28.6'
    },
    {
      id: 3,
      browser: 'Safari',
      count: '5',
      ratio: '14.3'
    }
  ]

  const { labels, values, tableData } = utils.computeTableAndChartData(aggregatedData, columns, 3, true, 3)
  expect(labels).toEqual(expectedLabels)
  expect(values).toEqual(expectedValues)
  expect(tableData).toEqual(expectedTableData)
})

test('computeTableAndChartData for simple chart and table with more data than table and chart size', () => {
  const aggregatedData = {
    aggregatedDataPerKey: {
      Chrome: 20,
      Firefox: 10,
      Safari: 5,
      Edge: 3,
      'Internet Explorer': 2
    },
    keyColumnsDisplay: {},
    sumValues: 40
  }

  const columns = [
    {
      key: 'id',
      label: 'browser.id'
    },
    {
      key: 'browser',
      label: 'browser.browser'
    },
    {
      key: 'count',
      label: 'browser.count'
    },
    {
      key: 'ratio',
      label: 'browser.ratio'
    }
  ]

  const expectedLabels = ['Chrome', 'Firefox', 'Safari', 'Others']
  const expectedValues = [20, 10, 5, 5]
  const expectedTableData = [
    {
      id: 1,
      browser: 'Chrome',
      count: '20',
      ratio: '50.0'
    },
    {
      id: 2,
      browser: 'Firefox',
      count: '10',
      ratio: '25.0'
    },
    {
      id: 3,
      browser: 'Safari',
      count: '5',
      ratio: '12.5'
    }
  ]

  const { labels, values, tableData } = utils.computeTableAndChartData(aggregatedData, columns, 3, true, 3)
  expect(labels).toEqual(expectedLabels)
  expect(values).toEqual(expectedValues)
  expect(tableData).toEqual(expectedTableData)
})

test('computeTableAndChartData for table with more columns than key/count/ratio', () => {
  const aggregatedData = {
    aggregatedDataPerKey: {
      'Chrome - Windows - 10': 20,
      'Firefox - Windows - 10': 10,
      'Safari - Mac OS - 1': 5,
      'Edge - Mac OS - 1': 3,
      'Edge - Mac OS - 2': 2
    },
    keyColumnsDisplay: {
      'Firefox - Windows - 10': {
        browser: 'Firefox',
        platform: 'Windows',
        browser_version: '10'
      },
      'Chrome - Windows - 10': {
        browser: 'Chrome',
        platform: 'Windows',
        browser_version: '10'
      },
      'Safari - Mac OS - 1': {
        browser: 'Safari',
        platform: 'Mac OS',
        browser_version: '1'
      },
      'Edge - Mac OS - 1': {
        browser: 'Edge',
        platform: 'Mac OS',
        browser_version: '1'
      },
      'Edge - Mac OS - 2': {
        browser: 'Edge',
        platform: 'Mac OS',
        browser_version: '2'
      }
    },
    sumValues: 40
  }

  const columns = [
    {
      key: 'id',
      label: 'browser.id'
    },
    {
      key: 'browser',
      label: 'browser.browser'
    },
    {
      key: 'browser_version',
      label: 'browser.browser_version'
    },
    {
      key: 'platform',
      label: 'browser.platform'
    },
    {
      key: 'count',
      label: 'browser.count'
    },
    {
      key: 'ratio',
      label: 'browser.ratio'
    }
  ]

  const expectedTableData = [
    {
      id: 1,
      browser: 'Chrome',
      browser_version: '10',
      platform: 'Windows',
      count: '20',
      ratio: '50.0'
    },
    {
      id: 2,
      browser: 'Firefox',
      browser_version: '10',
      platform: 'Windows',
      count: '10',
      ratio: '25.0'
    },
    {
      id: 3,
      browser: 'Safari',
      browser_version: '1',
      platform: 'Mac OS',
      count: '5',
      ratio: '12.5'
    },
    {
      id: 4,
      browser: 'Edge',
      browser_version: '1',
      platform: 'Mac OS',
      count: '3',
      ratio: '7.5'
    },
    {
      id: 5,
      browser: 'Edge',
      browser_version: '2',
      platform: 'Mac OS',
      count: '2',
      ratio: '5.0'
    }
  ]

  const tableDataThreeRows = utils.computeTableAndChartData(aggregatedData, columns, 3, false)
  const tableDataFiveRows = utils.computeTableAndChartData(aggregatedData, columns, 5, false)
  const tableDataTenRows = utils.computeTableAndChartData(aggregatedData, columns, 10, false)

  expect(tableDataThreeRows).toEqual(expectedTableData.slice(0, 3))
  expect(tableDataFiveRows).toEqual(expectedTableData)
  expect(tableDataTenRows).toEqual(expectedTableData)
})

test('computeTableAndChartData for empty table', () => {
  const aggregatedData = {
    aggregatedDataPerKey: {
    },
    keyColumnsDisplay: {
    },
    sumValues: 0
  }

  const columns = [
    {
      key: 'id',
      label: 'browser.id'
    },
    {
      key: 'browser',
      label: 'browser.browser'
    },
    {
      key: 'count',
      label: 'browser.count'
    },
    {
      key: 'ratio',
      label: 'browser.ratio'
    }
  ]

  const tableData = utils.computeTableAndChartData(aggregatedData, columns, 3, false)
  const chartAndTableData = utils.computeTableAndChartData(aggregatedData, columns, 3, true, 3)

  expect(tableData).toEqual([])
  expect(chartAndTableData).toEqual({ labels: [], values: [], tableData: [] })
})
