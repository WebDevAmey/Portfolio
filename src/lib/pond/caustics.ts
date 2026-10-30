// Caustic light drawn in WebGL: two layers of animated cellular noise, where the thin
// borders between cells (F2 - F1 close to zero) become the bright network of light lines.
const VERTEX = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAGMENT = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform float uScale;

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}

float edges(vec2 p, float t) {
  vec2 cell = floor(p);
  vec2 local = fract(p);
  float f1 = 8.0;
  float f2 = 8.0;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j));
      vec2 o = hash2(cell + g);
      o = 0.5 + 0.42 * sin(t + 6.2831 * o);
      float d = length(g + o - local);
      if (d < f1) { f2 = f1; f1 = d; } else if (d < f2) { f2 = d; }
    }
  }
  return f2 - f1;
}

void main() {
  vec2 p = gl_FragCoord.xy / uRes.y * uScale;
  p += 0.28 * vec2(sin(p.y * 1.3 + uTime * 0.5), cos(p.x * 1.1 - uTime * 0.4));
  float a = edges(p, uTime * 0.55);
  float b = edges(p * 1.7 + 7.3, uTime * 0.85);
  float light = pow(1.0 - smoothstep(0.0, 0.09, a), 2.0) * 0.7 + pow(1.0 - smoothstep(0.0, 0.06, b), 2.0) * 0.35;
  light = clamp(light, 0.0, 1.0);
  gl_FragColor = vec4(vec3(0.86, 1.0, 0.82) * light, light);
}
`;

export type Caustics = {
  resize: (width: number, height: number) => void;
  render: (time: number) => void;
  dispose: () => void;
};

const compile = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

/** Returns null when WebGL is unavailable; the pond then simply renders without caustics. */
export function createCaustics(canvas: HTMLCanvasElement, cellsAcross: number): Caustics | null {
  const gl = canvas.getContext("webgl", {
    premultipliedAlpha: true,
    antialias: false,
    alpha: true,
  });
  if (!gl) return null;
  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vs || !fs || !program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, "uRes");
  const uTime = gl.getUniformLocation(program, "uTime");
  const uScale = gl.getUniformLocation(program, "uScale");

  return {
    resize(width, height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(uRes, width, height);
      // Keep the cell size constant relative to the pond width.
      gl.uniform1f(uScale, (cellsAcross * height) / Math.max(1, width));
    },
    render(time) {
      gl.uniform1f(uTime, time);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    dispose() {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    },
  };
}
