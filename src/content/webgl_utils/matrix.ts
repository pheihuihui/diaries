export class Matrix4 {
    elements: Float32Array

    printElements() {
        [0, 1, 2, 3].forEach(v => {
            let line = [v, v + 4, v + 8, v + 12].map(u => this.elements[u])
            console.log(line)
        })
    }

    constructor(matrix?: number[]) {
        if (matrix) {
            let arr = new Float32Array(matrix)
            this.elements = arr
        } else {
            this.elements = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
        }
    }

    setIdentity() {
        let e = this.elements
        e[0] = 1; e[4] = 0; e[8] = 0; e[12] = 0;
        e[1] = 0; e[5] = 1; e[9] = 0; e[13] = 0;
        e[2] = 0; e[6] = 0; e[10] = 1; e[14] = 0;
        e[3] = 0; e[7] = 0; e[11] = 0; e[15] = 1;
        return this
    }

    set(src: Matrix4) {
        let s = src.elements
        let d = this.elements
        if (s == d) {
            return
        }
        for (let i = 0; i < 16; i++) {
            d[i] = s[i]
        }
        return this
    }

    concat(other: Matrix4) {
        // Calculate e = a * b
        let e = this.elements
        let a = this.elements
        let b = other.elements

        // If e equals b, copy b to temporary matrix.
        if (e == b) {
            b = new Float32Array(16)
            for (let i = 0; i < 16; i++) {
                b[i] = e[i]
            }
        }

        for (let i = 0; i < 4; i++) {
            let ai0 = a[i]; let ai1 = a[i + 4]; let ai2 = a[i + 8]; let ai3 = a[i + 12];
            e[i] = ai0 * b[0] + ai1 * b[1] + ai2 * b[2] + ai3 * b[3];
            e[i + 4] = ai0 * b[4] + ai1 * b[5] + ai2 * b[6] + ai3 * b[7];
            e[i + 8] = ai0 * b[8] + ai1 * b[9] + ai2 * b[10] + ai3 * b[11];
            e[i + 12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
        }

        return this
    }

    multiply(other: Matrix4) {
        this.concat(other)
    }

    multiplyVector3(pos: Vector3) {
        let e = this.elements
        let p = pos.elements
        let v = new Vector3()
        let result = v.elements

        result[0] = p[0] * e[0] + p[1] * e[4] + p[2] * e[8] + e[11]
        result[1] = p[0] * e[1] + p[1] * e[5] + p[2] * e[9] + e[12]
        result[2] = p[0] * e[2] + p[1] * e[6] + p[2] * e[10] + e[13]

        return v
    }

    multiplyVector4(pos: Vector4) {
        let e = this.elements
        let p = pos.elements
        let v = new Vector4()
        let result = v.elements

        result[0] = p[0] * e[0] + p[1] * e[4] + p[2] * e[8] + p[3] * e[12]
        result[1] = p[0] * e[1] + p[1] * e[5] + p[2] * e[9] + p[3] * e[13]
        result[2] = p[0] * e[2] + p[1] * e[6] + p[2] * e[10] + p[3] * e[14]
        result[3] = p[0] * e[3] + p[1] * e[7] + p[2] * e[11] + p[3] * e[15]

        return v
    }

    transpose() {

        let e = this.elements

        let t = e[1]; e[1] = e[4]; e[4] = t;
        t = e[2]; e[2] = e[8]; e[8] = t;
        t = e[3]; e[3] = e[12]; e[12] = t;
        t = e[6]; e[6] = e[9]; e[9] = t;
        t = e[7]; e[7] = e[13]; e[13] = t;
        t = e[11]; e[11] = e[14]; e[14] = t;

        return this
    }

    setInverseOf(other: Matrix4) {

        let s = other.elements
        let d = this.elements
        let inv = new Float32Array(16)

        inv[0] = s[5] * s[10] * s[15] - s[5] * s[11] * s[14] - s[9] * s[6] * s[15] + s[9] * s[7] * s[14] + s[13] * s[6] * s[11] - s[13] * s[7] * s[10]
        inv[4] = - s[4] * s[10] * s[15] + s[4] * s[11] * s[14] + s[8] * s[6] * s[15] - s[8] * s[7] * s[14] - s[12] * s[6] * s[11] + s[12] * s[7] * s[10]
        inv[8] = s[4] * s[9] * s[15] - s[4] * s[11] * s[13] - s[8] * s[5] * s[15] + s[8] * s[7] * s[13] + s[12] * s[5] * s[11] - s[12] * s[7] * s[9]
        inv[12] = - s[4] * s[9] * s[14] + s[4] * s[10] * s[13] + s[8] * s[5] * s[14] - s[8] * s[6] * s[13] - s[12] * s[5] * s[10] + s[12] * s[6] * s[9]

        inv[1] = - s[1] * s[10] * s[15] + s[1] * s[11] * s[14] + s[9] * s[2] * s[15] - s[9] * s[3] * s[14] - s[13] * s[2] * s[11] + s[13] * s[3] * s[10]
        inv[5] = s[0] * s[10] * s[15] - s[0] * s[11] * s[14] - s[8] * s[2] * s[15] + s[8] * s[3] * s[14] + s[12] * s[2] * s[11] - s[12] * s[3] * s[10]
        inv[9] = - s[0] * s[9] * s[15] + s[0] * s[11] * s[13] + s[8] * s[1] * s[15] - s[8] * s[3] * s[13] - s[12] * s[1] * s[11] + s[12] * s[3] * s[9]
        inv[13] = s[0] * s[9] * s[14] - s[0] * s[10] * s[13] - s[8] * s[1] * s[14] + s[8] * s[2] * s[13] + s[12] * s[1] * s[10] - s[12] * s[2] * s[9]

        inv[2] = s[1] * s[6] * s[15] - s[1] * s[7] * s[14] - s[5] * s[2] * s[15] + s[5] * s[3] * s[14] + s[13] * s[2] * s[7] - s[13] * s[3] * s[6]
        inv[6] = - s[0] * s[6] * s[15] + s[0] * s[7] * s[14] + s[4] * s[2] * s[15] - s[4] * s[3] * s[14] - s[12] * s[2] * s[7] + s[12] * s[3] * s[6]
        inv[10] = s[0] * s[5] * s[15] - s[0] * s[7] * s[13] - s[4] * s[1] * s[15] + s[4] * s[3] * s[13] + s[12] * s[1] * s[7] - s[12] * s[3] * s[5]
        inv[14] = - s[0] * s[5] * s[14] + s[0] * s[6] * s[13] + s[4] * s[1] * s[14] - s[4] * s[2] * s[13] - s[12] * s[1] * s[6] + s[12] * s[2] * s[5]

        inv[3] = - s[1] * s[6] * s[11] + s[1] * s[7] * s[10] + s[5] * s[2] * s[11] - s[5] * s[3] * s[10] - s[9] * s[2] * s[7] + s[9] * s[3] * s[6]
        inv[7] = s[0] * s[6] * s[11] - s[0] * s[7] * s[10] - s[4] * s[2] * s[11] + s[4] * s[3] * s[10] + s[8] * s[2] * s[7] - s[8] * s[3] * s[6]
        inv[11] = - s[0] * s[5] * s[11] + s[0] * s[7] * s[9] + s[4] * s[1] * s[11] - s[4] * s[3] * s[9] - s[8] * s[1] * s[7] + s[8] * s[3] * s[5]
        inv[15] = s[0] * s[5] * s[10] - s[0] * s[6] * s[9] - s[4] * s[1] * s[10] + s[4] * s[2] * s[9] + s[8] * s[1] * s[6] - s[8] * s[2] * s[5]

        let det = s[0] * inv[0] + s[1] * inv[4] + s[2] * inv[8] + s[3] * inv[12]
        if (det == 0) {
            return this
        }

        det = 1 / det
        for (let i = 0; i < 16; i++) {
            d[i] = inv[i] * det
        }

        return this
    }

    invert() {
        return this.setInverseOf(this)
    }

    setOrtho(left: number, right: number, bottom: number, top: number, near: number, far: number) {

        if (left == right || bottom == top || near == far) {
            throw 'null frustum'
        }

        let rw = 1 / (right - left)
        let rh = 1 / (top - bottom)
        let rd = 1 / (far - near)

        let e = this.elements

        e[0] = 2 * rw
        e[1] = 0
        e[2] = 0
        e[3] = 0

        e[4] = 0
        e[5] = 2 * rh
        e[6] = 0
        e[7] = 0

        e[8] = 0
        e[9] = 0
        e[10] = -2 * rd
        e[11] = 0

        e[12] = -(right + left) * rw
        e[13] = -(top + bottom) * rh
        e[14] = -(far + near) * rd
        e[15] = 1

        return this
    }

    ortho(left: number, right: number, bottom: number, top: number, near: number, far: number) {
        return this.concat(new Matrix4().setOrtho(left, right, bottom, top, near, far))
    }

    setFrustum(left: number, right: number, bottom: number, top: number, near: number, far: number) {

        if (left == right || top == bottom || near == far) {
            throw 'null frustum'
        }
        if (near <= 0) {
            throw 'near <= 0'
        }
        if (far <= 0) {
            throw 'far <= 0'
        }

        let rw = 1 / (right - left)
        let rh = 1 / (top - bottom)
        let rd = 1 / (far - near)

        let e = this.elements

        e[0] = 2 * near * rw
        e[1] = 0
        e[2] = 0
        e[3] = 0

        e[4] = 0
        e[5] = 2 * near * rh
        e[6] = 0
        e[7] = 0

        e[8] = (right + left) * rw
        e[9] = (top + bottom) * rh
        e[10] = -(far + near) * rd
        e[11] = -1

        e[12] = 0
        e[13] = 0
        e[14] = -2 * near * far * rd
        e[15] = 0

        return this
    }

    frustum(left: number, right: number, bottom: number, top: number, near: number, far: number) {
        return this.concat(new Matrix4().setFrustum(left, right, bottom, top, near, far))
    }

    setPerspective(fovy: number, aspect: number, near: number, far: number) {

        if (near == far || aspect == 0) {
            throw 'null frustum'
        }
        if (near <= 0) {
            throw 'near <= 0'
        }
        if (far <= 0) {
            throw 'far <= 0'
        }

        fovy = Math.PI * fovy / 180 / 2
        let s = Math.sin(fovy)
        if (s == 0) {
            throw 'null frustum'
        }

        let rd = 1 / (far - near)
        let ct = Math.cos(fovy) / s

        let e = this.elements

        e[0] = ct / aspect
        e[1] = 0
        e[2] = 0
        e[3] = 0

        e[4] = 0
        e[5] = ct
        e[6] = 0
        e[7] = 0

        e[8] = 0
        e[9] = 0
        e[10] = -(far + near) * rd
        e[11] = -1

        e[12] = 0
        e[13] = 0
        e[14] = -2 * near * far * rd
        e[15] = 0

        return this
    }

    perspective(fovy: number, aspect: number, near: number, far: number) {
        return this.concat(new Matrix4().setPerspective(fovy, aspect, near, far))
    }

    setScale(x: number, y: number, z: number) {
        let e = this.elements
        e[0] = x; e[4] = 0; e[8] = 0; e[12] = 0;
        e[1] = 0; e[5] = y; e[9] = 0; e[13] = 0;
        e[2] = 0; e[6] = 0; e[10] = z; e[14] = 0;
        e[3] = 0; e[7] = 0; e[11] = 0; e[15] = 1;
        return this
    }

    scale(x: number, y: number, z: number) {
        let e = this.elements
        e[0] *= x; e[4] *= y; e[8] *= z;
        e[1] *= x; e[5] *= y; e[9] *= z;
        e[2] *= x; e[6] *= y; e[10] *= z;
        e[3] *= x; e[7] *= y; e[11] *= z;
        return this
    }

    setTranslate(x: number, y: number, z: number) {
        let e = this.elements
        e[0] = 1; e[4] = 0; e[8] = 0; e[12] = x;
        e[1] = 0; e[5] = 1; e[9] = 0; e[13] = y;
        e[2] = 0; e[6] = 0; e[10] = 1; e[14] = z;
        e[3] = 0; e[7] = 0; e[11] = 0; e[15] = 1;
        return this
    }

    translate(x: number, y: number, z: number) {
        let e = this.elements
        e[12] += e[0] * x + e[4] * y + e[8] * z;
        e[13] += e[1] * x + e[5] * y + e[9] * z;
        e[14] += e[2] * x + e[6] * y + e[10] * z;
        e[15] += e[3] * x + e[7] * y + e[11] * z;
        return this
    }

    setRotate(angle: number, x: number, y: number, z: number) {

        angle = Math.PI * angle / 180
        let e = this.elements

        let s = Math.sin(angle)
        let c = Math.cos(angle)

        if (0 != x && 0 == y && 0 == z) {
            // Rotation around X axis
            if (x < 0) {
                s = -s
            }
            e[0] = 1; e[4] = 0; e[8] = 0; e[12] = 0;
            e[1] = 0; e[5] = c; e[9] = -s; e[13] = 0;
            e[2] = 0; e[6] = s; e[10] = c; e[14] = 0;
            e[3] = 0; e[7] = 0; e[11] = 0; e[15] = 1;
        } else if (0 == x && 0 != y && 0 == z) {
            // Rotation around Y axis
            if (y < 0) {
                s = -s
            }
            e[0] = c; e[4] = 0; e[8] = s; e[12] = 0;
            e[1] = 0; e[5] = 1; e[9] = 0; e[13] = 0;
            e[2] = -s; e[6] = 0; e[10] = c; e[14] = 0;
            e[3] = 0; e[7] = 0; e[11] = 0; e[15] = 1;
        } else if (0 == x && 0 == y && 0 != z) {
            // Rotation around Z axis
            if (z < 0) {
                s = -s
            }
            e[0] = c; e[4] = -s; e[8] = 0; e[12] = 0;
            e[1] = s; e[5] = c; e[9] = 0; e[13] = 0;
            e[2] = 0; e[6] = 0; e[10] = 1; e[14] = 0;
            e[3] = 0; e[7] = 0; e[11] = 0; e[15] = 1;
        } else {
            // Rotation around another axis
            let len = Math.sqrt(x * x + y * y + z * z)
            if (len != 1) {
                let rlen = 1 / len
                x *= rlen
                y *= rlen
                z *= rlen
            }
            let nc = 1 - c
            let xy = x * y
            let yz = y * z
            let zx = z * x
            let xs = x * s
            let ys = y * s
            let zs = z * s

            e[0] = x * x * nc + c
            e[1] = xy * nc + zs
            e[2] = zx * nc - ys
            e[3] = 0

            e[4] = xy * nc - zs
            e[5] = y * y * nc + c
            e[6] = yz * nc + xs
            e[7] = 0

            e[8] = zx * nc + ys
            e[9] = yz * nc - xs
            e[10] = z * z * nc + c
            e[11] = 0

            e[12] = 0
            e[13] = 0
            e[14] = 0
            e[15] = 1
        }

        return this
    }

    rotate(angle: number, x: number, y: number, z: number) {
        return this.concat(new Matrix4().setRotate(angle, x, y, z))
    }

    setLookAt(eyeX: number, eyeY: number, eyeZ: number, centerX: number, centerY: number, centerZ: number, upX: number, upY: number, upZ: number) {

        let fx = centerX - eyeX
        let fy = centerY - eyeY
        let fz = centerZ - eyeZ

        // Normalize f.
        let rlf = 1 / Math.sqrt(fx * fx + fy * fy + fz * fz)
        fx *= rlf
        fy *= rlf
        fz *= rlf

        // Calculate cross product of f and up.
        let sx = fy * upZ - fz * upY
        let sy = fz * upX - fx * upZ
        let sz = fx * upY - fy * upX

        // Normalize s.
        let rls = 1 / Math.sqrt(sx * sx + sy * sy + sz * sz)
        sx *= rls
        sy *= rls
        sz *= rls

        // Calculate cross product of s and f.
        let ux = sy * fz - sz * fy
        let uy = sz * fx - sx * fz
        let uz = sx * fy - sy * fx

        // Set to this.
        let e = this.elements;
        e[0] = sx
        e[1] = ux
        e[2] = -fx
        e[3] = 0

        e[4] = sy
        e[5] = uy
        e[6] = -fy
        e[7] = 0

        e[8] = sz
        e[9] = uz
        e[10] = -fz
        e[11] = 0

        e[12] = 0
        e[13] = 0
        e[14] = 0
        e[15] = 1

        // Translate.
        return this.translate(-eyeX, -eyeY, -eyeZ)
    }

    lookAt(eyeX: number, eyeY: number, eyeZ: number, centerX: number, centerY: number, centerZ: number, upX: number, upY: number, upZ: number) {
        return this.concat(new Matrix4().setLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ))
    }

    dropShadow(plane: number[], light: number[]) {
        let mat = new Matrix4()
        let e = mat.elements

        let dot = plane[0] * light[0] + plane[1] * light[1] + plane[2] * light[2] + plane[3] * light[3]

        e[0] = dot - light[0] * plane[0]
        e[1] = - light[1] * plane[0]
        e[2] = - light[2] * plane[0]
        e[3] = - light[3] * plane[0]

        e[4] = - light[0] * plane[1]
        e[5] = dot - light[1] * plane[1]
        e[6] = - light[2] * plane[1]
        e[7] = - light[3] * plane[1]

        e[8] = - light[0] * plane[2]
        e[9] = - light[1] * plane[2]
        e[10] = dot - light[2] * plane[2]
        e[11] = - light[3] * plane[2]

        e[12] = - light[0] * plane[3]
        e[13] = - light[1] * plane[3]
        e[14] = - light[2] * plane[3]
        e[15] = dot - light[3] * plane[3]

        return this.concat(mat)
    }

    dropShadowDirectionally(normX: number, normY: number, normZ: number, planeX: number, planeY: number, planeZ: number, lightX: number, lightY: number, lightZ: number) {
        let a = planeX * normX + planeY * normY + planeZ * normZ
        return this.dropShadow([normX, normY, normZ, -a], [lightX, lightY, lightZ, 0])
    }
}

export class Vector3 {
    elements: Float32Array

    constructor(vec3?: number[]) {
        let eles = new Float32Array(3)
        if (vec3) {
            eles = new Float32Array(vec3)
        }
        this.elements = eles
    }

    normalize() {
        let v = this.elements
        let c = v[0], d = v[1], e = v[2], g = Math.sqrt(c * c + d * d + e * e)
        if (g) {
            if (g == 1)
                return this
        } else {
            v[0] = 0; v[1] = 0; v[2] = 0
            return this
        }
        g = 1 / g
        v[0] = c * g; v[1] = d * g; v[2] = e * g
        return this
    }
}

export class Vector4 {
    elements: Float32Array
    constructor(vec4?: number[]) {
        let eles = new Float32Array(4)
        if (vec4) {
            eles = new Float32Array(vec4)
        }
        this.elements = eles
    }
}