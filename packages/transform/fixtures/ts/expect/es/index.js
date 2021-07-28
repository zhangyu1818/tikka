import a from './a';
import { B } from './b';
var b = a;
console.log(b);
console.log( /*#__PURE__*/React.createElement(B, {
  name: "b"
}));