'use strict'

module.exports = (client, sharedState) => {
  return client.createStep({
    extractInfo() {
      const datapointType = sharedState.firstOfEntityRole(client.getMessagePart(), 'datapoint')

      if (datapointType) {
        client.updateConversationState({
          requestedDatapoint: datapointType,
          confirmedDatapoint: null,
          proposedDatapoint: null,
        })
      }
    },

    satisfied() {
      return Boolean(client.getConversationState().requestedDatapoint) || Boolean(client.getConversationState().confirmedDatapoint)
    },

    prompt() {

      client.addTextResponse('What datapoint are you asking for?')
      client.done()
    },
  })
}
