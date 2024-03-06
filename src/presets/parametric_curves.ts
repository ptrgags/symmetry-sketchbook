import { FourierSeries } from '@/core/curve_symmetry/FourierSeries'

const PI: number = Math.PI

export const ROSETTES: { [key: string]: FourierSeries } = {
  '2k + 1': FourierSeries.from_tuples([
    [-3, 1 / 2, PI],
    [-1, 1, 0],
    [1, 1, 0],
    [3, 1 / 4, PI],
    [5, 1 / 4, PI],
    [7, 1 / 2, 0]
  ])
    .scale(0.75)
    .rotate(PI / 2),
  '3k + 1': FourierSeries.from_tuples([
    [-5, 1 / 4, PI / 16],
    [-2, 1 / 2, 0],
    [4, 1 / 2, 0],
    [7, 1 / 4, PI / 4]
  ]),
  '4k + 1': FourierSeries.from_tuples([
    [-7, 1, 0],
    [-3, 1 / 9, PI],
    [5, 1, 0],
    [9, 1 / 2, 0]
  ]).scale(0.75),
  '4k + 2': FourierSeries.from_tuples([
    [-10, 1 / 4, PI],
    [-6, 1 / 3, 0],
    [-2, 1 / 2, 0],
    [2, 1, 0],
    [6, 1 / 2, 0],
    [10, 1 / 3, 0],
    [14, 1 / 4, 0]
  ])
    .scale(0.75)
    .rotate(PI / 2),
  '5k + 1': FourierSeries.from_tuples([
    [-14, 1 / 4, 0],
    [-9, -1 / 8, 0],
    [-4, 2 / 6, 0],
    [1, 1, 0],
    [6, 1 / 35, 0],
    [11, 1 / 48, 0],
    [16, 1 / 32, 0]
  ]),
  '5k + 2': FourierSeries.from_tuples([
    [-13, 1 / 13, 0],
    [-8, -1 / 8, 0],
    [-3, -1 / 3, 0],
    [2, 1, 0],
    [7, 1 / 7, 0],
    [12, 1 / 12, PI],
    [17, 1 / 17, PI]
  ]),
  '6k + 1': FourierSeries.from_tuples([
    [-11, 1 / 5, PI / 2],
    [1, 1, PI / 8],
    [7, 1 / 6, PI],
    [13, 1 / 4, 0],
    [19, 1 / 4, 0]
  ]),
  '7k + 1': FourierSeries.from_tuples([
    [-20, -1 / 20, 0],
    [-13, -1 / 13, PI / 2],
    [-6, 1 / 6, 0],
    [1, 1, 0],
    [8, 1 / 8, 0],
    [15, 1 / 15, PI / 2],
    [22, 1 / 22, -PI / 4]
  ]),
  '7k + 2': FourierSeries.from_tuples([
    [-19, 1 / 16, 0],
    [-12, 1 / 8, 0],
    [-5, 1 / 4, 0],
    [2, 1, PI / 4],
    [9, 1 / 4, PI / 2],
    [16, 1 / 8, 0],
    [23, 1 / 6, PI / 2]
  ]),
  '8k + 3': FourierSeries.from_tuples([
    [-21, 1 / 2, PI / 2],
    [3, 1, 0],
    [19, 1 / 4, 0],
    [27, 1 / 8, PI]
  ]),
  '9k + 2': FourierSeries.from_tuples([
    [-16, 1 / 4, 0],
    [2, 1, PI],
    [11, 1 / 4, PI],
    [29, 1 / 8, 0]
  ]),
  '10k + 3': FourierSeries.from_tuples([
    [-27, 1 / 64, 0],
    [-17, -1 / 8, 0],
    [3, 1, 0],
    [13, -1 / 2, PI / 24],
    [23, 1 / 3, PI / 6],
    [33, -1 / 4, 0]
  ]),
  '10k + 7': FourierSeries.from_tuples([
    [-23, 1 / 64, 0],
    [-3, -1, 0],
    [7, 1, 0],
    [17, 1 / 2, 0],
    [37, 1 / 4, PI / 2]
  ]).scale(0.75),
  '11k + 2': FourierSeries.from_tuples([
    [-31, 1 / 9, 0],
    [-20, 1 / 6, 0],
    [-9, 1 / 3, 0],
    [2, 1, 0],
    [13, 1 / 2, 0],
    [24, 1 / 8, 0],
    [35, 1 / 16, PI / 2]
  ]).scale(0.75),
  '11k + 3': FourierSeries.from_tuples([
    [-19, 1 / 19, PI / 4],
    [3, 1, 0],
    [25, 1 / 4, PI / 8],
    [36, 1 / 64, PI]
  ]),
  '12k + 1': FourierSeries.from_tuples([
    [-23, -1 / 4, PI / 2],
    [1, 1, 0],
    [13, 1 / 2, 0],
    [25, 1 / 4, PI],
    [37, 1 / 8, 0]
  ]),
  '12k + 3': FourierSeries.from_tuples([
    [-33, 1 / 5, 0],
    [-9, 1 / 3, 0],
    [3, 1, 0],
    [15, 1 / 2, PI / 2],
    [27, 1 / 4, 0],
    [39, 1 / 5, 0]
  ]).scale(0.75),
  '12k + 5': FourierSeries.from_tuples([
    [-31, 1 / 15, 0],
    [-19, 1 / 2, PI / 2],
    [-7, 1 / 5, PI],
    [5, 1, 0],
    [17, 1 / 5, PI],
    [29, 1 / 10, PI],
    [41, 1 / 15, PI]
  ])
}
