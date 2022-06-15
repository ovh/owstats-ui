import moment from 'moment-timezone'
import Cookies from 'js-cookie'

export default {

  // reverse an object of the form { key: value } (ex : { Chrome: 10, Firefox: 10, Opera: 30 })
  // result is the reverse object (data) and its ordered keys (keys)
  // ex of result : { keys:[30, 10],  data: { 10: [Chrome, Firefox], 30: [Opera] } }
  reversePerKeyObject (perKey) {
    const data = {}

    for (const key in perKey) {
      const v = perKey[key]
      if (v in data) {
        data[v].push(key)
      } else {
        data[v] = [key]
      }
    }

    const keys = Object.keys(data)

    keys.sort(function (a, b) { return a - b })
    keys.reverse()

    return { keys, data }
  },

  // return the type of data sent by Api (example: "visits" for v1/initial_path/visits endpoint )
  apiResponseDataType (response) {
    let responseType = ''

    if (Object.keys(response).length > 0) {
      const firstDate = Object.keys(response)[0]
      const key = Object.keys(response[firstDate])[0]
      responseType = key
    }
    return responseType
  },

  // from a list of columns, return the set of columns which will be the key data will be aggregated on
  // standard columns are id, total, ratio, key columns are the other columns
  // if only one column is returned it will be the key (example: Browser)
  computeKeyColumns (columns) {
    const regularColumns = ['id', 'count', 'ratio']
    const keyColumns = []

    const columnsNames = []
    columns.forEach(c => columnsNames.push(c.key))

    columnsNames.forEach(k => {
      if (!regularColumns.includes(k)) {
        keyColumns.push(k)
      }
    })

    return keyColumns
  },

  // replace value for elements of raw data (ex : NT --> Microsoft Windows)
  // columnName : String, name of the column for which values will be renamed
  // record : Object, record for which value will be replaced
  // value : String, new value to be used
  dataValueReplacement (columnName, record) {
    let value = record[columnName]
    let version

    switch (columnName) {
      case 'platform':
        version = record.platform_version
        switch (value) {
          case 'NT':
            value = 'Microsoft Windows'
            break
          case 'X11':
            if (version.includes('Ubuntu')) {
              value = 'Ubuntu'
            } else if (version.includes('FreeBSD')) {
              value = 'FreeBSD'
            } else {
              value = 'Linux'
            }
            break
          case 'Linux':
            if (version.includes('Android')) {
              value = 'Android'
            }
            break
          case 'Macintosh':
            value = 'Mac OS'
            break
        }
        break
      case 'browser':
        if (value === 'MSIE') {
          value = 'Internet Explorer'
        }
        break
      case 'browser_version':
        version = parseFloat(value)
        if (version) {
          value = Math.floor(version).toString()
        }
        break
      case 'country':
        if (value === 'Russian Federation') {
          value = 'Russia'
        } else if (value === 'United States') {
          value = 'United States of America'
        }
        break
    }

    return value
  },

  // from API response, aggregate data for tables and charts display
  // rawData: Object, api response for which data will be aggregated
  // columns: Array, columns to be displayed in chart/table : aggregation key will be computed with these columns
  // aggregatedDataPerKey: Object, result of the aggregation, for example : { Safari: 10, Chrome : 15 }
  // sumValues : Int, total of the values of the aggregated data (ex : 25)
  // keyColumnsDisplay : if the key is composed of more than one column, object to display key in separated columns in table
  // ex of keyColumsDisplay: { "Android - Chrome - 34 : {"platform": "Android", "browser": "Chrome", "browser_version": "34"},  ...}
  rawDataAggregation (rawData, columns) {
    const keyColumnsDisplay = {}
    let sumValues = 0
    const aggregatedDataPerKey = {}

    const responseDataType = this.apiResponseDataType(rawData)
    const keyColumns = this.computeKeyColumns(columns)

    for (const date in rawData) {
      for (const i in rawData[date][responseDataType]) {
        const record = rawData[date][responseDataType][i]
        const intValue = parseInt(record.value)
        let aggregationKey = ''

        // code specific for tables which are more complex than key/total/ratio
        if (keyColumns.length > 1) {
          for (const j in keyColumns) {
            const columnName = keyColumns[j]
            const columnValue = this.dataValueReplacement(columnName, record)

            let base = {}
            if (aggregationKey !== '') {
              base = keyColumnsDisplay[aggregationKey]
              aggregationKey = aggregationKey.concat(' - ')
            }
            aggregationKey = aggregationKey.concat(columnValue)
            keyColumnsDisplay[aggregationKey] = base
            keyColumnsDisplay[aggregationKey][columnName] = columnValue
          }
          // code specific for simple table (key/total/ratio)
        } else {
          const keyColumn = keyColumns[0]
          aggregationKey = this.dataValueReplacement(keyColumn, record)
        }

        if (aggregationKey in aggregatedDataPerKey) {
          aggregatedDataPerKey[aggregationKey] += intValue
        } else {
          aggregatedDataPerKey[aggregationKey] = intValue
        }
        sumValues += intValue
      }
    }
    return { aggregatedDataPerKey, sumValues, keyColumnsDisplay }
  },

  // from aggregated data, format data for chart and table display
  // aggregatedData : Object, result of rawDataAggregation functionÒ
  // columns: Array, columns to be displayed in chart/table : aggregation key will be computed with these columns
  // tableSize: Int, max number of rows to be displayed in the table
  // hasChart: boolean, true if chart data is computed (if component displays a chart)
  // chartSize: Int, max number of keys to be displayed in the pie chart (other keys are aggregated in "other" section)
  // tableData: Array, each element is an object representation of a row to be displayed in the table component
  // labels: Array, each element is a string with the label to be displayed in pie chart component. Computed only if hasChart is true
  // values: Array, each element is a number with the value to be displayed in pie chart component. Computed only if hasChart is true
  computeTableAndChartData (aggregatedData, columns, tableSize, hasChart, chartSize) {
    const { aggregatedDataPerKey, sumValues, keyColumnsDisplay } = aggregatedData
    const { keys, data } = this.reversePerKeyObject(aggregatedDataPerKey)
    const keyColumns = this.computeKeyColumns(columns)

    let others = sumValues
    let count = 0
    let ratio = 0

    const values = []
    const labels = []
    const tableData = []

    for (const i in keys) {
      const key = keys[i]
      const entries = data[key]
      for (const j in entries) {
        const entry = entries[j]
        count += 1
        ratio = (key * 100) / sumValues
        if (hasChart && count <= chartSize) {
          labels.push(entry)
          values.push(parseInt(key))
          others -= key
        }
        const table = {
          id: count,
          count: key,
          ratio: `${ratio.toFixed(1)}`
        }
        if (keyColumnsDisplay && Object.keys(keyColumnsDisplay).length > 1) {
          keyColumns.forEach((e) => {
            table[e] = keyColumnsDisplay[entry][e]
          })
        } else {
          table[keyColumns[0]] = entry
        }

        tableData.push(table)
        if (count >= tableSize) {
          break
        }
      }

      if (count >= tableSize) {
        break
      }
    }

    if (hasChart && others) {
      labels.push('Others')
      values.push(others)
    }

    if (hasChart) {
      return { labels, values, tableData }
    } else {
      return tableData
    }
  },

  // set moment to UTC by default and standardize date formats
  initializeMoment () {
    moment.tz.setDefault('UTC')
    const dayFormat = 'YYYY-MM-DD'
    const weekFormat = 'GGGG-[W]WW' /* Use ISO year GGGG with ISO week WW */
    const monthFormat = 'YYYY-MM'
    const yearFormat = 'YYYY'
    const timeFormat = 'YYYY-MM-DDTHH:mm:ss[Z]'

    return { dayFormat, weekFormat, monthFormat, yearFormat, timeFormat }
  },

  // from start and end date, choose to display in hours, days... intervals
  computeGranularity (start, end) {
    let granularity = 'hours'

    const diff = end.diff(start, 'days')
    if (diff >= 365) {
      granularity = 'months'
    } else if (diff >= 180) {
      granularity = 'weeks'
    } else if (diff >= 30) {
      granularity = 'days'
    }
    return granularity
  },

  computeChartYValue (records, period, type, time, filterParameter) {
    let y = 0
    const r = records[period][type]
    let record

    if (filterParameter) {
      record = r.find(e => (e.time === time && e[filterParameter.key] === filterParameter.value))
    } else {
      record = r.find(e => e.time === time)
    }
    if (record) y = parseInt(record.value)

    return y
  },

  // compute x and y data for spline chart
  // startDate: string, beginning of x axis
  // endDate: String, end of x axis
  // records: Object, raw data to be displayed in the chart
  // filterParameter: optional, Object of format {key:param, value:hits} : filter only records with param equal to hits
  // chartData: Object, data to be displayed in the chart
  // axisData: Array, points of the x axis
  // granularity: string, represents the interval between 2 points of the x axis (hours, days...)
  computeSplineChartData (startDate, endDate, records, filterParameter) {
    moment.tz.setDefault('UTC')
    const { dayFormat, weekFormat, monthFormat, yearFormat, timeFormat } = this.initializeMoment()
    const type = this.apiResponseDataType(records)
    const axisData = []
    const chartData = []
    const stats = {}
    const start = startDate
    const end = endDate
    let period = 'hours'

    const granularity = this.computeGranularity(startDate, moment(end))

    for (let m = moment(start); m.diff(end, 'days') <= 0; m.add(1, period)) {
      const day = m.format(dayFormat)
      const week = m.format(weekFormat)
      const month = m.format(monthFormat)
      const year = m.format(yearFormat)
      const time = m.format(timeFormat)

      let x = time
      let y = 0

      if (granularity === 'days') {
        x = m.format('DD/MM/YYYY')
        x = moment(x, 'DD/MM/YYYY').tz('UTC').format('MM/DD/YYYY')
      } else if (granularity === 'weeks') {
        x = m.format(weekFormat)
        x = moment(x, weekFormat).tz('UTC').format('MM/DD/YYYY')
      } else if (granularity === 'months') {
        x = m.format(monthFormat)
        x = moment(x, monthFormat).tz('UTC').format('MM/DD/YYYY')
      } else {
        x = m.format('DD/MM/YY HH[h]')
        x = moment(x, 'DD/MM/YY HH[h]').tz('UTC').toDate()
      }

      if (day in records) {
        y = this.computeChartYValue(records, day, type, time, filterParameter)
      } else if (week in records) {
        period = 'hours'
        y = this.computeChartYValue(records, week, type, time, filterParameter)
      } else if (month in records) {
        period = 'days'
        y = this.computeChartYValue(records, month, type, time, filterParameter)
      } else if (year in records) {
        period = 'days'
        y = this.computeChartYValue(records, year, type, time, filterParameter)
      }
      stats[x] || (stats[x] = 0)
      stats[x] += y
    }
    Object.keys(stats).forEach(x => {
      axisData.push(x)
      chartData.push(stats[x])
    })

    return { chartData, axisData, granularity }
  },

  // compute average session time over a period of time
  // avgSessionTime : object, result of hour/avgsessiontime api call
  // visits: object, result of hour/visits api call
  // startDate: string, beginning of time period
  // endDate: String, end of time period
  // avgSessionTimeString: string, result of computation in string format (ex: 5mn 30sec)
  computeAvgSessionTime (avgSessionTime, visits, startDate, endDate) {
    const { dayFormat, weekFormat, monthFormat, yearFormat, timeFormat } = this.initializeMoment()

    let period = 'hours'
    const start = startDate
    const end = endDate

    const visitsAndTotalTime = {
      visits: 0,
      totalTime: 0
    }

    for (let m = moment(start); m.diff(end, 'days') <= 0; m.add(1, period)) {
      const day = m.format(dayFormat)
      const week = m.format(weekFormat)
      const month = m.format(monthFormat)
      const year = m.format(yearFormat)
      const time = m.format(timeFormat)

      if (day in avgSessionTime) {
        period = 'hours'
        this.updateVisistsAndTotalTime(avgSessionTime, visits, day, time, visitsAndTotalTime)
      } else if (week in avgSessionTime) {
        period = 'hours'
        this.updateVisistsAndTotalTime(avgSessionTime, visits, week, time, visitsAndTotalTime)
      } else if (month in avgSessionTime) {
        period = 'days'
        this.updateVisistsAndTotalTime(avgSessionTime, visits, month, time, visitsAndTotalTime)
      } else if (year in avgSessionTime) {
        period = 'days'
        this.updateVisistsAndTotalTime(avgSessionTime, visits, year, time, visitsAndTotalTime)
      }
    }

    let avgSessionTimeResult = Math.round(visitsAndTotalTime.totalTime / visitsAndTotalTime.visits)
    if (Number.isNaN(avgSessionTimeResult)) {
      avgSessionTimeResult = 0
    }
    if (avgSessionTimeResult > 60) {
      const durationValue = moment.duration(avgSessionTimeResult, 'seconds')
      const minutes = Math.floor(durationValue.asMinutes())
      const seconds = Math.floor(durationValue.asSeconds() - minutes * 60)
      const avgSessionTimeString = minutes + 'min ' + seconds + 'sec'
      return avgSessionTimeString
    } else {
      const avgSessionTimeString = avgSessionTimeResult + 'sec'
      return avgSessionTimeString
    }
  },

  // function to update visitsAndTotalTime during computeAvgSessionTime
  // avgSessionTime : object, result of hour/avgsessiontime api call
  // visits: object, result of hour/visits api call
  // period: either a day (ex: 2021-01-01), a week (2021-W1), a month (2021-01) or a year (2021)
  // time: time of the for loop in computeAvgSessionTime (ex: 2021-01-01T01:00:00Z)
  // visitsAndTotalTime: object to update with new values ( ex: {visits: 12, totalTime: 150} )
  updateVisistsAndTotalTime (avgSessionTime, visits, period, time, visitsAndTotalTime) {
    let avgSessionTimeValue
    let visitsValue

    const objectAvgSessionTime = avgSessionTime[period].avgsessiontime
    const recordAvgSessionTime = objectAvgSessionTime.find(elem => elem.time === time)
    if (recordAvgSessionTime) avgSessionTimeValue = parseInt(recordAvgSessionTime.value)

    const objectVisits = visits[period].visits
    const recordVisits = objectVisits.find(elem => elem.time === time)
    if (recordVisits) visitsValue = parseInt(recordVisits.value)

    if (visitsValue != null && avgSessionTimeValue != null) {
      visitsAndTotalTime.visits += visitsValue
      visitsAndTotalTime.totalTime += visitsValue * avgSessionTimeValue
    }
  },

  formatBytes (bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  },

  // functions to handle token in development mode and external users analytics service: does not impact OVH prod
  getTokenFromCookie () {
    return Cookies.get('owsToken')
  },

  removeTokenFromCookie () {
    Cookies.remove('owsToken')
  },

  setTokenInCookie (token, expiration) {
    Cookies.set('owsToken', token, {
      expires: expiration
    })
  },

  async generateToken () {
    const ovh = require('ovh')({
      endpoint: process.env.VUE_APP_ENDPOINT,
      appKey: process.env.VUE_APP_KEY,
      appSecret: process.env.VUE_APP_SECRET,
      consumerKey: process.env.VUE_APP_CONSUMER_KEY
    })

    const hosting = process.env.VUE_APP_HOSTING

    try {
      const token = await ovh.requestPromised('GET', `/hosting/web/${hosting}/userLogsToken`)
      return token
    } catch (e) {
      console.log(e)
    }
  }

}
