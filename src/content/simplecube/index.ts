import { Matrix4 } from "../webgl_utils/matrix"
import { initShader } from "../webgl_utils/others"

function initVertexBuffers(gl: WebGL2RenderingContext) {
    let vertices = new Float32Array([   // Vertex coordinates
        1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,    // v0-v1-v2-v3 front
        1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,    // v0-v3-v4-v5 right
        1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
        -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,    // v1-v6-v7-v2 left
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,    // v7-v4-v3-v2 down
        1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0     // v4-v7-v6-v5 back
    ])
    let colors = new Float32Array([     // Colors
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,  // v0-v1-v2-v3 front(white)
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,  // v0-v3-v4-v5 right(white)
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,  // v0-v5-v6-v1 up(white)
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,  // v1-v6-v7-v2 left(white)
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,  // v7-v4-v3-v2 down(white)
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0   // v4-v7-v6-v5 back(white)
    ])
    let indices = new Uint8Array([       // Indices of the vertices
        0, 1, 2, 0, 2, 3,    // front
        4, 5, 6, 4, 6, 7,    // right
        8, 9, 10, 8, 10, 11,    // up
        12, 13, 14, 12, 14, 15,    // left
        16, 17, 18, 16, 18, 19,    // down
        20, 21, 22, 20, 22, 23     // back
    ])

    let indexBuffer = gl.createBuffer()
    if (!indexBuffer) {
        return -1
    }
    if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position')) {
        return -1
    }
    if (!initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color')) {
        return -1
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

    return indices.length
}

function initArrayBuffer(gl: WebGL2RenderingContext, data: Float32Array, num: number, type: number, attribute: string) {
    // Create a buffer object
    var buffer = gl.createBuffer()
    if (!buffer) {
        console.log('Failed to create the buffer object')
        return false
    }
    // Write date into the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
    // Assign the buffer object to the attribute variable
    var a_attribute = gl.getAttribLocation(window.gl_program, attribute)
    if (a_attribute < 0) {
        console.log('Failed to get the storage location of ' + attribute)
        return false
    }
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0)
    // Enable the assignment of the buffer object to the attribute variable
    gl.enableVertexAttribArray(a_attribute)

    gl.bindBuffer(gl.ARRAY_BUFFER, null)

    return true;
}

Promise.all([fetch('./vs.vert'), fetch('./fs.frag')])
    .then(vals => {
        Promise.all([vals[0].text(), vals[1].text()])
            .then(shaders => {
                const VShader = shaders[0]
                const FShader = shaders[1]

                let canv = document.createElement('canvas')
                document.body.appendChild(canv)
                canv.width = 800
                canv.height = 800
                let gl = canv.getContext('webgl2')

                if (gl) {
                    if (initShader(gl, VShader, FShader)) {
                        let n = initVertexBuffers(gl)
                        gl.clearColor(0.0, 0.0, 0.0, 1.0)
                        gl.enable(gl.DEPTH_TEST)

                        let u_MvpMatrix = gl.getUniformLocation(window.gl_program, 'u_MvpMatrix')
                        if (!u_MvpMatrix) {
                            console.log('Failed to get the storage location of u_MvpMatrix')
                            return
                        }

                        let mvpMatrix = new Matrix4()
                        mvpMatrix.setPerspective(30, 1, 1, 100)
                        mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0)
                        gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)
                        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
                        gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0)
                    }
                }

            })
    })