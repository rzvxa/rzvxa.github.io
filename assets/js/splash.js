class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = "!<>-_\\/[]{}—=+*^?#________";
    this.update = this.update.bind(this);
    this.random = utilities.RNG(Math.random());
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(this.random() * 40);
      const end = start + Math.floor(this.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = "";
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || this.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(this.random() * this.chars.length)];
  }
}

document.addEventListener("DOMContentLoaded", function (event) {
  window.scroll(0, 0);

  if (DEBUG) {
    const content = document.querySelector(".content");
    content.style.setProperty("--splash-duration", "0.5s");
    content.style.setProperty("--splash-logo-float", "0.38s");
    return;
  }

  document.body.style.overflow = "hidden";
  document.body.style.pointerEvents = "none";
});

window.addEventListener("load", function () {
  const content = document.querySelector(".content");

  setTimeout(() => {
    document.body.style.overflow = "auto";
    document.body.style.pointerEvents = "auto";
  }, 4000);

  const first = document.querySelector(".splash-logo-container > .first");
  const second = document.querySelector(".splash-logo-container > .second");
  const third = document.querySelector(".splash-logo-container > .third");

  const fx1 = new TextScramble(first);
  const fx2 = new TextScramble(second);
  const fx3 = new TextScramble(third);

  fx1.setText("Ali&nbsp;");
  fx2.setText("Rez");
  fx3.setText("vani");

  content.classList.add("splash-play");
});
