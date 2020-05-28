import Calc from './calc'

describe("Calc", () => {
    describe("create", () => {
        it("createVec3() should work", () => {
            const result = Calc.vector.createVec3()
            const expected = new Float32Array(3)
            expect(result).toEqual(expected)
        })
        it("createVec4() should work", () => {
            const result = Calc.vector.createVec4()
            const expected = new Float32Array(4)
            expect(result).toEqual(expected)
        })
        it("createMat3() should work", () => {
            const result = Calc.matrix.createMat3()
            const expected = new Float32Array(9)
            expect(result).toEqual(expected)
        })
        it("createMat4() should work", () => {
            const result = Calc.matrix.createMat4()
            const expected = new Float32Array(16)
            expect(result).toEqual(expected)
        })
    })

    describe("vector", () => {
        describe("areEqual", () => {
            it("should be the same function for vector and matrix", () => {
                expect(Calc.vector.areEqual).toBe(Calc.matrix.areEqual)
            })
            it("should work", () => {
                const a = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9])
                const b = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9])
                expect(Calc.vector.areEqual(a, b)).toBe(true)
            })
        })

        describe("cross3", () => {
            it("should be right-handed", () => {
                const x = new Float32Array([1, 0, 0])
                const y = new Float32Array([0, 1, 0])
                const result = new Float32Array(3)
                Calc.vector.cross3(x, y, result)
                const z = new Float32Array([0, 0, 1])
                expect(Calc.vector.areEqual(z, result)).toBe(true)
            })
            it("should work", () => {
                const x = new Float32Array([1, 2, 3])
                const y = new Float32Array([4, 5, 6])
                const result = new Float32Array(3)
                Calc.vector.cross3(x, y, result)
                const expected = new Float32Array([-3, 6, -3])
                expect(Calc.vector.areEqual(result, expected)).toBe(true)
            })
        })

        describe("dot3", () => {
            it("should work", () => {
                const x = new Float32Array([1, 2, 3])
                const y = new Float32Array([4, 5, 6])
                const result = Calc.vector.dot3(x, y)
                const expected = 32
                expect(result).toBe(expected)
            })
        })
    })

    describe("matrix", () => {
        describe("multiply3", () => {
            it("shoud work", () => {
                const x = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9])
                const y = new Float32Array([-4, -3, -2, -1, 0, 1, 2, 3, 4])
                const result = new Float32Array(9)
                Calc.matrix.multiply3(x, y, result)
                const expected = new Float32Array([
                    -30, -39, -48,
                    6, 6, 6,
                    42, 51, 60
                ])
                expect(result).toEqual(expected)
            })
        })

        describe("multiply4", () => {
            it("shoud work", () => {
                const x = new Float32Array([
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                ])
                const y = new Float32Array([
                    -4, -3, -2, -1,
                    7, 2, 3, -10,
                    1, 2, 3, 4,
                    -12, 0, 6, 8
                ])
                const result = new Float32Array(16)
                Calc.matrix.multiply4(x, y, result)
                const expected = new Float32Array([
                    -50, -60, -70, -80,
                    -86, -84, -82, -80,
                    90, 100, 110, 120,
                    146, 148, 150, 152
                ])
                expect(result).toEqual(expected)
            })
        })

        describe("invert4", () => {
            it("shoud work", () => {
                const x = new Float32Array([
                    1, 2, 3, 4,
                    5, 2, 7, 8,
                    9, 10, 3, 12,
                    13, 14, 15, 4
                ])
                const result = new Float32Array(16)
                const possible = Calc.matrix.invert4(x, result)
                expect(possible).toEqual(true)
                const expected = new Float32Array([
                    -89 / 168, 5 / 28, 3 / 56, 1 / 84,
                    2 / 7, -3 / 14, 1 / 28, 1 / 28,
                    9 / 56, 1 / 28, -5 / 56, 1 / 28,
                    5 / 42, 1 / 28, 1 / 28, -1 / 21
                ])
                expect(result).toEqual(expected)
            })
        })

        describe("extract3From4", () => {
            it("should work", () => {
                const input = new Float32Array([
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                ])
                const expected = new Float32Array([
                    1, 2, 3,
                    5, 6, 7,
                    9, 10, 11
                ])
                const result = new Float32Array(9)
                Calc.matrix.extract3From4(input, result)
                expect(result).toEqual(expected)
            })
        })
    })
})
