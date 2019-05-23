'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var PropTypes = _interopDefault(require('prop-types'));
var React = require('react');
var React__default = _interopDefault(React);
var reactRedux = require('react-redux');
var fusionRpcRedux = require('fusion-rpc-redux');
var fusionReact = require('fusion-react');
var rpc = require('fusion-plugin-rpc');
var rpc__default = _interopDefault(rpc);

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
    actions: fusionRpcRedux.createRPCReactors(rpcId, reducers),
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
  return Component => {
    const withRPCRedux = (oldProps, context) => {
      const {
        rpc: rpc$$1
      } = context;
      return context.store && !reactRedux.ReactReduxContext ? function () {
        // eslint-disable-next-line no-console
        console.warn('Warning: React-Redux 5 is deprecated.  Please upgrade to a verion of React-Redux >= 6 when using fusion-plugin-rpc-redux-react.');

        if (mapStateToParams) {
          const mapState = mapStateToParams;

          mapStateToParams = (state, args) => mapState(state, args, oldProps);
        }

        const handler = fusionRpcRedux.createRPCHandler({
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

        return React__default.createElement(Component, props);
      }() : React__default.createElement(reactRedux.ReactReduxContext.Consumer, null, ({
        store
      }) => {
        if (mapStateToParams) {
          const mapState = mapStateToParams;

          mapStateToParams = (state, args) => mapState(state, args, oldProps);
        }

        const handler = fusionRpcRedux.createRPCHandler({
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

        return React__default.createElement(Component, props);
      });
    };

    const displayName = Component.displayName || Component.name || 'Anonymous';
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
class RPCProvider extends React.Component {
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
    return React.Children.only(this.props.children);
  }

}

RPCProvider.childContextTypes = {
  rpc: PropTypes.object.isRequired
};
var plugin = fusionReact.ProviderPlugin.create('rpc', rpc__default, RPCProvider);
const mock = fusionReact.ProviderPlugin.create('rpc', rpc.mock, RPCProvider);

/** Copyright (c) 2018 Uber Technologies, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

exports.createRPCReducer = fusionRpcRedux.createRPCReducer;
exports.BodyParserOptionsToken = rpc.BodyParserOptionsToken;
exports.ResponseError = rpc.ResponseError;
exports.RPCToken = rpc.RPCToken;
exports.RPCHandlersToken = rpc.RPCHandlersToken;
exports.default = plugin;
exports.mock = mock;
exports.withRPCRedux = withRPCRedux;
exports.withRPCReactor = withRPCReactor;
