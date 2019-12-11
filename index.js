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

const notificationsSender = require('./post-decorator/notifications-sender')
const checkWho = require('./pre-decorator/check-who')
const customService = require('@mia-platform/custom-plugin-lib')({
  type: 'object',
  required: ['SERVICE_NAME', 'SERVICE_PORT'],
  properties: {
    SERVICE_NAME: { type: 'string' },
    SERVICE_PORT: { type: 'number' },
  },
})

module.exports = customService(async function index(service) {
  service.addPreDecorator('/checkwho', checkWho)
  service.addPostDecorator('/notify', notificationsSender)
})
