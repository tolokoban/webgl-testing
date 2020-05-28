import bpy
import bmesh
import json

def mesh_triangulate(mesh):
    import bmesh
    bm = bmesh.new()
    bm.from_mesh(mesh)
    bmesh.ops.triangulate(bm, faces=bm.faces)
    bm.to_mesh(mesh)
    bm.free()


def export(object, directory):
    mesh = object.to_mesh()
    mesh_triangulate(mesh)
    mesh.calc_normals_split()
    loops = mesh.loops
    uv_layer = mesh.uv_layers.active.data[:]
    verts = mesh.vertices[:]
    data = []
    for face in mesh.polygons:
        vert_idx = 0
        for loop_index in face.loop_indices:
            vert = verts[face.vertices[vert_idx]]
            vert_idx += 1
            (x, y, z) = vert.co
            data.append("%.3f,%.3f,%.3f" % (x, z, y))
            (texture_u, texture_v) = uv_layer[loop_index].uv
            data.append("%.3f,%.3f" % (texture_u, texture_v))
            (normal_x, normal_y, normal_z) = loops[loop_index].normal
            data.append("%.6f,%.6f,%.6f" % (normal_x, normal_z, normal_y))
    # Youpi les amis
    filepath = f"{directory}/{object.name}.json"
    with open(filepath, "w", encoding="utf8", newline="\n") as f:
        f.write('{"name":' + json.dumps(object.name) + ',')
        f.write('"attributes":["x","y","z","u","v","nx","ny","nz"],')
        f.write('"data":[')
        f.write(",".join(data))
        f.write(']}')




export(bpy.context.active_object, "/home/tolokoban/Code/github/webgl-testing/public/mesh")
