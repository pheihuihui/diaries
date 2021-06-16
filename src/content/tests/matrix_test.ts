import { Matrix4 } from "../webgl_utils/matrix";

let mat = new Matrix4([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
let mat2 = new Matrix4([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
mat.multiply(mat2)
mat.printElements()
mat.setIdentity()
mat.printElements()