import utils from '../src/services/utils.js'

test('compute avg session time: simple case', () => {
  const rawDataAvgSessionTime = {
    '2021-05-25': {
      avgsessiontime: [
        {
          time: '2021-05-25T14:00:00Z',
          value: '20'
        }]
    },
    '2021-05-26': {
      avgsessiontime: [
        {
          time: '2021-05-26T10:00:00Z',
          value: '10'
        },
        {
          time: '2021-05-26T11:00:00Z',
          value: '50'
        }
      ]
    }
  }

  const rawDataVisits = {
    '2021-05-25': {
      visits: [
        {
          time: '2021-05-25T14:00:00Z',
          value: '1'
        }]
    },
    '2021-05-26': {
      visits: [
        {
          time: '2021-05-26T10:00:00Z',
          value: '3'
        },
        {
          time: '2021-05-26T11:00:00Z',
          value: '1'
        }
      ]
    }
  }

  const avgSessionTimeResult = utils.computeAvgSessionTime(rawDataAvgSessionTime, rawDataVisits, '2021-05-25', '2021-05-26')
  expect(avgSessionTimeResult).toEqual('20sec')
})

test('compute avg session time: missing session time', () => {
  const rawDataAvgSessionTime = {
    '2021-05-25': {
      avgsessiontime: [
        {
          time: '2021-05-25T14:00:00Z',
          value: '10'
        }]
    },
    '2021-05-26': {
      avgsessiontime: [
        {
          time: '2021-05-26T10:00:00Z',
          value: '10'
        }
      ]
    }
  }

  const rawDataVisits = {
    '2021-05-25': {
      visits: [
        {
          time: '2021-05-25T14:00:00Z',
          value: '1'
        }]
    },
    '2021-05-26': {
      visits: [
        {
          time: '2021-05-26T10:00:00Z',
          value: '4'
        },
        {
          time: '2021-05-26T11:00:00Z',
          value: '1'
        }
      ]
    }
  }

  const avgSessionTimeResult = utils.computeAvgSessionTime(rawDataAvgSessionTime, rawDataVisits, '2021-05-25', '2021-05-26')

  expect(avgSessionTimeResult).toEqual('10sec')
})

test('compute avg session time: several granularities', () => {
  const rawDataAvgSessionTime = {
    2020: {
      avgsessiontime: [
        {
          time: '2020-05-25T00:00:00Z',
          value: '100'
        },
        {
          time: '2020-05-26T00:00:00Z',
          value: '300'
        }
      ]
    },
    '2021-01': {
      avgsessiontime: [
        {
          time: '2021-01-25T00:00:00Z',
          value: '500'
        }
      ]
    },
    '2021-W05': {
      avgsessiontime: [
        {
          time: '2021-02-01T00:00:00Z',
          value: '300'
        },
        {
          time: '2021-02-01T01:00:00Z',
          value: '300'
        }
      ]
    },
    '2021-05-26': {
      avgsessiontime: [
        {
          time: '2021-05-26T10:00:00Z',
          value: '40'
        }
      ]
    }
  }

  const rawDataVisits = {
    2020: {
      visits: [
        {
          time: '2020-05-25T00:00:00Z',
          value: '1'
        },
        {
          time: '2020-05-26T00:00:00Z',
          value: '3'
        }
      ]
    },
    '2021-01': {
      visits: [
        {
          time: '2021-01-25T00:00:00Z',
          value: '7'
        }
      ]
    },
    '2021-W05': {
      visits: [
        {
          time: '2021-02-01T00:00:00Z',
          value: '1'
        },
        {
          time: '2021-02-01T01:00:00Z',
          value: '2'
        }
      ]
    },
    '2021-05-26': {
      visits: [
        {
          time: '2021-05-26T10:00:00Z',
          value: '6'
        }
      ]
    }
  }

  const avgSessionTimeResult = utils.computeAvgSessionTime(rawDataAvgSessionTime, rawDataVisits, '2020-01-01', '2021-12-01')
  expect(avgSessionTimeResult).toEqual('4min 42sec')
})

test('compute avg session time: one avg session time is at 0', () => {
  const rawDataAvgSessionTime = {
    '2021-05-25': {
      avgsessiontime: [
        {
          time: '2021-05-25T14:00:00Z',
          value: '0'
        }]
    },
    '2021-05-26': {
      avgsessiontime: [
        {
          time: '2021-05-26T10:00:00Z',
          value: '10'
        },
        {
          time: '2021-05-26T11:00:00Z',
          value: '50'
        }
      ]
    }
  }

  const rawDataVisits = {
    '2021-05-25': {
      visits: [
        {
          time: '2021-05-25T14:00:00Z',
          value: '1'
        }]
    },
    '2021-05-26': {
      visits: [
        {
          time: '2021-05-26T10:00:00Z',
          value: '3'
        },
        {
          time: '2021-05-26T11:00:00Z',
          value: '1'
        }
      ]
    }
  }

  const avgSessionTimeResult = utils.computeAvgSessionTime(rawDataAvgSessionTime, rawDataVisits, '2021-05-25', '2021-05-26')
  expect(avgSessionTimeResult).toEqual('16sec')
})
