'use strict'

const moment = require('moment')
const numeral = require('numeral')

module.exports = (client, sharedState) => {
  return client.createStep({
    satisfied() {
      return false
    },

    extractInfo() {
      const priceTime = sharedState.firstOfEntityRole(client.getMessagePart(), 'time/price_time')


      if (priceTime && priceTime.parsed) {
        client.updateConversationState({
          requestedPriceTime: priceTime,
        })
      }
    },


    next: function next() {
      return undefined
    },

    prompt(callback) {

      const confirmedTickerString = client.getConversationState().confirmedTickerString

      const nameOrTicker = client.getConversationState().requestedCompanyName || client.getConversationState().requestedTicker

      const displayResult = (result) => {

        client.addTextResponse(`Some info: ${result.short_description}`)
        client.done()
        callback()
      }

      let priceTime
      const today = moment().utc()
      let isToday = false
      let isFuture = false
      if (client.getMessagePart().classification.sub_type.value === 'current') {
      } else {
        let requestedPriceTime = client.getConversationState().requestedPriceTime
        if (requestedPriceTime) {
          priceTime = sharedState.tryParseFirstTime(requestedPriceTime)
          if (!priceTime) {
            // Could not parse time
            client.addTextResponse('What date do you want the price for?')
            callback()
          } else {
            if (priceTime.isSame(today, 'day')) {
              // Is today
              isToday = true
            } else if (priceTime.isAfter(today, 'day')) {
              isFuture = true
              client.addTextResponse('Please provide a calendar date, in the past, to clarify when you mean')
              callback()
              client.done()
            }
          }
        }
      }

      let returnPrice = function returnPrice(dayPriceResult) {

        let responseType = 'app:response:name:provide_price/most_recent'
        let priceData = null


        switch (client.getMessagePart().classification.sub_type.value) {
          case 'request_volume':
            responseType = 'app:response:name:provide_volume'
            priceData = {
              'time/volume_time': moment.utc(dayPriceResult.date).hour(17).calendar(null, sharedState.responseDateFormat),
              'volume': `${numeral(dayPriceResult.volume).format('0,0')}`,
              'ticker_symbol': confirmedTickerString,
            }
            break
          default:
            switch (client.getMessagePart().classification.sub_type.value) {
              case 'high':
                responseType = 'app:response:name:provide_price/high'
                priceData = {
                  'time/price_time': moment.utc(dayPriceResult.date).hour(17).calendar(null, sharedState.responseDateFormat),
                  'currency/price': `${numeral(dayPriceResult.high).format('$0,0.00')}`,
                  'ticker_symbol': confirmedTickerString,
                }
                break
              case 'low':
                responseType = 'app:response:name:provide_price/low'
                priceData = {
                  'time/price_time': moment.utc(dayPriceResult.date).hour(17).calendar(null, sharedState.responseDateFormat),
                  'currency/price': `${numeral(dayPriceResult.low).format('$0,0.00')}`,
                  'ticker_symbol': confirmedTickerString,
                }
                break
              case 'open':
                responseType = 'app:response:name:provide_price/open'
                priceData = {
                  'time/price_time': moment.utc(dayPriceResult.date).hour(17).calendar(null, sharedState.responseDateFormat),
                  'currency/price': `${numeral(dayPriceResult.open).format('$0,0.00')}`,
                  'ticker_symbol': confirmedTickerString,
                }
                break
              case 'change':
                let direction = 'change'
                let changeAmount = dayPriceResult.close - dayPriceResult.open
                if (changeAmount < 0) {
                  direction = 'decrease'
                } else if (changeAmount > 0) {
                  direction = 'increase'
                }
                let approximatePercentage = changeAmount / dayPriceResult.open

                responseType = `app:response:name:provide_price_change/${direction}`

                priceData = {
                  'time/price_time': moment.utc(dayPriceResult.date).hour(17).calendar(null, sharedState.responseDateFormat),
                  'approximate_percentage': `${numeral(approximatePercentage).format('0.0%')}`,
                  'approximate_amount': `${numeral(changeAmount).format('$0,0.00')}`,
                  'ticker_symbol': confirmedTickerString,
                }

                break
              case 'current':
                // fallthrough
              default:
                responseType = 'app:response:name:provide_price/most_recent'
                priceData = {
                  'time/price_time': moment.utc(dayPriceResult.date).hour(17).calendar(null, sharedState.responseDateFormat),
                  'currency/price': `${numeral(dayPriceResult.close).format('$0,0.00')}`,
                  'ticker_symbol': confirmedTickerString,
                }
            }
            break
        }
        client.addResponse(responseType, priceData)
        callback()
        client.done()
      }

      if (priceTime) {
        sharedState.intrinioClient.historialPricesByTicker(confirmedTickerString, priceTime, priceTime, (result) => {
          if (result.length === 0) {
            client.addTextResponse('Could not get results')
            client.done()
            return
          }
          returnPrice(result[0])
        })
      } else {
        sharedState.intrinioClient.dailyPricesByTicker(confirmedTickerString, 5, (result) => {
          if (result.length === 0) {
            client.addTextResponse('Could not get results')
            client.done()
            return
          }
          returnPrice(result[0])
        })
      }


    },
  })
}
