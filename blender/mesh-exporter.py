import bpy
import bmesh
import math
import json

def mesh_triangulate(mesh):
    import bmesh
    bm = bmesh.new()
    bm.from_mesh(mesh)
    bmesh.ops.triangulate(bm, faces=bm.faces)
    bm.to_mesh(mesh)
    bm.free()

def length(vector):
    (x,y,z) = vector
    return math.sqrt(x*x + y*y + z*z)

def normalize(vector):
    len = length(vector)
    if len > 0:
        return [x / len for x in vector]
    return vector

def dot(v1, v2):
    (x1,y1,z1) = v1
    (x2,y2,z2) = v2
    return x1*x2 + y1*y2 + z1*z2

def add(v1, v2):
    (x1,y1,z1) = v1
    (x2,y2,z2) = v2
    return (x1 + x2, y1 + y2, z1 + z2)

def sub(v1, v2):
    (x1,y1,z1) = v1
    (x2,y2,z2) = v2
    return (x1 - x2, y1 - y2, z1 - z2)

def mix(v1, v2, alpha):
    (x1,y1,z1) = v1
    (x2,y2,z2) = v2
    beta = 1 - alpha
    return (x1*beta + x2*alpha, y1*beta + y2*alpha, z1*beta + z2*alpha)

def center(v1, v2):
    return mix(v1, v2, 0.5)


class Vertex:
    def __init__(self, key, index, coords):
        self.key = key
        self.index = index
        self.coords = coords

class Vertices:
    def __init__(self):
        self.map = {}  # Map of index.
        self.arr = []  # Array of Vertex.

    def key(self, vertex_coords):
        (x,y,z) = vertex_coords
        return "%.3f,%.3f,%.3f" % (x,z,-y)

    def add(self, vertex_coords):
        key = self.key(vertex_coords)
        if key in self.map:
            return self.arr[self.map[key]]
        vertex_index = len(self.arr)
        vertex = Vertex(key, vertex_index, vertex_coords)
        self.map[key] = vertex_index
        self.arr.append(vertex)
        return vertex

    def get(self, index):
        return self.arr[index]

    def get_array(self):
        return self.arr[:]


class Texture:
    def __init__(self, key, index, coords):
        self.key = key
        self.index = index
        self.coords = coords

class Textures:
    def __init__(self):
        self.map = {}  # Map of index.
        self.arr = []  # Array of Texture.

    def key(self, texture_coords):
        (u, v) = texture_coords
        return "%.5f,%.5f" % (u, v)

    def add(self, texture_coords):
        key = self.key(texture_coords)
        if key in self.map:
            return self.arr[self.map[key]]
        texture_index = len(self.arr)
        texture = Texture(key, texture_index, texture_coords)
        self.map[key] = texture_index
        self.arr.append(texture)
        return texture

    def get(self, index):
        return self.arr[index]

    def get_array(self):
        return self.arr[:]


class Normal:
    def __init__(self, key, index, coords):
        self.key = key
        self.index = index
        self.coords = coords

class Normals:
    def __init__(self):
        self.map = {}  # Map of index.
        self.arr = []  # Array of Normal.

    def key(self, normal_coords):
        (x,y,z) = normal_coords
        return "%.6f,%.6f,%.6f" % (x,z,-y)

    def add(self, normal_coords):
        key = self.key(normal_coords)
        if key in self.map:
            return self.arr[self.map[key]]
        normal_index = len(self.arr)
        normal = Normal(key, normal_index, normal_coords)
        self.map[key] = normal_index
        self.arr.append(normal)
        return normal

    def get(self, index):
        return self.arr[index]

    def get_array(self):
        return self.arr[:]


def export(original_object, directory):
    """
    {
        "vertices": [x,y,z,...],
        "textures": [u,v,...],
        "normals": [nx,ny,nz,...],
        "edges": [v1,v2,normal,valley,...],
        "faces": [
            ver_idx1, tex_idx1, nor_idx1, edge_dist1,
            ver_idx2, tex_idx2, nor_idx2, edge_dist2,
            ver_idx3, tex_idx3, nor_idx3, edge_dist3,
            ...
        ]
    }
    """
    filepath = f"{directory}/{original_object.name}.json"
    print(f"Exporting object '{original_object.name}' into {filepath}...")
    object = original_object.copy()
    object.data = original_object.data.copy()
    bpy.data.collections["Collection"].objects.link(object)
    object.select_set(True)
    print(f"Duplicated in '{object.name}'...")
    modifiers = object.modifiers
    if modifiers != None:
        for modifier in modifiers[:]:
            try:
                bpy.ops.object.modifier_apply(apply_as='DATA', modifier=modifier.name)
            except Exception as ex:
                print(f"ERROR with modifier '{modifier.name}': {str(ex)}")

    mesh = object.to_mesh()
    mesh_triangulate(mesh)
    mesh.calc_normals_split()

    vertices = Vertices()
    textures = Textures()
    normals = Normals()

    loops = mesh.loops
    uv_layer = mesh.uv_layers.active.data[:]
    faces = []
    smoothness = []

    for face in mesh.polygons:
        vertexA = vertices.add(mesh.vertices[face.vertices[0]].co)
        vertexB = vertices.add(mesh.vertices[face.vertices[1]].co)
        vertexC = vertices.add(mesh.vertices[face.vertices[2]].co)
        faceVertices = [vertexA, vertexB, vertexC]
        vert_idx = 0

        for loop_index in face.loop_indices:
            vertex = faceVertices[vert_idx]
            (x, y, z) = vertex.coords
            vert_idx += 1

            texture = textures.add(uv_layer[loop_index].uv)
            normal = normals.add(loops[loop_index].normal)
            if face.use_smooth:
                smoothness.append("1")
            else:
                smoothness.append("0")
            faces.append(f"{vertex.index},{texture.index},{normal.index}")

    print(filepath)
    with open(filepath, "w", encoding="utf8", newline="\n") as f:
        f.write('{"name":' + json.dumps(original_object.name) + ',\n')
        f.write('"vertices":[')
        f.write(",".join([x.key for x in vertices.get_array()]))
        f.write('],\n')
        f.write('"textures":[')
        f.write(",".join([x.key for x in textures.get_array()]))
        f.write('],\n')
        f.write('"normals":[')
        f.write(",".join([x.key for x in normals.get_array()]))
        f.write('],\n')
        f.write(f'"smoothness":"{"".join(smoothness)}",\n')
        f.write('"faces":[')
        f.write(",".join(faces))
        f.write(']}')
    bpy.ops.object.delete(use_global=False)


export(bpy.context.active_object, "/home/tolokoban/Code/github/webgl-testing/public/assets/mesh")

# objects_to_export = [obj.name for obj in bpy.data.objects if obj.type == 'MESH']
# objects_to_select = [obj.name for obj in bpy.data.objects if obj.select_get() == True and obj.type == 'MESH']
# bpy.ops.object.select_all(action='DESELECT')

# for object_name in objects_to_export:
#     object = bpy.data.objects[object_name]
#     export(object, "/home/tolokoban/Code/github/webgl-testing/public/assets/mesh")

# for object_name in objects_to_select:
#     object = bpy.data.objects[object_name]
#     object.select_set(True)
