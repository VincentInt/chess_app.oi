const longMoveFigures = {
  pawn: [
    { finallyPoint: 8 },
    { finallyPoint: 16 },
    {
      finallyPoint: 7,
      damage: [7],
    },
    {
      finallyPoint: 9,
      damage: [9],
    },
  ],
  knight: {
    moveArray: [
      {
        finallyPoint: -17,
        damage: [-8, -16],
      },
      {
        finallyPoint: -15,
        damage: [-8, -16],
      },
      {
        finallyPoint: -10,
        damage: [-1, -2],
      },
      {
        finallyPoint: -6,
        damage: [1, 2],
      },
      {
        finallyPoint: 6,
        damage: [-1, -2],
      },
      {
        finallyPoint: 10,
        damage: [1, 2],
      },
      {
        finallyPoint: 15,
        damage: [8, 16],
      },
      {
        finallyPoint: 17,
        damage: [8, 16],
      },
    ],
    skipCellArray: [
      { position: -1, skipCell: [-10, 6] },
      { position: 0, skipCell: [-17, -10, 6, 15] },
      { position: 1, skipCell: [10, -6, -15, 17] },
      { position: 2, skipCell: [10, -6] },
    ],
  },
  rook: [-8, -1, 1, 8],
  bishop: [-9, -7, 7, 9],
  king: [-9, -8, -7, -1, 1, 7, 8, 9],
};

export default longMoveFigures;
