const BIT_MASK = 0xffffffff;
const utilities = {
  RNG: function (seed) {
    let a = (123456789 + seed) & BIT_MASK;
    let b = (987654321 - seed) & BIT_MASK;
    // Returns number between 0 (inclusive) and 1.0 (exclusive),
    return function () {
      b = (36969 * (b & 65535) + (b >> 16)) & BIT_MASK;
      a = (18000 * (a & 65535) + (a >> 16)) & BIT_MASK;
      let next = ((b << 16) + (a & 65535)) >>> 0;
      next /= 4294967296;
      return next;
    };
  },
  closestDivisibleCeil: function (num, div) {
    return num + div - (num % div);
  },
  shuffleArray: function (arr) {
    var t = arr.length;
    for (; t; ) {
      const i = (Math.random() * t--) >>> 0;
      const tmp = arr[i];
      arr[i] = arr[t];
      arr[t] = tmp;
    }
    return arr;
  },
  clamp: function (value, min, max) {
    if (value > max) {
      return max;
    } else if (value < min) {
      return min;
    } else {
      return value;
    }
  },
  remap: function (value, oldMin, oldMax, newMin, newMax) {
    return newMin + ((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin);
  },
};
