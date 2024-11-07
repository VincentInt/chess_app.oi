import dataMoveFigures from "./dataMoveFigures";

const moveFigures = (
  selectFigure,
  setHighlightingKeys,
  chessBoard,
  moveTeam
) => {
  const maxBoardSize = 64;
  const minBoardSize = 0;
  const rowSize = 8;

  const indexSelectFigure = selectFigure.index;
  const teamSelectFigure = selectFigure.team;
  const teamMoveFormat = teamSelectFigure === "black" ? -1 : 1;

  const formatDataMoveFunc = (finallyPoint, damage = []) => {
    return {
      finallyPoint: finallyPoint,
      damage: [...damage],
    };
  };

  return () => {
    const dataMove = {
      pawn: function () {
        let stopFurtherMoves = false;
        const moveArray = [];

        dataMoveFigures.pawn.forEach((item) => {
          if (!item?.damage) {
            const finallyPoint =
              indexSelectFigure + item.finallyPoint * teamMoveFormat;
            const nextCell = chessBoard[finallyPoint];
            if (!nextCell?.team && !stopFurtherMoves) {
              return moveArray.push({ ...item, finallyPoint });
            } else stopFurtherMoves = true;
          } else {
            const finallyPoint =
              indexSelectFigure + item.finallyPoint * teamMoveFormat;
            const nextCell = chessBoard[finallyPoint];
            const damage = item.damage.map(
              (item) => indexSelectFigure + item * teamMoveFormat
            );
            const isSameNextRow =
              Math.floor(
                (indexSelectFigure + rowSize * teamMoveFormat) / rowSize
              ) === Math.floor(finallyPoint / rowSize);
            if (
              nextCell?.team &&
              nextCell?.team !== teamSelectFigure &&
              isSameNextRow
            ) {
              return moveArray.push({ finallyPoint, damage });
            }
          }
        });
        return moveArray;
      },
      knight: function () {
        const skipCellArray = [];
        const skipCellData = dataMoveFigures.knight.skipCellArray;

        const moveArray = dataMoveFigures.knight.moveArray.map((item) => {
          const finallyPoint =
            indexSelectFigure + item.finallyPoint * teamMoveFormat;
          const damage = item.damage?.map(
            (item) => indexSelectFigure + item * teamMoveFormat
          );
          return { finallyPoint, damage };
        });
        skipCellData.forEach((item) => {
          const isSkipPosition = !(
            (indexSelectFigure + item.position) %
            rowSize
          );
          if (isSkipPosition) {
            return skipCellArray.push(
              ...item.skipCell.map((item) => item + indexSelectFigure)
            );
          }
        });
        const filteredMoveArray = moveArray.filter((item) => {
          const finallyPoint = item.finallyPoint;
          const isPointLimits =
            finallyPoint > minBoardSize && finallyPoint <= maxBoardSize;
          return (
            !chessBoard[finallyPoint]?.team &&
            isPointLimits &&
            !skipCellArray.includes(finallyPoint)
          );
        });
        return filteredMoveArray;
      },
      rook: function () {
        const moveArray = [];

        dataMoveFigures.rook.forEach((item) => {
          let nextSteps = indexSelectFigure;
          let twoSteps = indexSelectFigure + item;

          let isInsideBoard =
            nextSteps <= maxBoardSize && nextSteps >= minBoardSize;

          while (isInsideBoard) {
            nextSteps += item;
            twoSteps = nextSteps + item;
            isInsideBoard =
              nextSteps <= maxBoardSize && nextSteps >= minBoardSize;
            if (
              item % rowSize &&
              (!(nextSteps % rowSize) || !(indexSelectFigure % rowSize))
            ) {
              const statusNextRow =
                Math.floor(nextSteps / rowSize) ===
                Math.floor(indexSelectFigure / rowSize);
              if (
                statusNextRow &&
                item === -1 &&
                !chessBoard[nextSteps]?.team
              ) {
                moveArray.push(
                  formatDataMoveFunc(nextSteps, [indexSelectFigure])
                );
                continue;
              } else break;
            }
            if (!chessBoard[nextSteps]?.team) {
              moveArray.push(formatDataMoveFunc(nextSteps, []));
              continue;
            }
            if (
              chessBoard[nextSteps]?.team !== moveTeam &&
              !chessBoard[twoSteps]?.team &&
              twoSteps > minBoardSize &&
              twoSteps < maxBoardSize
            ) {
              if (item % rowSize) {
                const isSameRow =
                  Math.floor(twoSteps / rowSize) ===
                  Math.floor(nextSteps / rowSize);
                if (isSameRow) {
                  moveArray.push(formatDataMoveFunc(twoSteps, [nextSteps]));
                }
              } else moveArray.push(formatDataMoveFunc(twoSteps, [nextSteps]));
            }
            break;
          }
        });
        return moveArray;
      },
      bishop: function () {
        const moveArray = [];

        dataMoveFigures.bishop.forEach((item) => {
          let nextSteps = indexSelectFigure;
          let currentPoint = indexSelectFigure;
          
          let isInsideBoard =
            nextSteps <= maxBoardSize && nextSteps >= minBoardSize;

          while (isInsideBoard) {
            currentPoint = nextSteps;
            nextSteps += item;
            isInsideBoard =
              nextSteps <= maxBoardSize && nextSteps >= minBoardSize;

            if (!(currentPoint % rowSize) && (item === -9 || item === 7)) break;
            if (!(nextSteps % rowSize)) {
              if (item === -9 || item === 7) {
                const damage =
                  chessBoard[nextSteps]?.team !== teamSelectFigure
                    ? [nextSteps]
                    : [];
                moveArray.push(
                  formatDataMoveFunc(
                    nextSteps,
                    chessBoard[nextSteps]?.team ? damage : []
                  )
                );
              }
              break;
            }
            if (!chessBoard[nextSteps]?.team) {
              moveArray.push(formatDataMoveFunc(nextSteps));
              continue;
            } else if (chessBoard[nextSteps]?.team !== teamSelectFigure)
              moveArray.push(formatDataMoveFunc(nextSteps, [nextSteps]));
            break;
          }
        });
        return moveArray;
      },
      queen: function () {
        const cloneBishopMove = this.bishop();
        const cloneRookMove = this.rook();

        return [...cloneBishopMove, ...cloneRookMove];
      },
      king: function () {
        const moveArray = [];

        dataMoveFigures.king.forEach((item) => {
          const nextSteps = indexSelectFigure - item;

          if (nextSteps > maxBoardSize || nextSteps < minBoardSize) return;
          if (!chessBoard[nextSteps]?.team)
            return moveArray.push(formatDataMoveFunc(nextSteps, []));
          else if (chessBoard[nextSteps]?.team !== teamSelectFigure)
            return moveArray.push(formatDataMoveFunc(nextSteps, [nextSteps]));
        });
        return moveArray;
      },
    };
    setHighlightingKeys(dataMove[selectFigure.type]());
  };
};

export default moveFigures;
