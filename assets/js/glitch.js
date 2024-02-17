document.addEventListener("DOMContentLoaded", function () {
  // constants
  const COLOR = !DEBUG ? "#282828FF" : "red";
  const HEIGHT_RATIO = 1 / 6;
  const PIXEL_RATIO = 1 || window.devicePixelRatio || 1;
  const SCROLL_THREASHOLD = 0.01;
  const SCROLL_STEP = 0.35;
  const SCROLL_SPEED = 0.35;

  // helper functions
  const abs = Math.abs;
  const round = Math.round;
  const floor = Math.floor;
  const random = utilities.RNG(Math.random());
  const shuffleArray = utilities.shuffleArray;
  const closestDivisibleCeil = utilities.closestDivisibleCeil;

  const winHeight = function () {
    return (
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight
    );
  };

  const getScrollTop = function () {
    return window.scrollY || window.pageYOffset || 1;
  };

  const getUnit = (function () {
    const element = document.querySelector(".glitch-measure");
    return function () {
      return {
        width: element.getBoundingClientRect().width,
        height: element.offsetHeight,
      };
    };
  })();

  const selectCanvas = function (query) {
    const element = document.querySelector(query);
    const context = element.getContext("2d");
    return [element, context];
  };

  const generateTileset = function () {
    const unit = getUnit();
    const tileset = [];

    [
      [2, 8],
      [5, 10],
      [13, 7],
      [0, 0],
    ].map(function (bit, index, set) {
      const canvas = document.createElement("canvas");
      canvas.width = unit.width * PIXEL_RATIO;
      canvas.height = unit.height * PIXEL_RATIO;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = COLOR;

      if (index === set.length - 1) {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        const w = (unit.width / 8) * PIXEL_RATIO;
        for (let y = 0; y < canvas.height / w; ++y) {
          for (let x = 0; x < canvas.width / w; ++x) {
            if (bit[y % 2] & (1 << x % 4)) {
              ctx.fillRect(x * w, y * w, w, w);
            }
          }
        }
      }
      tileset.push(canvas);
    });

    return tileset;
  };

  const generateBuffers = function (len, size) {
    let result = new Array(len);

    for (let i = 0; i < len; ++i) {
      result[i] = new Array(size);
      for (let j = 0; j < size; ++j) {
        result[i][j] = j;
      }
    }
    result = result.map((arr) => {
      return arr.sort(function () {
        return random() - 0.5;
      });
    });
    result = shuffleArray(result);
    return result;
  };

  // immutable variables
  const content = document.querySelector(".content");
  const [head, headCtx] = selectCanvas(".glitch-canvas.head");
  const [tail, tailCtx] = selectCanvas(".glitch-canvas.tail");

  // mutable variables
  let tileset = generateTileset();
  let buffers = [];
  let scrollTop = getScrollTop();
  let scrollVal = scrollTop;
  let unit = null;
  let canvasWidth = 0;
  let canvasHeight = 0;
  let gridx = 0;
  let gridy = 0;
  let animating = false;

  const measure = function () {
    const newUnit = getUnit();
    if (
      unit &&
      unit.width === newUnit.width &&
      unit.height === newUnit.height
    ) {
      return;
    }

    unit = newUnit;
    const contentWidth = content.offsetWidth;

    canvasWidth = closestDivisibleCeil(contentWidth, unit.width);
    canvasHeight = closestDivisibleCeil(
      winHeight() * HEIGHT_RATIO,
      unit.height
    );

    gridx = floor(canvasWidth / unit.width);
    gridy = floor(canvasHeight / unit.height);

    tileset = generateTileset();
    buffers = generateBuffers(gridy, gridx);
  };

  const onResize = function () {
    measure();

    [head, tail].forEach(function (self) {
      self.height = canvasHeight;
      self.width = canvasWidth;
    });

    update();
  };

  const update = function () {
    if (animating) {
      return;
    }

    animating = true;
    render();
  };

  const onScroll = function () {
    scrollTop = getScrollTop();
    measure();
    update();
  };

  const render = function () {
    const n = (scrollTop - scrollVal) * SCROLL_STEP;
    scrollVal = scrollVal + n;
    draw(scrollVal, headCtx);
    draw(scrollVal, tailCtx, true);
    if (abs(n) <= SCROLL_THREASHOLD) {
      animating = false;
    } else {
      window.requestAnimationFrame(render);
    }
  };

  const draw = function (dy, ctx, inverse) {
    dy = dy * SCROLL_SPEED;
    const unit = getUnit();
    const scale = unit.width;
    const size = canvasWidth / unit.width;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const height = gridy;
    let width = floor((dy * PIXEL_RATIO) / scale);
    if (width < 0) {
      width = 0;
    }

    const len = inverse ? floor(width / height + 1) * height - width : width;
    const sliderHeight = inverse ? -1 : 1;
    const x = inverse ? 0 : 1;
    const caveWidth = 8;
    const diff = 3;
    const offset = (dy * PIXEL_RATIO) % scale;
    for (let y = 0; y < gridy; y++) {
      const h =
        (-diff + y + x) / (height - diff) -
        (offset / scale / (height - diff)) * sliderHeight;
      for (let i = 0; i < gridx; i++) {
        const w = buffers[(y + len) % height][i];
        if (w / size > h) {
          const top = w / size - h;
          const min = 0;
          const max = 3;
          const value = floor(4 * top * caveWidth);
          const tag = value < min ? min : value > max ? max : value;
          let py = y * unit.height;
          if (inverse) {
            py = canvasHeight - py;
          }
          ctx.drawImage(
            tileset[tag],
            round(i * unit.width),
            round(py - offset)
          );
        }
      }
    }
  };

  // attach event listeners
  // for really slow connections such as GPRS we need to check size after font being loaded.
  window.addEventListener("load", onResize);
  window.addEventListener("resize", onResize);
  window.addEventListener("scroll", onScroll);

  // call events manually to setup initial state.
  window.requestAnimationFrame(onResize);
  window.requestAnimationFrame(onScroll);
});
