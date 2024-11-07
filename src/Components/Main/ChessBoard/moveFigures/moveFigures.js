const moveFigures = (
  selectFigure,
  setHighlightingKeys,
  chessBoard,
  moveTeam
) => {
  const indexSelectFigure = selectFigure.index;
  const teamSelectFigure = selectFigure.team;
  const teamMoveFormat = teamSelectFigure === "black" ? -1 : 1;

  const formatDataMoveFunc = (finallyPoint, damage = []) => {
    return {
      finallyPoint: finallyPoint,
      damage: [...damage],
    };
  };

  const moveFigures = {
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

  return () => {
    const dataMove = {
      pawn: function () {
        let statusLet = false;
        const moveArray = [];

        moveFigures.pawn.forEach((item) => {
          if (!item?.damage) {
            const finallyPoint =
              indexSelectFigure + item.finallyPoint * teamMoveFormat;
            if (!chessBoard[finallyPoint]?.team && !statusLet) {
              return moveArray.push({ ...item, finallyPoint });
            } else statusLet = true;
          } else {
            const finallyPoint =
              indexSelectFigure + item.finallyPoint * teamMoveFormat;
            const damage = item.damage.map(
              (item) => indexSelectFigure + item * teamMoveFormat
            );
            const statusNextRow =
              Math.floor((indexSelectFigure + 8 * teamMoveFormat) / 8) ===
              Math.floor(finallyPoint / 8);
            if (
              chessBoard[finallyPoint]?.team &&
              chessBoard[finallyPoint]?.team !== teamSelectFigure &&
              statusNextRow
            ) {
              return moveArray.push({ finallyPoint, damage });
            }
          }
        });
        return moveArray;
      },
      knight: function () {
        const skipCellArray = [];
        const skipCellData = moveFigures.knight.skipCellArray;

        const moveArray = moveFigures.knight.moveArray.map((item) => {
          const finallyPoint =
            indexSelectFigure + item.finallyPoint * teamMoveFormat;
          const damage = item.damage?.map(
            (item) => indexSelectFigure + item * teamMoveFormat
          );
          return { finallyPoint, damage };
        });
        skipCellData.forEach((item) => {
          const statusSkipPosition = !((indexSelectFigure + item.position) % 8);
          if (statusSkipPosition) {
            return skipCellArray.push(
              ...item.skipCell.map((item) => item + indexSelectFigure)
            );
          }
        });
        const filteredMoveArray = moveArray.filter((item) => {
          const statusLimits = item.finallyPoint > 0 && item.finallyPoint <= 64;
          return (
            !chessBoard[item.finallyPoint]?.team &&
            statusLimits &&
            !skipCellArray.includes(item.finallyPoint)
          );
        });
        return filteredMoveArray;
      },
      rook: function () {
        const moveArray = [];

        moveFigures.rook.forEach((item) => {
          let nextPoint = indexSelectFigure;
          let doublePoint = indexSelectFigure + item;

          while (nextPoint <= 64 && nextPoint >= 0) {
            nextPoint += item;
            doublePoint = nextPoint + item;

            if (item % 8 && (!(nextPoint % 8) || !(indexSelectFigure % 8))) {
              const statusNextRow =
                Math.floor(nextPoint / 8) === Math.floor(indexSelectFigure / 8);
              if (
                statusNextRow &&
                item === -1 &&
                !chessBoard[nextPoint]?.team
              ) {
                moveArray.push(
                  formatDataMoveFunc(nextPoint, [indexSelectFigure])
                );
                continue;
              } else break;
            }
            if (!chessBoard[nextPoint]?.team) {
              moveArray.push(formatDataMoveFunc(nextPoint, []));
              continue;
            }
            if (
              chessBoard[nextPoint]?.team !== moveTeam &&
              !chessBoard[doublePoint]?.team &&
              doublePoint > 0 &&
              doublePoint < 64
            ) {
              if (item % 8) {
                Math.floor(doublePoint / 8) === Math.floor(nextPoint / 8)
                  ? moveArray.push(formatDataMoveFunc(doublePoint, [nextPoint]))
                  : "";
              } else
                moveArray.push(formatDataMoveFunc(doublePoint, [nextPoint]));
            }
            break;
          }
        });
        return moveArray;
      },
      bishop: function () {
        const moveArray = [];

        moveFigures.bishop.forEach((item) => {
          let nextPoint = indexSelectFigure;
          let currentPoint = indexSelectFigure;

          while (nextPoint <= 64 && nextPoint >= 0) {
            currentPoint = nextPoint;
            nextPoint += item;

            if (!(currentPoint % 8) && (item === -9 || item === 7)) break;
            if (!(nextPoint % 8)) {
              if (item === -9 || item === 7) {
                const damage =
                  chessBoard[nextPoint]?.team !== teamSelectFigure
                    ? [nextPoint]
                    : [];
                moveArray.push(
                  formatDataMoveFunc(
                    nextPoint,
                    chessBoard[nextPoint]?.team ? damage : []
                  )
                );
              }
              break;
            }
            if (!chessBoard[nextPoint]?.team) {
              moveArray.push(formatDataMoveFunc(nextPoint));
              continue;
            } else if (chessBoard[nextPoint]?.team !== teamSelectFigure)
              moveArray.push(formatDataMoveFunc(nextPoint, [nextPoint]));
            break;
          }
        });
        return moveArray;
      },
      queen: function () {
        const cloneBishop = this.bishop();
        const cloneRook = this.rook();

        return [...cloneBishop, ...cloneRook];
      },
      king: function () {
        const moveArray = [];

        moveFigures.king.forEach((item) => {
          const nextPoint = indexSelectFigure - item;
          if (nextPoint > 64 || nextPoint < 0) return;
          if (!chessBoard[nextPoint]?.team)
            return moveArray.push(formatDataMoveFunc(nextPoint, []));
          else if (chessBoard[nextPoint]?.team !== teamSelectFigure)
            return moveArray.push(formatDataMoveFunc(nextPoint, [nextPoint]));
        });
        return moveArray;
      },
    };
    setHighlightingKeys(dataMove[selectFigure.type]());
  };
};

export default moveFigures;
