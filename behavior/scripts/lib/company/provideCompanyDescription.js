'use strict'

module.exports = (client, sharedState) => {
  return client.createStep({
    satisfied() {
      return false
    },

    next: function next() {
      return undefined
    },

    prompt(callback) {
      const confirmedTickerString = client.getConversationState().confirmedTickerString
      const nameOrTicker = client.getConversationState().requestedCompanyName || client.getConversationState().requestedTicker

      sharedState.intrinioClient.companyByTicker(confirmedTickerString, (result) => {

        client.addTextResponse(`${result.short_description}`)
        client.done()
        callback()
      })

    },
  })
}
