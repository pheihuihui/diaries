(() => {
  // src/content/triangle/index.ts
  fetch("./vs.glsl").then((x) => x.text()).then((x) => console.log(x));
})();
