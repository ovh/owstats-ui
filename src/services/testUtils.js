import axios from 'axios'
import utils from './utils'

export default {
  testElementUpdate (wrapper, elementId, property, propsPrefix, updateNbRange) {
    const element = wrapper.find(elementId)
    expect(element.exists()).toBe(true)

    const expectedResultRange = []
    updateNbRange.forEach(e => expectedResultRange.push(propsPrefix + e))

    expect(expectedResultRange).toContain(element.props(property))
  },

  mockAxiosAndUtils () {
    jest.mock('axios')
    jest.mock('./utils')

    for (let i = 0; i < 100; i++) {
      axios.get.mockImplementationOnce(() => Promise.resolve({ data: { records: i } }))

      utils.computeSplineChartData.mockImplementationOnce((startDate, endDate, records) => {
        const chartData = [i]
        const axisData = [i]
        const granularity = 'hours'
        return { chartData, axisData, granularity }
      })
    }
  }
}
