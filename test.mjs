// node test.mjs — checks interfaceSlab() on a 50×50 plate with a 20×20 hole.
import fs from 'fs'; import vm from 'vm'; import assert from 'assert';

const html = fs.readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const stub = new Proxy(function () {}, { get: (t, k) => k === 'value' ? '1' : stub, apply: () => stub, set: () => true });
const ctx = vm.createContext({ document: stub, Float32Array, Map, Math, Number });
vm.runInContext(html.match(/<script>([\s\S]*)<\/script>/)[1], ctx);

// Square frame: outer half-size 25, inner 10, z 0..6, as the STL triangle soup.
const tris = [];
const O = [[-25, -25], [25, -25], [25, 25], [-25, 25]], I = [[-10, -10], [10, -10], [10, 10], [-10, 10]];
const quad = (a, b, c, d) => tris.push(...a, ...b, ...c, ...a, ...c, ...d);
for (let k = 0; k < 4; k++) {
  const [a, b, c, d] = [O[k], O[(k + 1) % 4], I[(k + 1) % 4], I[k]];
  quad([...a, 6], [...b, 6], [...c, 6], [...d, 6]);
  quad([...a, 0], [...d, 0], [...c, 0], [...b, 0]);
  quad([...a, 0], [...b, 0], [...b, 6], [...a, 6]);
  quad([...c, 0], [...d, 0], [...d, 6], [...c, 6]);
}
ctx.t = new Float32Array(tris);
const slab = vm.runInContext('interfaceSlab(t, boundingBox(t), 0.4)', ctx);

// Watertight and consistently wound: every directed edge has exactly one reverse twin.
const edges = new Map();
const key = (s, i) => `${s[i].toFixed(3)},${s[i + 1].toFixed(3)},${s[i + 2].toFixed(3)}`;
let volume = 0;
for (let i = 0; i < slab.length; i += 9) {
  const v = [key(slab, i), key(slab, i + 3), key(slab, i + 6)];
  for (let j = 0; j < 3; j++) { const e = v[j] + '>' + v[(j + 1) % 3]; edges.set(e, (edges.get(e) || 0) + 1); }
  const [ax, ay, az, bx, by, bz, cx, cy, cz] = slab.slice(i, i + 9);
  volume += (ax * (by * cz - bz * cy) - ay * (bx * cz - bz * cx) + az * (bx * cy - by * cx)) / 6;
}
for (const [e, n] of edges) {
  const [a, b] = e.split('>');
  assert.equal(n, 1, `duplicate edge ${e}`);
  assert.equal(edges.get(b + '>' + a), 1, `open edge ${e}`);
}
assert(Math.abs(volume - (50 * 50 - 20 * 20) * 0.4) < 1e-3, `volume ${volume}`);
console.log('ok: slab watertight, volume', volume.toFixed(2), 'mm³');
