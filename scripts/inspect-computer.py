"""Inspect screen planes in the supplied GLB. No asset changes."""
from pathlib import Path
import struct
import json
import numpy as np

blob = Path('public/retro_computer_setup_free.glb').read_bytes()
length = struct.unpack_from('<I', blob, 12)[0]
gltf = json.loads(blob[20:20 + length])
binary = blob[28 + length:]

def accessor(index):
    a = gltf['accessors'][index]
    v = gltf['bufferViews'][a['bufferView']]
    size = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4}[a['type']]
    dtype = {5126: '<f4', 5125: '<u4', 5123: '<u2'}[a['componentType']]
    return np.frombuffer(binary, dtype=dtype, count=a['count'] * size,
                         offset=v.get('byteOffset', 0) + a.get('byteOffset', 0)).reshape(-1, size)

p = gltf['meshes'][0]['primitives'][0]
positions = accessor(p['attributes']['POSITION'])
indices = accessor(p['indices']).reshape(-1, 3)
triangles = positions[indices]
cross = np.cross(triangles[:, 1] - triangles[:, 0], triangles[:, 2] - triangles[:, 0])
areas = np.linalg.norm(cross, axis=1) / 2
normals = cross / np.maximum(areas[:, None] * 2, 1e-9)
planes = {}
for t, n, area in zip(triangles, normals, areas):
    if area < .01:
        continue
    key = tuple(np.round(n, 2)) + (round(float(np.dot(n, t[0])), 1),)
    group = planes.setdefault(key, [0, []])
    group[0] += area
    group[1].extend(t)
for key, (area, vertices) in sorted(planes.items(), key=lambda pair: -pair[1][0])[:35]:
    vertices = np.array(vertices)
    print('normal/plane', key, 'area', round(float(area)), 'bounds',
          np.round(vertices.min(axis=0), 2).tolist(), np.round(vertices.max(axis=0), 2).tolist())
