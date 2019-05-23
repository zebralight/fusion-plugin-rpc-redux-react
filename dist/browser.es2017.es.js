import PropTypes from 'prop-types';
import React, { Component, Children } from 'react';
import { ReactReduxContext } from 'react-redux';
import { createRPCHandler, createRPCReactors, createRPCReducer } from 'fusion-rpc-redux';
export { createRPCReducer } from 'fusion-rpc-redux';
import { ProviderPlugin } from 'fusion-react';
import rpc, { mock, BodyParserOptionsToken, RPCToken, RPCHandlersToken, ResponseError } from 'fusion-plugin-rpc';
export { BodyParserOptionsToken, ResponseError, RPCToken, RPCHandlersToken } from 'fusion-plugin-rpc';

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/** Copyright (c) 2018 Uber Technologies, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
function withRPCReactor(rpcId, reducers, {
  propName,
  transformParams,
  mapStateToParams
} = {}) {
  return withRPCRedux(rpcId, {
    actions: createRPCReactors(rpcId, reducers),
    propName,
    rpcId,
    transformParams,
    mapStateToParams
  });
}
function withRPCRedux(rpcId, {
  propName = rpcId,
  actions,
  transformParams,
  mapStateToParams
} = {}) {
  return Component$$1 => {
    const withRPCRedux = (oldProps, context) => {
      const {
        rpc: rpc$$1
      } = context;
      return context.store && !ReactReduxContext ? function () {
        // eslint-disable-next-line no-console
        console.warn('Warning: React-Redux 5 is deprecated.  Please upgrade to a verion of React-Redux >= 6 when using fusion-plugin-rpc-redux-react.');

        if (mapStateToParams) {
          const mapState = mapStateToParams;

          mapStateToParams = (state, args) => mapState(state, args, oldProps);
        }

        const handler = createRPCHandler({
          rpcId,
          rpc: rpc$$1,
          store: context.store,
          actions,
          mapStateToParams,
          transformParams
        });

        const props = _objectSpread({}, oldProps, {
          [propName]: handler
        });

        return React.createElement(Component$$1, props);
      }() : React.createElement(ReactReduxContext.Consumer, null, ({
        store
      }) => {
        if (mapStateToParams) {
          const mapState = mapStateToParams;

          mapStateToParams = (state, args) => mapState(state, args, oldProps);
        }

        const handler = createRPCHandler({
          rpcId,
          rpc: rpc$$1,
          store,
          actions,
          mapStateToParams,
          transformParams
        });

        const props = _objectSpread({}, oldProps, {
          [propName]: handler
        });

        return React.createElement(Component$$1, props);
      });
    };

    const displayName = Component$$1.displayName || Component$$1.name || 'Anonymous';
    withRPCRedux.displayName = 'WithRPCRedux' + '(' + displayName + ')';
    withRPCRedux.contextTypes = {
      rpc: PropTypes.object.isRequired,
      store: PropTypes.object
    };
    return withRPCRedux;
  };
}

/** Copyright (c) 2018 Uber Technologies, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
class RPCProvider extends Component {
  constructor(props, context) {
    super(props, context);
    this.rpc = props.provides.from(props.ctx);
  }

  getChildContext() {
    return {
      rpc: this.rpc
    };
  }

  render() {
    return Children.only(this.props.children);
  }

}

RPCProvider.childContextTypes = {
  rpc: PropTypes.object.isRequired
};
var plugin = ProviderPlugin.create('rpc', rpc, RPCProvider);
const mock$1 = ProviderPlugin.create('rpc', mock, RPCProvider);

/** Copyright (c) 2018 Uber Technologies, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

export default plugin;
export { mock$1 as mock, withRPCRedux, withRPCReactor };
