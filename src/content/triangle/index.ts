const ANGLE_STEP = 45.0

function main() {
    let canv = document.createElement('canvas')
    document.appendChild(canv)
    let gl = canv.getContext('webgl2')
}

fetch('./vs.glsl')
    .then(x => x.text())
    .then(x => console.log(x))