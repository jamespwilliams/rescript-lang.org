

import * as Belt_Array from "bs-platform/lib/es6/belt_Array.js";
import * as Caml_array from "bs-platform/lib/es6/caml_array.js";
import * as Belt_Option from "bs-platform/lib/es6/belt_Option.js";
import * as Caml_option from "bs-platform/lib/es6/caml_option.js";

function toString(c) {
  switch (c) {
    case /* Black */0 :
        return "black";
    case /* Red */1 :
        return "red";
    case /* Green */2 :
        return "green";
    case /* Yellow */3 :
        return "yellow";
    case /* Blue */4 :
        return "blue";
    case /* Magenta */5 :
        return "magenta";
    case /* Cyan */6 :
        return "cyan";
    case /* White */7 :
        return "white";
    
  }
}

var Color = {
  toString: toString
};

function paramToString(s) {
  if (typeof s === "number") {
    return "bold";
  }
  switch (s.TAG | 0) {
    case /* Fg */0 :
        return "Fg(" + (toString(s._0) + ")");
    case /* Bg */1 :
        return "Bg(" + (toString(s._0) + ")");
    case /* Unknown */2 :
        return "Unknown: " + s._0;
    
  }
}

var Sgr = {
  paramToString: paramToString
};

var esc = "\u001B";

function isAscii(c) {
  return /[\x40-\x7F]/.test(c);
}

function fromString(input) {
  return {
          input: input,
          pos: -1
        };
}

function isDone(p) {
  return p.pos >= p.input.length;
}

function next(p) {
  if (isDone(p)) {
    return p.input[p.pos];
  }
  var c = p.input[p.pos + 1 | 0];
  p.pos = p.pos + 1 | 0;
  return c;
}

function untilNextEsc(p) {
  var ret;
  while(!isDone(p) && ret === undefined) {
    var c = next(p);
    if (c === esc) {
      ret = Caml_option.some(undefined);
    }
    
  };
  return ret;
}

function look(p, num) {
  var length = p.input.length;
  var pos = (p.pos + num | 0) >= length ? length - 1 | 0 : p.pos + num | 0;
  return p.input[pos];
}

var $$Location = {
  fromString: fromString,
  isDone: isDone,
  next: next,
  untilNextEsc: untilNextEsc,
  look: look
};

function lex(_accOpt, _stateOpt, p) {
  while(true) {
    var accOpt = _accOpt;
    var stateOpt = _stateOpt;
    var acc = accOpt !== undefined ? accOpt : [];
    var state = stateOpt !== undefined ? stateOpt : /* Scan */0;
    if (isDone(p)) {
      return acc;
    }
    if (typeof state === "number") {
      var c = next(p);
      var state$1 = c === esc ? ({
            TAG: 0,
            startPos: p.pos,
            content: "",
            [Symbol.for("name")]: "ReadSgr"
          }) : ({
            TAG: 1,
            startPos: p.pos,
            content: c,
            [Symbol.for("name")]: "ReadText"
          });
      _stateOpt = state$1;
      _accOpt = acc;
      continue ;
    }
    if (state.TAG) {
      var content = state.content;
      var startPos = state.startPos;
      var c$1 = next(p);
      var endPos = p.pos - 1 | 0;
      if (c$1 === esc) {
        var token_0 = {
          startPos: startPos,
          endPos: endPos
        };
        var token = {
          TAG: 0,
          loc: token_0,
          content: content,
          [Symbol.for("name")]: "Text"
        };
        acc.push(token);
        _stateOpt = {
          TAG: 0,
          startPos: p.pos,
          content: c$1,
          [Symbol.for("name")]: "ReadSgr"
        };
        _accOpt = acc;
        continue ;
      }
      if (isDone(p)) {
        var token_0$1 = {
          startPos: startPos,
          endPos: endPos
        };
        var token$1 = {
          TAG: 0,
          loc: token_0$1,
          content: content,
          [Symbol.for("name")]: "Text"
        };
        acc.push(token$1);
        return acc;
      }
      var content$1 = content + c$1;
      _stateOpt = {
        TAG: 1,
        startPos: startPos,
        content: content$1,
        [Symbol.for("name")]: "ReadText"
      };
      _accOpt = acc;
      continue ;
    }
    var content$2 = state.content;
    var startPos$1 = state.startPos;
    var c$2 = next(p);
    if (c$2 !== "[" && isAscii(c$2)) {
      var raw = content$2 + c$2;
      var loc_endPos = (startPos$1 + raw.length | 0) - 1 | 0;
      var loc = {
        startPos: startPos$1,
        endPos: loc_endPos
      };
      var x = /\[([0-9;]+)([\x40-\x7F])/.exec(raw);
      var token$2;
      if (x !== null) {
        var str = Caml_array.get(x, 1);
        if (str == null) {
          token$2 = {
            TAG: 1,
            loc: loc,
            raw: raw,
            params: [],
            [Symbol.for("name")]: "Sgr"
          };
        } else {
          var other = (
              (str == null) ? undefined : Caml_option.some(str)
            ).split(";");
          var exit = 0;
          if (other.length !== 1) {
            exit = 1;
          } else {
            var match = other[0];
            if (match === "0") {
              token$2 = {
                TAG: 2,
                loc: loc,
                raw: raw,
                [Symbol.for("name")]: "ClearSgr"
              };
            } else {
              exit = 1;
            }
          }
          if (exit === 1) {
            var params = Belt_Array.map(other, (function (s) {
                    switch (s) {
                      case "1" :
                          return /* Bold */0;
                      case "30" :
                          return {
                                  TAG: 0,
                                  _0: /* Black */0,
                                  [Symbol.for("name")]: "Fg"
                                };
                      case "31" :
                          return {
                                  TAG: 0,
                                  _0: /* Red */1,
                                  [Symbol.for("name")]: "Fg"
                                };
                      case "32" :
                          return {
                                  TAG: 0,
                                  _0: /* Green */2,
                                  [Symbol.for("name")]: "Fg"
                                };
                      case "33" :
                          return {
                                  TAG: 0,
                                  _0: /* Yellow */3,
                                  [Symbol.for("name")]: "Fg"
                                };
                      case "34" :
                          return {
                                  TAG: 0,
                                  _0: /* Blue */4,
                                  [Symbol.for("name")]: "Fg"
                                };
                      case "35" :
                          return {
                                  TAG: 0,
                                  _0: /* Magenta */5,
                                  [Symbol.for("name")]: "Fg"
                                };
                      case "36" :
                          return {
                                  TAG: 0,
                                  _0: /* Cyan */6,
                                  [Symbol.for("name")]: "Fg"
                                };
                      case "37" :
                          return {
                                  TAG: 0,
                                  _0: /* White */7,
                                  [Symbol.for("name")]: "Fg"
                                };
                      case "40" :
                          return {
                                  TAG: 1,
                                  _0: /* Black */0,
                                  [Symbol.for("name")]: "Bg"
                                };
                      case "41" :
                          return {
                                  TAG: 1,
                                  _0: /* Red */1,
                                  [Symbol.for("name")]: "Bg"
                                };
                      case "42" :
                          return {
                                  TAG: 1,
                                  _0: /* Green */2,
                                  [Symbol.for("name")]: "Bg"
                                };
                      case "43" :
                          return {
                                  TAG: 1,
                                  _0: /* Yellow */3,
                                  [Symbol.for("name")]: "Bg"
                                };
                      case "44" :
                          return {
                                  TAG: 1,
                                  _0: /* Blue */4,
                                  [Symbol.for("name")]: "Bg"
                                };
                      case "45" :
                          return {
                                  TAG: 1,
                                  _0: /* Magenta */5,
                                  [Symbol.for("name")]: "Bg"
                                };
                      case "46" :
                          return {
                                  TAG: 1,
                                  _0: /* Cyan */6,
                                  [Symbol.for("name")]: "Bg"
                                };
                      case "47" :
                          return {
                                  TAG: 1,
                                  _0: /* White */7,
                                  [Symbol.for("name")]: "Bg"
                                };
                      default:
                        return {
                                TAG: 2,
                                _0: s,
                                [Symbol.for("name")]: "Unknown"
                              };
                    }
                  }));
            token$2 = {
              TAG: 1,
              loc: loc,
              raw: raw,
              params: params,
              [Symbol.for("name")]: "Sgr"
            };
          }
          
        }
      } else {
        token$2 = {
          TAG: 1,
          loc: loc,
          raw: raw,
          params: [],
          [Symbol.for("name")]: "Sgr"
        };
      }
      acc.push(token$2);
      _stateOpt = /* Scan */0;
      _accOpt = acc;
      continue ;
    }
    _stateOpt = {
      TAG: 0,
      startPos: startPos$1,
      content: content$2 + c$2,
      [Symbol.for("name")]: "ReadSgr"
    };
    _accOpt = acc;
    continue ;
  };
}

function lex$1(p) {
  return lex(undefined, undefined, p);
}

var Lexer = {
  lex: lex$1
};

function parse(input) {
  return lex(undefined, undefined, {
              input: input,
              pos: -1
            });
}

function onlyText(tokens) {
  return Belt_Array.keep(tokens, (function (x) {
                switch (x.TAG | 0) {
                  case /* Text */0 :
                      return true;
                  case /* Sgr */1 :
                  case /* ClearSgr */2 :
                      return false;
                  
                }
              }));
}

function fromTokens(tokens) {
  var ret = [];
  var params = [];
  var content = "";
  var length = tokens.length;
  for(var i = 0; i < length; ++i){
    var token = Belt_Array.getExn(tokens, i);
    var isLast = i === (length - 1 | 0);
    switch (token.TAG | 0) {
      case /* Text */0 :
          content = content + token.content;
          if (isLast && content !== "") {
            var element = {
              content: content,
              params: params
            };
            ret.push(element);
          }
          break;
      case /* Sgr */1 :
          var match = Belt_Array.reduce(Belt_Array.concat(params, token.params), [
                undefined,
                undefined,
                []
              ], (function (acc, next) {
                  var other = acc[2];
                  var bg = acc[1];
                  var fg = acc[0];
                  if (typeof next !== "number") {
                    switch (next.TAG | 0) {
                      case /* Fg */0 :
                          return [
                                  next,
                                  bg,
                                  other
                                ];
                      case /* Bg */1 :
                          return [
                                  fg,
                                  next,
                                  other
                                ];
                      case /* Unknown */2 :
                          break;
                      
                    }
                  }
                  if (Caml_option.undefined_to_opt(other.find(function (o2) {
                              return next === o2;
                            })) === undefined) {
                    other.push(next);
                  }
                  return [
                          fg,
                          bg,
                          other
                        ];
                }));
          if (content !== "") {
            var element$1 = {
              content: content,
              params: params
            };
            ret.push(element$1);
            content = "";
          }
          params = Belt_Array.concatMany([
                Belt_Option.mapWithDefault(match[0], [], (function (v) {
                        return [v];
                      })),
                Belt_Option.mapWithDefault(match[1], [], (function (v) {
                        return [v];
                      })),
                match[2]
              ]);
          break;
      case /* ClearSgr */2 :
          if (content !== "") {
            var element$2 = {
              content: content,
              params: params
            };
            ret.push(element$2);
            params = [];
            content = "";
          }
          break;
      
    }
  }
  return ret;
}

function toString$1(e) {
  var content = e.content.replace(/\n/g, "\\n").replace(esc, "");
  var params = Belt_Array.map(e.params, paramToString).join(", ");
  return "SgrString params: " + params + " | content: " + content;
}

var SgrString = {
  fromTokens: fromTokens,
  toString: toString$1
};

function tokenString(t) {
  switch (t.TAG | 0) {
    case /* Text */0 :
        var match = t.loc;
        var content = t.content.replace(/\n/g, "\\n").replace(esc, "");
        return "Text \"" + content + "\" (" + match.startPos + " to " + match.endPos + ")";
    case /* Sgr */1 :
        var match$1 = t.loc;
        var raw = t.raw.replace(esc, "");
        var params = Belt_Array.map(t.params, paramToString).join(", ");
        return "Sgr \"" + raw + "\" -> " + params + " (" + match$1.startPos + " to " + match$1.endPos + ")";
    case /* ClearSgr */2 :
        var match$2 = t.loc;
        var raw$1 = t.raw.replace(esc, "");
        return "Clear Sgr \"" + raw$1 + "\" (" + match$2.startPos + " to " + match$2.endPos + ")";
    
  }
}

function plainString(tokens) {
  return Belt_Array.map(tokens, (function (x) {
                  switch (x.TAG | 0) {
                    case /* Text */0 :
                        return x.content;
                    case /* Sgr */1 :
                    case /* ClearSgr */2 :
                        return "";
                    
                  }
                })).join("");
}

var Printer = {
  tokenString: tokenString,
  plainString: plainString
};

export {
  Color ,
  Sgr ,
  esc ,
  isAscii ,
  $$Location ,
  Lexer ,
  parse ,
  onlyText ,
  SgrString ,
  Printer ,
  
}
/* No side effect */
