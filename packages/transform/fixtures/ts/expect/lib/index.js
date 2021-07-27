'use strict'

var _a = _interopRequireDefault(require('./a'))

var _b = require('./b')

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

var b = _a.default
console.log(b)
console.log(
  /*#__PURE__*/ React.createElement(_b.B, {
    name: 'b',
  })
)
