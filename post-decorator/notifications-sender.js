/*
 * Copyright 2019 Mia srl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict'

  // TODO: notifyslack nei paramatri, who e mymsqg nei parametri cosi possiamo personalizzare la cosa

module.exports = async function sendNotification(req) {
  const { mymsg, who } = req.getOriginalRequestBody()
  const notifierProxy = req.getDirectServiceProxy(this.config.SERVICE_NAME, { port: this.config.SERVICE_PORT })
  try {
    const response = await notifierProxy.post('/notify-slack', { text: `${who} says: ${mymsg}` })
    req.log.info({ statusCode: response.statusCode }, 'Slack service response')
  } catch (error) {
    req.log.error('Error sending notification', error)
  }
  return req.leaveOriginalResponseUnmodified()
}
