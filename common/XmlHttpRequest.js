


var Upload = {};

function decodeReadyState(x) {
  if (x > 4 || x < 0) {
    return /* Unknown */5;
  } else {
    return x;
  }
}

function readyState(xhr) {
  return decodeReadyState(xhr.readyState);
}

export {
  Upload ,
  decodeReadyState ,
  readyState ,
  
}
/* No side effect */
