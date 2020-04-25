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

const t = require('tap')
const nock = require('nock')
const lc39 = require('@mia-platform/lc39')

async function setupFastify(envVariables) {
  const fastify = await lc39('./index.js', {
    // silent => trace for enabling logs
    logLevel: 'silent',
    envVariables,
  })
  return fastify
}

t.test('testnode', async t => {
  nock.disableNetConnect()
  const fastify = await setupFastify({
    USERID_HEADER_KEY: 'userid',
    GROUPS_HEADER_KEY: 'groups',
    CLIENTTYPE_HEADER_KEY: 'clienttype',
    BACKOFFICE_HEADER_KEY: 'backoffice',
    MICROSERVICE_GATEWAY_SERVICE_NAME: 'microservice-gateway.example.org',
    SERVICE_NAME: 'api-gateway',
    SERVICE_PORT: 8080,
  })

  t.tearDown(async() => {
    await fastify.close()
    nock.enableNetConnect()
  })

  const who = 'John Appleseed'
  const mymsg = 'hello to everyone!'

  t.test('POST /notify', t => {
    t.test('Send a message to the service for sending Slack notification', async t => {
      const scope = nock('http://api-gateway:8080').
        post('/notify-slack', { text: `${who} says: ${mymsg}` })
        .reply(200, {})
      const response = await fastify.inject({
        method: 'POST',
        url: '/notify',
        body: {
          request: {
            method: '',
            path: '',
            headers: {},
            body: {
              who,
              mymsg,
            },
            query: {},
          },
          response: {
            statusCode: 200,
            headers: {},
            body: {},
            query: {},
          },
        },
      })
      t.equal(response.statusCode, 204)
      scope.done()
      t.end()
    })

    t.test('Do not block the call if the Slack service respond with error', async t => {
      const scope = nock('http://api-gateway:8080').
        post('/notify-slack', { text: `${who} says: ${mymsg}` })
        .replyWithError('Somenthing went wrong!')
      const response = await fastify.inject({
        method: 'POST',
        url: '/notify',
        body: {
          request: {
            method: '',
            path: '',
            headers: {},
            body: {
              who,
              mymsg,
            },
            query: {},
          },
          response: {
            statusCode: 200,
            headers: {},
            body: {},
            query: {},
          },
        },
      })

      t.equal(response.statusCode, 204)
      scope.done()
      t.end()
    })

    t.test('Send a message to the service for sending Slack notification', async t => {
      const scope = nock('http://api-gateway:8080').
        post('/notify-slack', { text: `${who} says: ${mymsg}` })
        .reply(404, {})
      const response = await fastify.inject({
        method: 'POST',
        url: '/notify',
        body: {
          request: {
            method: '',
            path: '',
            headers: {},
            body: {
              who,
              mymsg,
            },
            query: {},
          },
          response: {
            statusCode: 404,
            headers: {},
            body: {},
            query: {},
          },
        },
      })
      t.equal(response.statusCode, 204)
      scope.done()
      t.end()
    })

    t.end()
  })

  t.test('POST /checkwho', t => {
    t.test('If "who" is undefined add the default value', async t => {
      const defaultWho = 'John Doe'
      const response = await fastify.inject({
        method: 'POST',
        url: '/checkwho',
        body: {
          method: '',
          path: '',
          headers: {},
          query: {},
          body: {
            who: undefined,
            mymsg,
          },
        },
      })
      const expectedResponseBody = {
        body: {
          mymsg,
          who: defaultWho,
        },
      }
      t.equal(response.statusCode, 200)
      t.same(JSON.parse(response.body), expectedResponseBody)
      t.end()
    })

    t.test('If "who" is undefined but user_id is set use user_id as value', async t => {
      const response = await fastify.inject({
        method: 'POST',
        url: '/checkwho',
        body: {
          method: '',
          path: '',
          headers: { [fastify.config.USERID_HEADER_KEY]: 'userid' },
          query: {},
          body: {
            who: undefined,
            mymsg,
          },
        },
      })
      const expectedResponseBody = {
        body: {
          mymsg,
          who: 'userid',
        },
      }
      t.equal(response.statusCode, 200)
      t.same(JSON.parse(response.body), expectedResponseBody)
      t.end()
    })

    t.test('If "who" is defined use its value', async t => {
      const response = await fastify.inject({
        method: 'POST',
        url: '/checkwho',
        body: {
          method: '',
          path: '',
          headers: {},
          query: {},
          body: {
            who,
            mymsg,
          },
        },
      })
      const expectedResponseBody = {
        body: {
          mymsg,
          who,
        },
      }
      t.equal(response.statusCode, 200)
      t.same(JSON.parse(response.body), expectedResponseBody)
      t.end()
    })

    t.end()
  })

  t.end()
})
