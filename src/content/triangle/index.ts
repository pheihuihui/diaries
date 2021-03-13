import { Matrix4 } from "../webgl_utils/matrix";
import { initShader } from "../webgl_utils/others"

const ANGLE_STEP = 45.0

function initVertexBuffers(gl: WebGL2RenderingContext) {
    let vertices = new Float32Array([0, 0.5, -0.5, -0.5, 0.5, -0.5])
    let n = 3

    let vertexBuffer = gl.createBuffer()
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object')
        return -1
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    let a_Position = gl.getAttribLocation(window.gl_program, 'a_Position')
    console.log(a_Position)
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position')
        return -1
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(a_Position)

    return n;
}

function draw(gl: WebGL2RenderingContext, n: number, currentAngle: number, modelMatrix: Matrix4, u_ModelMatrix: WebGLUniformLocation) {
    modelMatrix.setRotate(currentAngle, 0, 0, 1)
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, n)
}

function animate(angle: number) {
    let now = Date.now()
    let elapsed = now - window.g_last
    window.g_last = now
    let newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0
    return newAngle %= 360
}

Promise.all([fetch('./vs.glsl'), fetch('./fs.glsl')])
    .then(vals => {
        Promise.all([vals[0].text(), vals[1].text()])
            .then(shaders => {
                const VShader = shaders[0]
                const FShader = shaders[1]

                window.g_last = Date.now()

                let canv = document.createElement('canvas')
                document.body.appendChild(canv)
                canv.width = 800
                canv.height = 800
                let gl = canv.getContext('webgl2')

                if (gl) {
                    if (initShader(gl, VShader, FShader)) {
                        let n = initVertexBuffers(gl)
                        gl.clearColor(0.0, 0.0, 0.0, 1.0)
                        let u_ModelMatrix = gl.getUniformLocation(window.gl_program, 'u_ModelMatrix')
                        let currentAngle = 0.0
                        let modelMatrix = new Matrix4()
                        let tick = function () {
                            if (gl && u_ModelMatrix) {
                                currentAngle = animate(currentAngle)
                                draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix)
                                requestAnimationFrame(tick)
                            }
                        }
                        tick()
                    }
                }

            })
    })
