import longMoveFigures from "./longMoveFigures";

const dataMoveFigures = (chessBoardArg, selectFigure, moveTeam) => {
  const maxBoardSize = 64;
  const minBoardSize = 0;
  const rowSize = 8;

  const indexSelectedFigure = selectFigure?.index;
  const teamSelectFigure = selectFigure?.team;

  function formatDataMoveFunc(finallyPoint, damage = []) {
    return {
      finallyPoint: finallyPoint,
      damage: [...damage],
    };
  }

  const dataMove = {
    pawn: function (
      indexFigure = indexSelectedFigure,
      teamFigure = teamSelectFigure,
      chessBoard = chessBoardArg
    ) {
      const teamMoveFormat = teamFigure === "black" ? -1 : 1;
      const moveArray = [];
      let stopFurtherMoves = false;
      
      longMoveFigures.pawn.forEach((item) => {
        if (item.finallyPoint === 16 && !chessBoard[indexFigure]?.firstSteps) return 
        if (!item?.damage) {
          const finallyPoint = indexFigure + item.finallyPoint * teamMoveFormat;
          const nextCell = chessBoard[finallyPoint];
          if (!nextCell?.team && !stopFurtherMoves) {
            return moveArray.push({ ...item, finallyPoint });
          } else stopFurtherMoves = true;
        } else {
          const finallyPoint = indexFigure + item.finallyPoint * teamMoveFormat;
          const nextCell = chessBoard[finallyPoint];
          const damage = item.damage.map(
            (item) => indexFigure + item * teamMoveFormat
          );
          const isSameNextRow =
            Math.floor((indexFigure + rowSize * teamMoveFormat) / rowSize) ===
            Math.floor(finallyPoint / rowSize);
          if (
            nextCell?.team &&
            nextCell?.team !== teamFigure &&
            isSameNextRow
          ) {
            return moveArray.push({ finallyPoint, damage });
          }
        }
      });
      return moveArray;
    },
    knight: function (
      indexFigure = indexSelectedFigure,
      teamFigure = teamSelectFigure,
      chessBoard = chessBoardArg
    ) {
      const teamMoveFormat = teamFigure === "black" ? -1 : 1;
      const skipCellData = longMoveFigures.knight.skipCellArray;
      const skipCellArray = [];

      const moveArray = longMoveFigures.knight.moveArray.map((item) => {
        const finallyPoint = indexFigure + item.finallyPoint * teamMoveFormat;
        const damage = item.damage?.map(
          (item) => indexFigure + item * teamMoveFormat
        );
        return { finallyPoint, damage };
      });
      skipCellData.forEach((item) => {
        const isSkipPosition = !((indexFigure + item.position) % rowSize);
        if (isSkipPosition) {
          return skipCellArray.push(
            ...item.skipCell.map((item) => item + indexFigure)
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
    rook: function (
      indexFigure = indexSelectedFigure,
      chessBoard = chessBoardArg
    ) {
      const moveArray = [];

      longMoveFigures.rook.forEach((item) => {
        let nextSteps = indexFigure;
        let twoSteps = indexFigure + item;

        let isInsideBoard =
          nextSteps <= maxBoardSize && nextSteps >= minBoardSize;

        while (isInsideBoard) {
          nextSteps += item;
          twoSteps = nextSteps + item;
          isInsideBoard =
            nextSteps <= maxBoardSize && nextSteps >= minBoardSize;

          if (item === 1 || item === -1) {
            if (item === -1 && (!(indexFigure % 8) || !((nextSteps + 1) % 8))) {
              break;
            }
            if (item === 1 && !(nextSteps % 8)) {
              break;
            }
          }

          if (!chessBoard[nextSteps]?.type) {
            moveArray.push(formatDataMoveFunc(nextSteps, []));
          } else if (
            chessBoard[nextSteps].team !== chessBoard[indexFigure].team
          ) {
            if (
              !chessBoard[twoSteps]?.type &&
              twoSteps > minBoardSize &&
              twoSteps < maxBoardSize
            ) {
              if (item === -1 || item === 1) {
                if (
                  Math.floor(indexFigure / rowSize) !==
                  Math.floor(twoSteps / rowSize)
                ) {
                  break;
                }
              }
              moveArray.push(formatDataMoveFunc(twoSteps, [nextSteps]));
              break;
            }
            break;
          } else {
            break;
          }
        }
      });
      return moveArray;
    },
    bishop: function (
      indexFigure = indexSelectedFigure,
      chessBoard = chessBoardArg
    ) {
      const moveArray = [];

      longMoveFigures.bishop.forEach((item) => {
        let nextSteps = indexFigure;
        let currentPoint = indexFigure;

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

              if (chessBoard[nextSteps]?.team !== teamSelectFigure) {
                moveArray.push(
                  formatDataMoveFunc(
                    nextSteps,
                    chessBoard[nextSteps]?.team ? damage : []
                  )
                );
              }
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
    queen: function (
      indexFigure = indexSelectedFigure,
      chessBoard = chessBoardArg
    ) {
      const cloneBishopMove = dataMove.bishop(indexFigure, chessBoard);
      const cloneRookMove = dataMove.rook(indexFigure, chessBoard);

      return [...cloneBishopMove, ...cloneRookMove];
    },
    king: function (
      indexFigure = indexSelectedFigure,
      teamFigure = teamSelectFigure,
      chessBoard = chessBoardArg
    ) {
      const moveArray = [];

      longMoveFigures.king.forEach((item) => {
        const nextSteps = indexFigure - item;

        if (nextSteps > maxBoardSize || nextSteps < minBoardSize) return;
        if (!chessBoard[nextSteps]?.team)
          return moveArray.push(formatDataMoveFunc(nextSteps, []));
        else if (chessBoard[nextSteps]?.team !== teamFigure)
          return moveArray.push(formatDataMoveFunc(nextSteps, [nextSteps]));
      });

      return moveArray;
    },
  };
  return dataMove;
};

export default dataMoveFigures;
