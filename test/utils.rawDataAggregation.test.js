import utils from '../src/services/utils.js'

const rawData = {
  '2021-05-25': {
    visits: [
      {
        browser: 'Chrome',
        browser_version: '1',
        platform: 'Android',
        value: '1'
      },
      {
        browser: 'Chrome',
        browser_version: '2',
        platform: 'Mac OS',
        value: '1'
      },
      {
        browser: 'Edge',
        browser_version: '1',
        platform: 'Android',
        value: '1'
      }
    ]
  },
  '2021-05-26': {
    visits: [
      {
        browser: 'Chrome',
        browser_version: '1',
        platform: 'Mac OS',
        value: '1'
      }
    ]
  }
}

const rawDataAverage = {
  '2022-06-22': {
    responsetime: [
      {
        country: 'Belgium',
        region: 'Wallonia',
        value: '10',
        hits: '1'
      },
      {
        country: 'France',
        region: 'Auvergne-Rhone-Alpes',
        value: '10',
        hits: '2'
      }
    ]
  },
  '2022-06-23': {
    responsetime: [
      {
        country: 'Belgium',
        region: 'Wallonia',
        value: '20',
        hits: '2'
      }
    ]
  }
}

test('rawDataAggregation with one key column: average', () => {
  const columns = [
    {
      key: 'id',
      label: 'cdn_performance.id'
    },
    {
      key: 'country',
      label: 'cdn_performance.country'
    },
    {
      key: 'count',
      label: 'cdn_performance.count'
    }
  ]

  const aggregationType = { type: 'average', onColumn: 'value', byColumn: 'hits' }

  const expectedAggregatedDataPerKey = {
    Belgium: '10.00',
    France: '5.00'
  }

  const { aggregatedDataPerKey, sumValues, keyColumnsDisplay } = utils.rawDataAggregation(rawDataAverage, columns, aggregationType)
  expect(sumValues).toBe(null)
  expect(aggregatedDataPerKey).toEqual(expectedAggregatedDataPerKey)
  expect(keyColumnsDisplay).toEqual({
    Belgium: {
      country: 'Belgium'
    },
    France: {
      country: 'France'
    }
  })
})

test('rawDataAggregation with one key column', () => {
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

  const expectedSumValues = 4
  const expectedAggregatedDataPerKey = {
    Chrome: 3,
    Edge: 1
  }

  const { aggregatedDataPerKey, sumValues, keyColumnsDisplay } = utils.rawDataAggregation(rawData, columns)
  expect(sumValues).toBe(expectedSumValues)
  expect(aggregatedDataPerKey).toEqual(expectedAggregatedDataPerKey)
  expect(keyColumnsDisplay).toEqual({
    Chrome: {
      browser: 'Chrome'
    },
    Edge: {
      browser: 'Edge'
    }
  })
})

test('rawDataAggregation with 2 key columns', () => {
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
      key: 'count',
      label: 'browser.count'
    },
    {
      key: 'ratio',
      label: 'browser.ratio'
    }
  ]

  const expectedSumValues = 4

  const expectedAggregatedDataPerKey = {
    'Chrome - 1': 2,
    'Chrome - 2': 1,
    'Edge - 1': 1
  }

  const expectedKeyColumnsDisplay = {
    'Chrome - 1': { browser: 'Chrome', browser_version: '1' },
    'Chrome - 2': { browser: 'Chrome', browser_version: '2' },
    'Edge - 1': { browser: 'Edge', browser_version: '1' }
  }

  const { aggregatedDataPerKey, sumValues, keyColumnsDisplay } = utils.rawDataAggregation(rawData, columns)

  expect(sumValues).toBe(expectedSumValues)
  expect(aggregatedDataPerKey).toEqual(expectedAggregatedDataPerKey)
  expect(keyColumnsDisplay).toEqual(expectedKeyColumnsDisplay)
})

test('rawDataAggregation with 3 key columns', () => {
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

  const expectedSumValues = 4

  const expectedAggregatedDataPerKey = {
    'Chrome - 1 - Android': 1,
    'Chrome - 1 - Mac OS': 1,
    'Chrome - 2 - Mac OS': 1,
    'Edge - 1 - Android': 1
  }

  const expectedKeyColumnsDisplay = {
    'Chrome - 1 - Android': { browser: 'Chrome', browser_version: '1', platform: 'Android' },
    'Chrome - 1 - Mac OS': { browser: 'Chrome', browser_version: '1', platform: 'Mac OS' },
    'Chrome - 2 - Mac OS': { browser: 'Chrome', browser_version: '2', platform: 'Mac OS' },
    'Edge - 1 - Android': { browser: 'Edge', browser_version: '1', platform: 'Android' }
  }

  const { aggregatedDataPerKey, sumValues, keyColumnsDisplay } = utils.rawDataAggregation(rawData, columns)

  expect(sumValues).toBe(expectedSumValues)
  expect(aggregatedDataPerKey).toEqual(expectedAggregatedDataPerKey)
  expect(keyColumnsDisplay).toEqual(expectedKeyColumnsDisplay)
})

test('rawDataAggregation : empty raw data', () => {
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

  const expectedSumValues = 0
  const expectedAggregatedDataPerKey = {}
  const expectedKeyColumnsDisplay = {}

  const { aggregatedDataPerKey, sumValues, keyColumnsDisplay } = utils.rawDataAggregation({}, columns)

  expect(sumValues).toBe(expectedSumValues)
  expect(aggregatedDataPerKey).toEqual(expectedAggregatedDataPerKey)
  expect(keyColumnsDisplay).toEqual(expectedKeyColumnsDisplay)
})
