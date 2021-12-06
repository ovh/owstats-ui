import utils from '../src/services/utils.js'
import moment from 'moment-timezone'

// reversePerKeyObject tests
test('reverse standard object', () => {
  const perKey = {
    Chrome: 10,
    Firefox: 10,
    Opera: 30
  }

  const expectedKeys = ['30', '10']
  const expectedData = {
    10: ['Chrome', 'Firefox'],
    30: ['Opera']
  }

  const { keys, data } = utils.reversePerKeyObject(perKey)
  expect(keys).toEqual(expectedKeys)
  expect(data).toEqual(expectedData)
})

// apiResponseDataType tests
test('extract API response data type info from normal data', () => {
  const apiResponse = {
    '2021-05-17': {
      visits: [{ key: 1, value: 10 }, { key: 2, value: 20 }]
    },
    '2021-05-18': {
      visits: [{ key: 1, value: 10 }, { key: 2, value: 20 }]
    }
  }

  expect(utils.apiResponseDataType(apiResponse)).toBe('visits')
})

test('extract API response data type info from empty data', () => {
  expect(utils.apiResponseDataType({})).toBe('')
})

// computeKeyColumns tests
test('computeKeyColumns with no additional columns', () => {
  const columns = [
    {
      key: 'id',
      label: 'request.id'
    },
    {
      key: 'count',
      label: 'request.validhits'
    },
    {
      key: 'ratio',
      label: 'request.ratio'
    }
  ]

  expect(utils.computeKeyColumns(columns)).toEqual([])
})

test('computeKeyColumns with one additional columns', () => {
  const columns = [
    {
      key: 'id',
      label: 'request.id'
    },
    {
      key: 'request_origfilepath',
      label: 'request.origfilepath'
    },
    {
      key: 'count',
      label: 'request.validhits'
    },
    {
      key: 'ratio',
      label: 'request.ratio'
    }
  ]

  expect(utils.computeKeyColumns(columns)).toEqual(['request_origfilepath'])
})

test('computeKeyColumns with 2 additional columns', () => {
  const columns = [
    {
      key: 'id',
      label: 'request.id'
    },
    {
      key: 'page_1',
      label: 'request.page_1'
    },
    {
      key: 'page_2',
      label: 'request.page_2'
    },
    {
      key: 'page_3',
      label: 'request.page_3'
    },
    {
      key: 'count',
      label: 'request.visits'
    },
    {
      key: 'ratio',
      label: 'request.ratio'
    }
  ]

  expect(utils.computeKeyColumns(columns)).toEqual(['page_1', 'page_2', 'page_3'])
})

// test dataValueReplacement
test('dataValueReplacement of platform values', () => {
  const recordWithNT = {
    platform: 'NT',
    platform_version: '6.1',
    value: '9'
  }

  const recordWithUbuntu = {
    platform: 'X11',
    platform_version: 'Ubuntu',
    value: '9'
  }

  const recordWithFreeBSD = {
    platform: 'X11',
    platform_version: 'FreeBSD',
    value: '9'
  }

  const recordWithX11 = {
    platform: 'X11',
    platform_version: 'Other',
    value: '9'
  }

  const recordWithLinux = {
    platform: 'Linux',
    platform_version: 'Android',
    value: '9'
  }

  const recordWithMacintosh = {
    platform: 'Macintosh',
    platform_version: 'Unknown',
    value: '9'
  }

  const recordWithOtherPlatform = {
    platform: 'Other',
    platform_version: 'Unknown',
    value: '9'
  }

  expect(utils.dataValueReplacement('platform', recordWithNT)).toEqual('Microsoft Windows')
  expect(utils.dataValueReplacement('platform', recordWithUbuntu)).toEqual('Ubuntu')
  expect(utils.dataValueReplacement('platform', recordWithFreeBSD)).toEqual('FreeBSD')
  expect(utils.dataValueReplacement('platform', recordWithX11)).toEqual('Linux')
  expect(utils.dataValueReplacement('platform', recordWithLinux)).toEqual('Android')
  expect(utils.dataValueReplacement('platform', recordWithMacintosh)).toEqual('Mac OS')
  expect(utils.dataValueReplacement('platform', recordWithOtherPlatform)).toEqual('Other')
})

test('dataValueReplacement of browser, browser version and country values', () => {
  const recordWithMSIE = {
    browser: 'MSIE',
    browser_version: '6.1',
    value: '9'
  }

  const recordWithOtherBrowser = {
    browser: 'Google Chrome',
    browser_version: '12',
    value: '9'
  }

  const recordWithFloatBrowserVersion = {
    browser: 'Google Chrome',
    browser_version: '12.1',
    value: '9'
  }

  const recordWithOtherBrowserVersion = {
    browser: 'Google Chrome',
    browser_version: 'Unknown',
    value: '9'
  }

  const recordWithRussia = {
    platform: 'X11',
    platform_version: 'FreeBSD',
    country: 'Russian Federation',
    value: '9'
  }

  const recordWithUSA = {
    platform: 'X11',
    platform_version: 'FreeBSD',
    country: 'United States',
    value: '9'
  }

  const recordWithOtherCountry = {
    platform: 'X11',
    platform_version: 'FreeBSD',
    country: 'France',
    value: '9'
  }

  expect(utils.dataValueReplacement('browser', recordWithMSIE)).toEqual('Internet Explorer')
  expect(utils.dataValueReplacement('browser', recordWithOtherBrowser)).toEqual('Google Chrome')
  expect(utils.dataValueReplacement('browser_version', recordWithFloatBrowserVersion)).toEqual('12')
  expect(utils.dataValueReplacement('browser_version', recordWithOtherBrowserVersion)).toEqual('Unknown')
  expect(utils.dataValueReplacement('country', recordWithRussia)).toEqual('Russia')
  expect(utils.dataValueReplacement('country', recordWithUSA)).toEqual('United States of America')
  expect(utils.dataValueReplacement('country', recordWithOtherCountry)).toEqual('France')
})

// test computeGranularity
test('computeGranularity', () => {
  moment.tz.setDefault('UTC')
  expect(utils.computeGranularity('2021-05-25', moment('2021-05-26'))).toEqual('hours')
  expect(utils.computeGranularity('2021-01-31', moment('2021-03-31'))).toEqual('days')
  expect(utils.computeGranularity('2021-01-31', moment('2021-08-31'))).toEqual('weeks')
  expect(utils.computeGranularity('2019-05-25', moment('2021-05-26'))).toEqual('months')
})
