'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var PropTypes = _interopDefault(require('prop-types'));
var React = require('react');
var React__default = _interopDefault(React);
var ReactRedux = _interopDefault(require('react-redux'));
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
function withRPCReactor(rpcId, reducers, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      propName = _ref.propName,
      transformParams = _ref.transformParams,
      mapStateToParams = _ref.mapStateToParams;

  return withRPCRedux(rpcId, {
    actions: fusionRpcRedux.createRPCReactors(rpcId, reducers),
    propName: propName,
    rpcId: rpcId,
    transformParams: transformParams,
    mapStateToParams: mapStateToParams
  });
}
function withRPCRedux(rpcId, _temp2) {
  var _ref2 = _temp2 === void 0 ? {} : _temp2,
      _ref2$propName = _ref2.propName,
      propName = _ref2$propName === void 0 ? rpcId : _ref2$propName,
      actions = _ref2.actions,
      transformParams = _ref2.transformParams,
      mapStateToParams = _ref2.mapStateToParams;

  return function (Component) {
    var withRPCRedux = function withRPCRedux(oldProps, context) {
      var rpc$$1 = context.rpc;
      return context.store && ReactRedux && !ReactRedux.ReactReduxContext ? function () {
        var _objectSpread2;

        // eslint-disable-next-line no-console
        console.warn('Warning: React-Redux 5 is deprecated.  Please upgrade to a verion of React-Redux >= 6 when using fusion-plugin-rpc-redux-react.');

        if (mapStateToParams) {
          var mapState = mapStateToParams;

          mapStateToParams = function mapStateToParams(state, args) {
            return mapState(state, args, oldProps);
          };
        }

        var handler = fusionRpcRedux.createRPCHandler({
          rpcId: rpcId,
          rpc: rpc$$1,
          store: context.store,
          actions: actions,
          mapStateToParams: mapStateToParams,
          transformParams: transformParams
        });

        var props = _objectSpread({}, oldProps, (_objectSpread2 = {}, _objectSpread2[propName] = handler, _objectSpread2));

        return React__default.createElement(Component, props);
      }() : React__default.createElement(ReactRedux.ReactReduxContext.Consumer, null, function (_ref3) {
        var _objectSpread3;

        var store = _ref3.store;

        if (mapStateToParams) {
          var mapState = mapStateToParams;

          mapStateToParams = function mapStateToParams(state, args) {
            return mapState(state, args, oldProps);
          };
        }

        var handler = fusionRpcRedux.createRPCHandler({
          rpcId: rpcId,
          rpc: rpc$$1,
          store: store,
          actions: actions,
          mapStateToParams: mapStateToParams,
          transformParams: transformParams
        });

        var props = _objectSpread({}, oldProps, (_objectSpread3 = {}, _objectSpread3[propName] = handler, _objectSpread3));

        return React__default.createElement(Component, props);
      });
    };

    var displayName = Component.displayName || Component.name || 'Anonymous';
    withRPCRedux.displayName = 'WithRPCRedux' + '(' + displayName + ')';
    withRPCRedux.contextTypes = {
      rpc: PropTypes.object.isRequired,
      store: PropTypes.object
    };
    return withRPCRedux;
  };
}

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/** Copyright (c) 2018 Uber Technologies, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
var RPCProvider =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(RPCProvider, _Component);

  function RPCProvider(props, context) {
    var _this;

    _this = _Component.call(this, props, context) || this;
    _this.rpc = props.provides.from(props.ctx);
    return _this;
  }

  var _proto = RPCProvider.prototype;

  _proto.getChildContext = function getChildContext() {
    return {
      rpc: this.rpc
    };
  };

  _proto.render = function render() {
    return React.Children.only(this.props.children);
  };

  return RPCProvider;
}(React.Component);

RPCProvider.childContextTypes = {
  rpc: PropTypes.object.isRequired
};
var plugin = fusionReact.ProviderPlugin.create('rpc', rpc__default, RPCProvider);
var mock = fusionReact.ProviderPlugin.create('rpc', rpc.mock, RPCProvider);

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
