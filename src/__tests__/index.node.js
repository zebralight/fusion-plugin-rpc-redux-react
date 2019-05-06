/** Copyright (c) 2018 Uber Technologies, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import React from 'react';
import test from 'tape-cup';
import ShallowRenderer from 'react-test-renderer/shallow';

import App from 'fusion-core';
import type {Context} from 'fusion-core';
import {RPCHandlersToken} from 'fusion-plugin-rpc';
import {getService} from 'fusion-test-utils';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';

import Plugin from '../plugin';
import {mock, ResponseError} from '../index';
import {withRPCRedux, withRPCReactor} from '../hoc';

/* Test helpers */
function createMockEmitter(props: mixed) {
  const emitter = {
    from: () => {
      return emitter;
    },
    emit: () => {},
    setFrequency: () => {},
    teardown: () => {},
    map: () => {},
    on: () => {},
    off: () => {},
    mapEvent: () => {},
    handleEvent: () => {},
    flush: () => {},
    ...props,
  };
  return emitter;
}

test('plugin', t => {
  t.equals(typeof Plugin.provides, 'function');
  const handlers = {test() {}};
  const EventEmitter = createMockEmitter();

  const appCreator = () => {
    const app = new App('content', el => el);
    app.register(RPCHandlersToken, handlers);
    app.register(UniversalEventsToken, EventEmitter);
    return app;
  };

  const RPCRedux = getService(appCreator, Plugin);
  const mockCtx: Context = ({headers: {}, memoized: new Map()}: any);
  t.equal(typeof RPCRedux.from(mockCtx).request, 'function');
  t.end();
});

test('mock plugin', t => {
  t.equals(typeof mock.provides, 'function');
  const handlers = {test() {}};

  const appCreator = () => {
    const app = new App('content', el => el);
    app.register(RPCHandlersToken, handlers);
    return app;
  };

  const RPCRedux = getService(appCreator, mock);
  const mockCtx: Context = ({headers: {}, memoized: new Map()}: any);
  t.equal(typeof RPCRedux.from(mockCtx).request, 'function');
  t.end();
});

test('withRPCRedux hoc', t => {
  function Test() {
    return null;
  }
  t.equals(typeof withRPCRedux, 'function');
  const Connected = withRPCRedux('test')(Test);
  t.equals(Connected.displayName, 'WithRPCRedux(Test)');
  const renderer = new ShallowRenderer();
  const expectedActions = ['TEST_START', 'TEST_SUCCESS'];
  const expectedPayloads = ['test-args', 'test-resolve'];
  const store = {
    dispatch(action) {
      t.equal(action.type, expectedActions.shift());
      t.equal(action.payload, expectedPayloads.shift());
    },
    getState() {},
  };
  renderer.render(React.createElement(Connected), {
    rpc: {
      request(method, args) {
        t.equal(method, 'test');
        t.equal(args, 'test-args');
        return Promise.resolve('test-resolve');
      },
    },
    store,
  });
  const rendered = renderer.getRenderOutput();

  if (rendered.props.test) {
    t.equal(
      typeof rendered.props.test,
      'function',
      'passes the handler through to props'
    );
    rendered.props.test('test-args');
  } else {
    const {test: handler} = rendered.props.children({store}).props;
    t.equal(typeof test, 'function', 'passes the handler through to props');
    handler('test-args');
  }
  t.end();
});

test('withRPCReactor hoc', t => {
  function Test() {
    return null;
  }
  t.equals(typeof withRPCReactor, 'function');
  const Connected = withRPCReactor('test', {
    start() {},
    success() {},
    failure() {},
  })(Test);
  t.equals(Connected.displayName, 'WithRPCRedux(Test)');
  const renderer = new ShallowRenderer();
  const expectedActions = ['TEST_START', 'TEST_SUCCESS'];
  const expectedPayloads = ['test-args', 'test-resolve'];
  const store = {
    dispatch(action) {
      t.equal(action.type, expectedActions.shift());
      t.equal(action.payload, expectedPayloads.shift());
    },
    getState() {},
  };
  renderer.render(React.createElement(Connected), {
    rpc: {
      request(method, args) {
        t.equal(method, 'test');
        t.equal(args, 'test-args');
        return Promise.resolve('test-resolve');
      },
    },
    store,
  });
  const rendered = renderer.getRenderOutput();
  if (rendered.props.test) {
    t.equal(
      typeof rendered.props.test,
      'function',
      'passes the handler through to props'
    );
    rendered.props.test('test-args');
  } else {
    const {test: handler} = rendered.props.children({store}).props;
    t.equal(typeof test, 'function', 'passes the handler through to props');
    handler('test-args');
  }
  t.end();
});

test('ResponseError', t => {
  const e = new ResponseError('test');
  t.ok(e instanceof Error);
  t.end();
});
