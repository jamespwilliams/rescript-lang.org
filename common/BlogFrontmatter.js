

import * as Js_null from "bs-platform/lib/es6/js_null.js";
import * as Belt_Array from "bs-platform/lib/es6/belt_Array.js";
import * as Belt_Option from "bs-platform/lib/es6/belt_Option.js";
import * as Json_decode from "@glennsl/bs-json/src/Json_decode.js";
import * as Caml_exceptions from "bs-platform/lib/es6/caml_exceptions.js";
import * as Caml_js_exceptions from "bs-platform/lib/es6/caml_js_exceptions.js";

var rawAuthors = (require('../index_data/blog_authors.json'));

function getDisplayName(author) {
  var fullname = author.fullname;
  if (fullname !== null) {
    return fullname;
  } else {
    return "@" + author.username;
  }
}

function decode(json) {
  return {
          username: Json_decode.field("username", Json_decode.string, json),
          fullname: Js_null.fromOption(Json_decode.optional((function (param) {
                      return Json_decode.field("fullname", Json_decode.string, param);
                    }), json)),
          role: Json_decode.field("role", Json_decode.string, json),
          imgUrl: Js_null.fromOption(Json_decode.optional((function (param) {
                      return Json_decode.field("img_url", Json_decode.string, param);
                    }), json)),
          twitter: Js_null.fromOption(Json_decode.optional((function (param) {
                      return Json_decode.field("twitter", Json_decode.string, param);
                    }), json))
        };
}

function getAllAuthors(param) {
  return Json_decode.array(decode, rawAuthors);
}

var Author = {
  rawAuthors: rawAuthors,
  getDisplayName: getDisplayName,
  decode: decode,
  getAllAuthors: getAllAuthors
};

function toString(c) {
  switch (c) {
    case /* Compiler */0 :
        return "Compiler";
    case /* Syntax */1 :
        return "Syntax";
    case /* Ecosystem */2 :
        return "Ecosystem";
    case /* Docs */3 :
        return "Docs";
    case /* Community */4 :
        return "Community";
    
  }
}

var Category = {
  toString: toString
};

function toString$1(c) {
  switch (c) {
    case /* Release */0 :
        return "Release";
    case /* Testing */1 :
        return "Testing";
    case /* Preview */2 :
        return "Preview";
    case /* Roadmap */3 :
        return "Roadmap";
    
  }
}

var Badge = {
  toString: toString$1
};

function decodeCategory(str) {
  var str$1 = str.toLowerCase();
  switch (str$1) {
    case "community" :
        return /* Community */4;
    case "compiler" :
        return /* Compiler */0;
    case "docs" :
        return /* Docs */3;
    case "ecosystem" :
        return /* Ecosystem */2;
    case "syntax" :
        return /* Syntax */1;
    default:
      throw {
            RE_EXN_ID: Json_decode.DecodeError,
            _1: "Unknown category \"" + str$1 + "\"",
            Error: new Error()
          };
  }
}

function decodeBadge(str) {
  var str$1 = str.toLowerCase();
  switch (str$1) {
    case "preview" :
        return /* Preview */2;
    case "release" :
        return /* Release */0;
    case "roadmap" :
        return /* Roadmap */3;
    case "testing" :
        return /* Testing */1;
    default:
      throw {
            RE_EXN_ID: Json_decode.DecodeError,
            _1: "Unknown category \"" + str$1 + "\"",
            Error: new Error()
          };
  }
}

var AuthorNotFound = Caml_exceptions.create("BlogFrontmatter.AuthorNotFound");

function decodeAuthor(fieldName, authors, username) {
  var author = authors.find(function (a) {
        return a.username === username;
      });
  if (author !== undefined) {
    return author;
  }
  throw {
        RE_EXN_ID: AuthorNotFound,
        _1: "Couldn\'t find author \"" + username + "\" in field " + fieldName,
        Error: new Error()
      };
}

function authorDecoder(fieldName, authors, json) {
  var multiple = function (j) {
    return Belt_Array.map(Json_decode.array(Json_decode.string, j), (function (param) {
                  return decodeAuthor(fieldName, authors, param);
                }));
  };
  var single = function (j) {
    return [decodeAuthor(fieldName, authors, Json_decode.string(j))];
  };
  return Json_decode.either(single, multiple)(json);
}

function decode$1(authors, json) {
  var fm;
  try {
    fm = {
      author: decodeAuthor("author", authors, Json_decode.field("author", Json_decode.string, json)),
      co_authors: Belt_Option.getWithDefault(Json_decode.optional((function (param) {
                  return Json_decode.field("co-authors", (function (param) {
                                return authorDecoder("co-authors", authors, param);
                              }), param);
                }), json), []),
      date: Json_decode.field("date", Json_decode.string, json),
      previewImg: Js_null.fromOption(Json_decode.optional((function (param) {
                  return Json_decode.field("previewImg", Json_decode.string, param);
                }), json)),
      articleImg: Js_null.fromOption(Json_decode.optional((function (param) {
                  return Json_decode.field("articleImg", Json_decode.string, param);
                }), json)),
      title: Json_decode.field("title", Json_decode.string, json),
      category: Js_null.fromOption(Json_decode.optional((function (j) {
                  return decodeCategory(Json_decode.field("category", Json_decode.string, j));
                }), json)),
      badge: Js_null.fromOption(Json_decode.optional((function (j) {
                  return decodeBadge(Json_decode.field("badge", Json_decode.string, j));
                }), json)),
      description: Json_decode.nullable((function (param) {
              return Json_decode.field("description", Json_decode.string, param);
            }), json),
      canonical: Js_null.fromOption(Json_decode.optional((function (param) {
                  return Json_decode.field("canonical", Json_decode.string, param);
                }), json))
    };
  }
  catch (raw_str){
    var str = Caml_js_exceptions.internalToOCamlException(raw_str);
    if (str.RE_EXN_ID === Json_decode.DecodeError) {
      return {
              TAG: 1,
              _0: str._1,
              [Symbol.for("name")]: "Error"
            };
    }
    if (str.RE_EXN_ID === AuthorNotFound) {
      return {
              TAG: 1,
              _0: str._1,
              [Symbol.for("name")]: "Error"
            };
    }
    throw str;
  }
  return {
          TAG: 0,
          _0: fm,
          [Symbol.for("name")]: "Ok"
        };
}

export {
  Author ,
  Category ,
  Badge ,
  decodeCategory ,
  decodeBadge ,
  AuthorNotFound ,
  decodeAuthor ,
  authorDecoder ,
  decode$1 as decode,
  
}
/* rawAuthors Not a pure module */
