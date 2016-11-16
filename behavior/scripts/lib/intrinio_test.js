// INIT_VERSION: 0.0.16

'use strict'

const intrinio = require('./intrinio.js')

function testIntrinioClient() {
  const iClient = intrinio.MakeClient('a', 'b')

  iClient.companyByTicker('AAPL', (result) => {
    // console.log('received company result from intrinio:', result)
  })

  iClient.dailyPricesByTicker('AAPL', 3, (result) => {
    console.log('received prices result from intrinio:', result)
  })

  iClient.getDatapoint('AAPL', 'totalrevenue', (result) => {
    console.log('received datapoint result from intrinio:', result)
  })

  iClient.getDatapoint('VZ', 'cashandequivalents', (result) => {
    console.log('received datapoint result from intrinio:', result)
  })
}

testIntrinioClient()
