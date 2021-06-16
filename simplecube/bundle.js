(() => {
  // src/content/webgl_utils/matrix.ts
  var Matrix4 = class {
    printElements() {
      [0, 1, 2, 3].forEach((v) => {
        let line = [v, v + 4, v + 8, v + 12].map((u) => this.elements[u]);
        console.log(line);
      });
    }
    constructor(matrix) {
      if (matrix) {
        let arr = new Float32Array(matrix);
        this.elements = arr;
      } else {
        this.elements = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
      }
    }
    setIdentity() {
      let e = this.elements;
      e[0] = 1;
      e[4] = 0;
      e[8] = 0;
      e[12] = 0;
      e[1] = 0;
      e[5] = 1;
      e[9] = 0;
      e[13] = 0;
      e[2] = 0;
      e[6] = 0;
      e[10] = 1;
      e[14] = 0;
      e[3] = 0;
      e[7] = 0;
      e[11] = 0;
      e[15] = 1;
      return this;
    }
    set(src) {
      let s = src.elements;
      let d = this.elements;
      if (s == d) {
        return;
      }
      for (let i = 0; i < 16; i++) {
        d[i] = s[i];
      }
      return this;
    }
    concat(other) {
      let e = this.elements;
      let a = this.elements;
      let b = other.elements;
      if (e == b) {
        b = new Float32Array(16);
        for (let i = 0; i < 16; i++) {
          b[i] = e[i];
        }
      }
      for (let i = 0; i < 4; i++) {
        let ai0 = a[i];
        let ai1 = a[i + 4];
        let ai2 = a[i + 8];
        let ai3 = a[i + 12];
        e[i] = ai0 * b[0] + ai1 * b[1] + ai2 * b[2] + ai3 * b[3];
        e[i + 4] = ai0 * b[4] + ai1 * b[5] + ai2 * b[6] + ai3 * b[7];
        e[i + 8] = ai0 * b[8] + ai1 * b[9] + ai2 * b[10] + ai3 * b[11];
        e[i + 12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
      }
      return this;
    }
    multiply(other) {
      this.concat(other);
    }
    multiplyVector3(pos) {
      let e = this.elements;
      let p = pos.elements;
      let v = new Vector3();
      let result = v.elements;
      result[0] = p[0] * e[0] + p[1] * e[4] + p[2] * e[8] + e[11];
      result[1] = p[0] * e[1] + p[1] * e[5] + p[2] * e[9] + e[12];
      result[2] = p[0] * e[2] + p[1] * e[6] + p[2] * e[10] + e[13];
      return v;
    }
    multiplyVector4(pos) {
      let e = this.elements;
      let p = pos.elements;
      let v = new Vector4();
      let result = v.elements;
      result[0] = p[0] * e[0] + p[1] * e[4] + p[2] * e[8] + p[3] * e[12];
      result[1] = p[0] * e[1] + p[1] * e[5] + p[2] * e[9] + p[3] * e[13];
      result[2] = p[0] * e[2] + p[1] * e[6] + p[2] * e[10] + p[3] * e[14];
      result[3] = p[0] * e[3] + p[1] * e[7] + p[2] * e[11] + p[3] * e[15];
      return v;
    }
    transpose() {
      let e = this.elements;
      let t = e[1];
      e[1] = e[4];
      e[4] = t;
      t = e[2];
      e[2] = e[8];
      e[8] = t;
      t = e[3];
      e[3] = e[12];
      e[12] = t;
      t = e[6];
      e[6] = e[9];
      e[9] = t;
      t = e[7];
      e[7] = e[13];
      e[13] = t;
      t = e[11];
      e[11] = e[14];
      e[14] = t;
      return this;
    }
    setInverseOf(other) {
      let s = other.elements;
      let d = this.elements;
      let inv = new Float32Array(16);
      inv[0] = s[5] * s[10] * s[15] - s[5] * s[11] * s[14] - s[9] * s[6] * s[15] + s[9] * s[7] * s[14] + s[13] * s[6] * s[11] - s[13] * s[7] * s[10];
      inv[4] = -s[4] * s[10] * s[15] + s[4] * s[11] * s[14] + s[8] * s[6] * s[15] - s[8] * s[7] * s[14] - s[12] * s[6] * s[11] + s[12] * s[7] * s[10];
      inv[8] = s[4] * s[9] * s[15] - s[4] * s[11] * s[13] - s[8] * s[5] * s[15] + s[8] * s[7] * s[13] + s[12] * s[5] * s[11] - s[12] * s[7] * s[9];
      inv[12] = -s[4] * s[9] * s[14] + s[4] * s[10] * s[13] + s[8] * s[5] * s[14] - s[8] * s[6] * s[13] - s[12] * s[5] * s[10] + s[12] * s[6] * s[9];
      inv[1] = -s[1] * s[10] * s[15] + s[1] * s[11] * s[14] + s[9] * s[2] * s[15] - s[9] * s[3] * s[14] - s[13] * s[2] * s[11] + s[13] * s[3] * s[10];
      inv[5] = s[0] * s[10] * s[15] - s[0] * s[11] * s[14] - s[8] * s[2] * s[15] + s[8] * s[3] * s[14] + s[12] * s[2] * s[11] - s[12] * s[3] * s[10];
      inv[9] = -s[0] * s[9] * s[15] + s[0] * s[11] * s[13] + s[8] * s[1] * s[15] - s[8] * s[3] * s[13] - s[12] * s[1] * s[11] + s[12] * s[3] * s[9];
      inv[13] = s[0] * s[9] * s[14] - s[0] * s[10] * s[13] - s[8] * s[1] * s[14] + s[8] * s[2] * s[13] + s[12] * s[1] * s[10] - s[12] * s[2] * s[9];
      inv[2] = s[1] * s[6] * s[15] - s[1] * s[7] * s[14] - s[5] * s[2] * s[15] + s[5] * s[3] * s[14] + s[13] * s[2] * s[7] - s[13] * s[3] * s[6];
      inv[6] = -s[0] * s[6] * s[15] + s[0] * s[7] * s[14] + s[4] * s[2] * s[15] - s[4] * s[3] * s[14] - s[12] * s[2] * s[7] + s[12] * s[3] * s[6];
      inv[10] = s[0] * s[5] * s[15] - s[0] * s[7] * s[13] - s[4] * s[1] * s[15] + s[4] * s[3] * s[13] + s[12] * s[1] * s[7] - s[12] * s[3] * s[5];
      inv[14] = -s[0] * s[5] * s[14] + s[0] * s[6] * s[13] + s[4] * s[1] * s[14] - s[4] * s[2] * s[13] - s[12] * s[1] * s[6] + s[12] * s[2] * s[5];
      inv[3] = -s[1] * s[6] * s[11] + s[1] * s[7] * s[10] + s[5] * s[2] * s[11] - s[5] * s[3] * s[10] - s[9] * s[2] * s[7] + s[9] * s[3] * s[6];
      inv[7] = s[0] * s[6] * s[11] - s[0] * s[7] * s[10] - s[4] * s[2] * s[11] + s[4] * s[3] * s[10] + s[8] * s[2] * s[7] - s[8] * s[3] * s[6];
      inv[11] = -s[0] * s[5] * s[11] + s[0] * s[7] * s[9] + s[4] * s[1] * s[11] - s[4] * s[3] * s[9] - s[8] * s[1] * s[7] + s[8] * s[3] * s[5];
      inv[15] = s[0] * s[5] * s[10] - s[0] * s[6] * s[9] - s[4] * s[1] * s[10] + s[4] * s[2] * s[9] + s[8] * s[1] * s[6] - s[8] * s[2] * s[5];
      let det = s[0] * inv[0] + s[1] * inv[4] + s[2] * inv[8] + s[3] * inv[12];
      if (det == 0) {
        return this;
      }
      det = 1 / det;
      for (let i = 0; i < 16; i++) {
        d[i] = inv[i] * det;
      }
      return this;
    }
    invert() {
      return this.setInverseOf(this);
    }
    setOrtho(left, right, bottom, top, near, far) {
      if (left == right || bottom == top || near == far) {
        throw "null frustum";
      }
      let rw = 1 / (right - left);
      let rh = 1 / (top - bottom);
      let rd = 1 / (far - near);
      let e = this.elements;
      e[0] = 2 * rw;
      e[1] = 0;
      e[2] = 0;
      e[3] = 0;
      e[4] = 0;
      e[5] = 2 * rh;
      e[6] = 0;
      e[7] = 0;
      e[8] = 0;
      e[9] = 0;
      e[10] = -2 * rd;
      e[11] = 0;
      e[12] = -(right + left) * rw;
      e[13] = -(top + bottom) * rh;
      e[14] = -(far + near) * rd;
      e[15] = 1;
      return this;
    }
    ortho(left, right, bottom, top, near, far) {
      return this.concat(new Matrix4().setOrtho(left, right, bottom, top, near, far));
    }
    setFrustum(left, right, bottom, top, near, far) {
      if (left == right || top == bottom || near == far) {
        throw "null frustum";
      }
      if (near <= 0) {
        throw "near <= 0";
      }
      if (far <= 0) {
        throw "far <= 0";
      }
      let rw = 1 / (right - left);
      let rh = 1 / (top - bottom);
      let rd = 1 / (far - near);
      let e = this.elements;
      e[0] = 2 * near * rw;
      e[1] = 0;
      e[2] = 0;
      e[3] = 0;
      e[4] = 0;
      e[5] = 2 * near * rh;
      e[6] = 0;
      e[7] = 0;
      e[8] = (right + left) * rw;
      e[9] = (top + bottom) * rh;
      e[10] = -(far + near) * rd;
      e[11] = -1;
      e[12] = 0;
      e[13] = 0;
      e[14] = -2 * near * far * rd;
      e[15] = 0;
      return this;
    }
    frustum(left, right, bottom, top, near, far) {
      return this.concat(new Matrix4().setFrustum(left, right, bottom, top, near, far));
    }
    setPerspective(fovy, aspect, near, far) {
      if (near == far || aspect == 0) {
        throw "null frustum";
      }
      if (near <= 0) {
        throw "near <= 0";
      }
      if (far <= 0) {
        throw "far <= 0";
      }
      fovy = Math.PI * fovy / 180 / 2;
      let s = Math.sin(fovy);
      if (s == 0) {
        throw "null frustum";
      }
      let rd = 1 / (far - near);
      let ct = Math.cos(fovy) / s;
      let e = this.elements;
      e[0] = ct / aspect;
      e[1] = 0;
      e[2] = 0;
      e[3] = 0;
      e[4] = 0;
      e[5] = ct;
      e[6] = 0;
      e[7] = 0;
      e[8] = 0;
      e[9] = 0;
      e[10] = -(far + near) * rd;
      e[11] = -1;
      e[12] = 0;
      e[13] = 0;
      e[14] = -2 * near * far * rd;
      e[15] = 0;
      return this;
    }
    perspective(fovy, aspect, near, far) {
      return this.concat(new Matrix4().setPerspective(fovy, aspect, near, far));
    }
    setScale(x, y, z) {
      let e = this.elements;
      e[0] = x;
      e[4] = 0;
      e[8] = 0;
      e[12] = 0;
      e[1] = 0;
      e[5] = y;
      e[9] = 0;
      e[13] = 0;
      e[2] = 0;
      e[6] = 0;
      e[10] = z;
      e[14] = 0;
      e[3] = 0;
      e[7] = 0;
      e[11] = 0;
      e[15] = 1;
      return this;
    }
    scale(x, y, z) {
      let e = this.elements;
      e[0] *= x;
      e[4] *= y;
      e[8] *= z;
      e[1] *= x;
      e[5] *= y;
      e[9] *= z;
      e[2] *= x;
      e[6] *= y;
      e[10] *= z;
      e[3] *= x;
      e[7] *= y;
      e[11] *= z;
      return this;
    }
    setTranslate(x, y, z) {
      let e = this.elements;
      e[0] = 1;
      e[4] = 0;
      e[8] = 0;
      e[12] = x;
      e[1] = 0;
      e[5] = 1;
      e[9] = 0;
      e[13] = y;
      e[2] = 0;
      e[6] = 0;
      e[10] = 1;
      e[14] = z;
      e[3] = 0;
      e[7] = 0;
      e[11] = 0;
      e[15] = 1;
      return this;
    }
    translate(x, y, z) {
      let e = this.elements;
      e[12] += e[0] * x + e[4] * y + e[8] * z;
      e[13] += e[1] * x + e[5] * y + e[9] * z;
      e[14] += e[2] * x + e[6] * y + e[10] * z;
      e[15] += e[3] * x + e[7] * y + e[11] * z;
      return this;
    }
    setRotate(angle, x, y, z) {
      angle = Math.PI * angle / 180;
      let e = this.elements;
      let s = Math.sin(angle);
      let c = Math.cos(angle);
      if (x != 0 && y == 0 && z == 0) {
        if (x < 0) {
          s = -s;
        }
        e[0] = 1;
        e[4] = 0;
        e[8] = 0;
        e[12] = 0;
        e[1] = 0;
        e[5] = c;
        e[9] = -s;
        e[13] = 0;
        e[2] = 0;
        e[6] = s;
        e[10] = c;
        e[14] = 0;
        e[3] = 0;
        e[7] = 0;
        e[11] = 0;
        e[15] = 1;
      } else if (x == 0 && y != 0 && z == 0) {
        if (y < 0) {
          s = -s;
        }
        e[0] = c;
        e[4] = 0;
        e[8] = s;
        e[12] = 0;
        e[1] = 0;
        e[5] = 1;
        e[9] = 0;
        e[13] = 0;
        e[2] = -s;
        e[6] = 0;
        e[10] = c;
        e[14] = 0;
        e[3] = 0;
        e[7] = 0;
        e[11] = 0;
        e[15] = 1;
      } else if (x == 0 && y == 0 && z != 0) {
        if (z < 0) {
          s = -s;
        }
        e[0] = c;
        e[4] = -s;
        e[8] = 0;
        e[12] = 0;
        e[1] = s;
        e[5] = c;
        e[9] = 0;
        e[13] = 0;
        e[2] = 0;
        e[6] = 0;
        e[10] = 1;
        e[14] = 0;
        e[3] = 0;
        e[7] = 0;
        e[11] = 0;
        e[15] = 1;
      } else {
        let len = Math.sqrt(x * x + y * y + z * z);
        if (len != 1) {
          let rlen = 1 / len;
          x *= rlen;
          y *= rlen;
          z *= rlen;
        }
        let nc = 1 - c;
        let xy = x * y;
        let yz = y * z;
        let zx = z * x;
        let xs = x * s;
        let ys = y * s;
        let zs = z * s;
        e[0] = x * x * nc + c;
        e[1] = xy * nc + zs;
        e[2] = zx * nc - ys;
        e[3] = 0;
        e[4] = xy * nc - zs;
        e[5] = y * y * nc + c;
        e[6] = yz * nc + xs;
        e[7] = 0;
        e[8] = zx * nc + ys;
        e[9] = yz * nc - xs;
        e[10] = z * z * nc + c;
        e[11] = 0;
        e[12] = 0;
        e[13] = 0;
        e[14] = 0;
        e[15] = 1;
      }
      return this;
    }
    rotate(angle, x, y, z) {
      return this.concat(new Matrix4().setRotate(angle, x, y, z));
    }
    setLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
      let fx = centerX - eyeX;
      let fy = centerY - eyeY;
      let fz = centerZ - eyeZ;
      let rlf = 1 / Math.sqrt(fx * fx + fy * fy + fz * fz);
      fx *= rlf;
      fy *= rlf;
      fz *= rlf;
      let sx = fy * upZ - fz * upY;
      let sy = fz * upX - fx * upZ;
      let sz = fx * upY - fy * upX;
      let rls = 1 / Math.sqrt(sx * sx + sy * sy + sz * sz);
      sx *= rls;
      sy *= rls;
      sz *= rls;
      let ux = sy * fz - sz * fy;
      let uy = sz * fx - sx * fz;
      let uz = sx * fy - sy * fx;
      let e = this.elements;
      e[0] = sx;
      e[1] = ux;
      e[2] = -fx;
      e[3] = 0;
      e[4] = sy;
      e[5] = uy;
      e[6] = -fy;
      e[7] = 0;
      e[8] = sz;
      e[9] = uz;
      e[10] = -fz;
      e[11] = 0;
      e[12] = 0;
      e[13] = 0;
      e[14] = 0;
      e[15] = 1;
      return this.translate(-eyeX, -eyeY, -eyeZ);
    }
    lookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
      return this.concat(new Matrix4().setLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ));
    }
    dropShadow(plane, light) {
      let mat = new Matrix4();
      let e = mat.elements;
      let dot = plane[0] * light[0] + plane[1] * light[1] + plane[2] * light[2] + plane[3] * light[3];
      e[0] = dot - light[0] * plane[0];
      e[1] = -light[1] * plane[0];
      e[2] = -light[2] * plane[0];
      e[3] = -light[3] * plane[0];
      e[4] = -light[0] * plane[1];
      e[5] = dot - light[1] * plane[1];
      e[6] = -light[2] * plane[1];
      e[7] = -light[3] * plane[1];
      e[8] = -light[0] * plane[2];
      e[9] = -light[1] * plane[2];
      e[10] = dot - light[2] * plane[2];
      e[11] = -light[3] * plane[2];
      e[12] = -light[0] * plane[3];
      e[13] = -light[1] * plane[3];
      e[14] = -light[2] * plane[3];
      e[15] = dot - light[3] * plane[3];
      return this.concat(mat);
    }
    dropShadowDirectionally(normX, normY, normZ, planeX, planeY, planeZ, lightX, lightY, lightZ) {
      let a = planeX * normX + planeY * normY + planeZ * normZ;
      return this.dropShadow([normX, normY, normZ, -a], [lightX, lightY, lightZ, 0]);
    }
  };
  var Vector3 = class {
    constructor(vec3) {
      let eles = new Float32Array(3);
      if (vec3) {
        eles = new Float32Array(vec3);
      }
      this.elements = eles;
    }
    normalize() {
      let v = this.elements;
      let c = v[0], d = v[1], e = v[2], g = Math.sqrt(c * c + d * d + e * e);
      if (g) {
        if (g == 1)
          return this;
      } else {
        v[0] = 0;
        v[1] = 0;
        v[2] = 0;
        return this;
      }
      g = 1 / g;
      v[0] = c * g;
      v[1] = d * g;
      v[2] = e * g;
      return this;
    }
  };
  var Vector4 = class {
    constructor(vec4) {
      let eles = new Float32Array(4);
      if (vec4) {
        eles = new Float32Array(vec4);
      }
      this.elements = eles;
    }
  };

  // src/content/webgl_utils/others.ts
  function createShaderProgram(gl, vshader, fshader) {
    let vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
    let fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
    if (!vertexShader || !fragmentShader) {
      return null;
    }
    let program = gl.createProgram();
    if (!program) {
      return null;
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    let linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
      let error = gl.getProgramInfoLog(program);
      console.log("Failed to link program: " + error);
      gl.deleteProgram(program);
      gl.deleteShader(fragmentShader);
      gl.deleteShader(vertexShader);
      return null;
    }
    return program;
  }
  function loadShader(gl, type, source) {
    let shader = gl.createShader(type);
    if (shader == null) {
      console.log("unable to create shader");
      return null;
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    let compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
      let error = gl.getShaderInfoLog(shader);
      console.log("Failed to compile shader: " + error);
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }
  function initShader(gl, vshader, fshader) {
    let program = createShaderProgram(gl, vshader, fshader);
    if (!program) {
      console.log("Failed to create program");
      return false;
    }
    gl.useProgram(program);
    window.gl_program = program;
    return true;
  }

  // src/content/simplecube/index.ts
  function initVertexBuffers(gl) {
    let vertices = new Float32Array([
      1,
      1,
      1,
      -1,
      1,
      1,
      -1,
      -1,
      1,
      1,
      -1,
      1,
      1,
      1,
      1,
      1,
      -1,
      1,
      1,
      -1,
      -1,
      1,
      1,
      -1,
      1,
      1,
      1,
      1,
      1,
      -1,
      -1,
      1,
      -1,
      -1,
      1,
      1,
      -1,
      1,
      1,
      -1,
      1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      1,
      -1,
      -1,
      -1,
      1,
      -1,
      -1,
      1,
      -1,
      1,
      -1,
      -1,
      1,
      1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      1,
      -1,
      1,
      1,
      -1
    ]);
    let colors = new Float32Array([
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1
    ]);
    let indices = new Uint8Array([
      0,
      1,
      2,
      0,
      2,
      3,
      4,
      5,
      6,
      4,
      6,
      7,
      8,
      9,
      10,
      8,
      10,
      11,
      12,
      13,
      14,
      12,
      14,
      15,
      16,
      17,
      18,
      16,
      18,
      19,
      20,
      21,
      22,
      20,
      22,
      23
    ]);
    let indexBuffer = gl.createBuffer();
    if (!indexBuffer) {
      return -1;
    }
    if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, "a_Position")) {
      return -1;
    }
    if (!initArrayBuffer(gl, colors, 3, gl.FLOAT, "a_Color")) {
      return -1;
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    return indices.length;
  }
  function initArrayBuffer(gl, data, num, type, attribute) {
    var buffer = gl.createBuffer();
    if (!buffer) {
      console.log("Failed to create the buffer object");
      return false;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    var a_attribute = gl.getAttribLocation(window.gl_program, attribute);
    if (a_attribute < 0) {
      console.log("Failed to get the storage location of " + attribute);
      return false;
    }
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    gl.enableVertexAttribArray(a_attribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return true;
  }
  Promise.all([fetch("./vs.vert"), fetch("./fs.frag")]).then((vals) => {
    Promise.all([vals[0].text(), vals[1].text()]).then((shaders) => {
      const VShader = shaders[0];
      const FShader = shaders[1];
      let canv = document.createElement("canvas");
      document.body.appendChild(canv);
      canv.width = 800;
      canv.height = 800;
      let gl = canv.getContext("webgl2");
      if (gl) {
        if (initShader(gl, VShader, FShader)) {
          let n = initVertexBuffers(gl);
          gl.clearColor(0, 0, 0, 1);
          gl.enable(gl.DEPTH_TEST);
          let u_MvpMatrix = gl.getUniformLocation(window.gl_program, "u_MvpMatrix");
          if (!u_MvpMatrix) {
            console.log("Failed to get the storage location of u_MvpMatrix");
            return;
          }
          let mvpMatrix = new Matrix4();
          mvpMatrix.setPerspective(30, 1, 1, 100);
          mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
          gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
          gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
        }
      }
    });
  });
})();
