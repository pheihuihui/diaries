declare global {
    interface Window {
        gl_program: WebGLProgram
        g_last: number
    }
}

export function createShaderProgram(gl: WebGL2RenderingContext, vshader: string, fshader: string) {
    let vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader)
    let fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader)
    if (!vertexShader || !fragmentShader) {
        return null
    }

    let program = gl.createProgram()
    if (!program) {
        return null
    }

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)

    gl.linkProgram(program)
    let linked = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (!linked) {
        let error = gl.getProgramInfoLog(program)
        console.log('Failed to link program: ' + error)
        gl.deleteProgram(program)
        gl.deleteShader(fragmentShader)
        gl.deleteShader(vertexShader)
        return null
    }

    return program
}

export function loadShader(gl: WebGL2RenderingContext, type: number, source: string) {
    let shader = gl.createShader(type)
    if (shader == null) {
        console.log('unable to create shader')
        return null
    }

    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    let compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if (!compiled) {
        let error = gl.getShaderInfoLog(shader)
        console.log('Failed to compile shader: ' + error)
        gl.deleteShader(shader)
        return null
    }

    return shader
}

export function initShader(gl: WebGL2RenderingContext, vshader: string, fshader: string) {
    let program = createShaderProgram(gl, vshader, fshader)
    if (!program) {
        console.log('Failed to create program')
        return false
    }
    gl.useProgram(program)
    window.gl_program = program
    return true
}
