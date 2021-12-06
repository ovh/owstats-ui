import utils from '../src/services/utils.js'

test('computeSplineChartData with different granularities', () => {
  const records = {
    '2021-05-25': {
      visits: [
        {
          time: '2021-05-25T00:00:00Z',
          value: '10'
        },
        {
          time: '2021-05-25T01:00:00Z',
          value: '5'
        }
      ]
    },
    '2021-05-26': {
      visits: [
        {
          time: '2021-05-26T00:00:00Z',
          value: '1'
        },
        {
          time: '2021-05-26T01:00:00Z',
          value: '2'
        }
      ]
    }
  }

  const startDateHours = '2021-05-25'
  const endDateHours = '2021-05-26'

  const startDateDays = '2021-05-01'
  const endDateDays = '2021-05-31'

  const startDateWeeks = '2021-01-01'
  const endDateWeeks = '2021-07-31'

  const startDateMonths = '2020-05-01'
  const endDateMonths = '2021-05-31'

  const expectedChartDataHours = [
    10, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0
  ]

  const expectedChartDataDays = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 15, 3, 0, 0, 0, 0, 0]

  const expectedChartDataWeeks = new Array(31).fill(0)
  expectedChartDataWeeks[21] = 18

  const expectedChartDataMonths = new Array(12).fill(0)
  expectedChartDataMonths[12] = 18

  const resultHours = utils.computeSplineChartData(startDateHours, endDateHours, records)
  expect(resultHours.granularity).toEqual('hours')
  expect(resultHours.chartData).toEqual(expectedChartDataHours)

  const resultDays = utils.computeSplineChartData(startDateDays, endDateDays, records)
  expect(resultDays.granularity).toEqual('days')
  expect(resultDays.chartData).toEqual(expectedChartDataDays)

  const resultWeeks = utils.computeSplineChartData(startDateWeeks, endDateWeeks, records)
  expect(resultWeeks.granularity).toEqual('weeks')
  expect(resultWeeks.chartData).toEqual(expectedChartDataWeeks)

  const resultMonths = utils.computeSplineChartData(startDateMonths, endDateMonths, records)
  expect(resultMonths.granularity).toEqual('months')
  expect(resultMonths.chartData).toEqual(expectedChartDataMonths)
})

test('computeSplineChartData with different aggregation: year, month, week, day', () => {
  const records = {
    2020: {
      visits: [
        {
          time: '2020-12-30T00:00:00Z',
          value: '10'
        },
        {
          time: '2020-12-31T00:00:00Z',
          value: '5'
        }
      ]
    },
    '2021-01': {
      visits: [
        {
          time: '2021-01-01T00:00:00Z',
          value: '1'
        },
        {
          time: '2021-01-02T00:00:00Z',
          value: '2'
        }
      ]
    },
    '2021-W05': {
      visits: [
        {
          time: '2021-02-01T00:00:00Z',
          value: '5'
        },
        {
          time: '2021-02-01T01:00:00Z',
          value: '3'
        }
      ]
    },
    '2021-02-07': {
      visits: [
        {
          time: '2021-02-07T00:00:00Z',
          value: '7'
        },
        {
          time: '2021-02-07T01:00:00Z',
          value: '6'
        }
      ]
    }
  }

  const startDate = '2020-12-30'
  const endDate = '2021-02-08'

  const expectedChartData = [
    10, 5, 1, 2, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 8, 0, 0, 0, 0, 0, 13,
    0
  ]

  const result = utils.computeSplineChartData(startDate, endDate, records)
  expect(result.granularity).toEqual('days')
  expect(result.chartData).toEqual(expectedChartData)
})

test('computeSplineChartData : empty data', () => {
  const records = { }

  const startDate = '2021-05-25'
  const endDate = '2021-05-26'

  const expectedChartData = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0
  ]

  const result = utils.computeSplineChartData(startDate, endDate, records)
  expect(result.granularity).toEqual('hours')
  expect(result.chartData).toEqual(expectedChartData)
})
