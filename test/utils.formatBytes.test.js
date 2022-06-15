import utils from '../src/services/utils.js'

test('test bytes conversion', () => {
  expect(utils.formatBytes(10)).toEqual('10 Bytes')
  expect(utils.formatBytes(1024)).toEqual('1 KB')
  expect(utils.formatBytes(2000000)).toEqual('1.91 MB')
})
