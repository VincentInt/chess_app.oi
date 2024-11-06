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

  return () => {
    const dataMove = {
      pawn: function () {
        const moveArray = [{ finallyPoint: 8 }, { finallyPoint: 16 }].map(
          (item) => {
            item.finallyPoint =
              indexSelectFigure + item.finallyPoint * teamMoveFormat;
            return item;
          }
        );
        const damageArray = [
          {
            finallyPoint: 7,
            damage: [7],
          },
          {
            finallyPoint: 9,
            damage: [9],
          },
        ].map((item) => {
          item.finallyPoint =
            indexSelectFigure + item.finallyPoint * teamMoveFormat;
          item.damage = item.damage.map(
            (item) => indexSelectFigure + item * teamMoveFormat
          );
          return item;
        });

        const filteredDamageArray = damageArray.filter((item) => {
          if (!chessBoard[item.damage]?.team) return false;
          return chessBoard[item.damage].team !== teamSelectFigure;
        });
        let statusLet = false;
        const filteredMoveArray = moveArray.filter((item) => {
          if (!statusLet) {
            return chessBoard[item.finallyPoint]?.team
              ? !(statusLet = true)
              : true;
          }
        });

        return [...filteredMoveArray, ...filteredDamageArray];
      },
      knight: function () {
        const moveArray = [
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
        ].map((item) => {
          item.finallyPoint =
            indexSelectFigure + item.finallyPoint * teamMoveFormat;
          item.damage = item.damage?.map(
            (item) => indexSelectFigure + item * teamMoveFormat
          );
          return item;
        });

        const skipCellArray = [
          { position: -1, skipCell: [-10, 6] },
          { position: 0, skipCell: [-17, -10, 6, 15] },
          { position: 1, skipCell: [10, -6, -15, 17] },
          { position: 2, skipCell: [10, -6] },
        ]
          .map((item) => {
            if (!((indexSelectFigure + item.position) % 8))
              return item.skipCell.map((item) => item + indexSelectFigure);
            return false;
          })
          .filter((item) => item !== false)
          .join("");

        const filteredMoveArray = moveArray.filter((item) => {
          return !chessBoard[item.finallyPoint]?.team &&
            item.finallyPoint > 0 &&
            item.finallyPoint <= 64 &&
            !skipCellArray.includes(item.finallyPoint)
            ? true
            : false;
        });

        return filteredMoveArray;
      },
      rook: function () {
        const moveArray = [-8, -1, 1, 8];

        return moveArray
          .map((item) => {
            const moveArray = [];
            let index = selectFigure.index;

            while (true) {
              const nextPoint = index + item;
              const doublePoint = nextPoint + item;

              index += item;

              if (nextPoint > 64 || nextPoint < 0) return moveArray;

              if (item % 8 && (!(nextPoint % 8) || !(indexSelectFigure % 8))) {
                if (
                  Math.floor(nextPoint / 8) !==
                  Math.floor(indexSelectFigure / 8)
                ) {
                  return moveArray;
                } else if (item === -1 && !chessBoard[nextPoint]?.team) {
                  moveArray.push(
                    formatDataMoveFunc(nextPoint, [indexSelectFigure])
                  );
                  return moveArray;
                }
              }

              if (!chessBoard[nextPoint]?.team) {
                //Че за хрень, проверь
                if (indexSelectFigure === selectFigure.index) {
                  moveArray.push(formatDataMoveFunc(nextPoint, []));
                  continue;
                }
                //
                moveArray.push(
                  formatDataMoveFunc(nextPoint, [indexSelectFigure])
                );
                continue;
              }

              if (
                chessBoard[nextPoint]?.team !== moveTeam &&
                !chessBoard[doublePoint]?.team &&
                doublePoint > 0 &&
                doublePoint < 64
              ) {
                moveArray.push(formatDataMoveFunc(doublePoint, [nextPoint]));
                return moveArray;
              }

              return moveArray;
            }
          })
          .flat();
      },
      bishop: function () {
        const moveArray = [-9, -7, 7, 9];

        return moveArray
          .map((item) => {
            const dataMoveArray = [];

            let index = indexSelectFigure;

            while (true) {
              const currentPoint = index;
              const nextPoint = (index += item);

              if (nextPoint > 64 || nextPoint < 0) return dataMoveArray;

              if (!(currentPoint % 8) && (item === -9 || item === 7))
                return dataMoveArray;

              if (!(nextPoint % 8)) {
                if (item === -9 || item === 7) {
                  dataMoveArray.push(
                    formatDataMoveFunc(
                      nextPoint,
                      chessBoard[nextPoint]?.team
                        ? chessBoard[nextPoint]?.team !== teamSelectFigure
                          ? [nextPoint]
                          : []
                        : []
                    )
                  );
                }

                return dataMoveArray;
              }
              if (!chessBoard[nextPoint]?.team) {
                dataMoveArray.push(formatDataMoveFunc(nextPoint));
                continue;
              } else if (chessBoard[nextPoint]?.team !== teamSelectFigure)
                dataMoveArray.push(formatDataMoveFunc(nextPoint, [nextPoint]));
              return dataMoveArray;
            }
          })
          .flat();
      },
      queen: function () {
        const cloneBishop = this.bishop();
        const cloneRook = this.rook();

        return [...cloneBishop, ...cloneRook];
      },
      king: function () {
        const moveArray = [-9, -8, -7, -1, 1, 7, 8, 9];

        return moveArray
          .map((item) => {
            const nextPoint = indexSelectFigure - item;

            if (nextPoint > 64 || nextPoint < 0) return [];

            if (!chessBoard[nextPoint]?.team)
              return formatDataMoveFunc(nextPoint, []);
            else if (chessBoard[nextPoint]?.team !== teamSelectFigure)
              return formatDataMoveFunc(nextPoint, [nextPoint]);

            return [];
          })
          .flat();
      },
    };
    setHighlightingKeys(dataMove[selectFigure.type]());
  };
};

export default moveFigures;
