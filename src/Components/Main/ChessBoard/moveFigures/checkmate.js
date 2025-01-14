const checkmateFunc = (chessBoard, dataMove) => {
  function checkChessDamageBoard(chessBoardClone = chessBoard) {
    const damageArray = [];

    chessBoardClone.forEach((item, index) => {
      if (!item?.type) return;
      const figuresDataMove = dataMove[item.type];
      if (
        item.type === "rook" ||
        item.type === "bishop" ||
        item.type === "queen"
      ) {
        figuresDataMove(index, chessBoardClone, item.team).forEach(
          (moveItem) => {
            if (moveItem?.damage) {
              damageArray.push({ damage: moveItem.damage, index });
            }
          }
        );
      } else {
        figuresDataMove(index, item.team, chessBoardClone).forEach(
          (moveItem) => {
            if (moveItem?.damage) {
              damageArray.push({ damage: moveItem.damage, index });
            }
          }
        );
      }
    });
    return damageArray;
  }
  return () => {
    const damageArray = checkChessDamageBoard();
    const searchDamageKing = damageArray.filter((item) => {
      return item.damage.filter((damageItem) => {
        const king =
          chessBoard[damageItem]?.type === "king" ? chessBoard[damageItem] : {};
        if (king?.type) {
          return king?.team !== chessBoard[item.index]?.team;
        }
        return false;
      }).length;
    });
    if (searchDamageKing.length) {
      let indexKing = null;
      let king = chessBoard.filter((item, index) => {
        if (
          item?.team !== chessBoard[searchDamageKing[0].index].team &&
          item?.type === "king"
        ) {
          indexKing = index;
          return true;
        }
        return false;
      })[0];
      const moveKingArray = dataMove[king.type](
        searchDamageKing[0].damage[0],
        king.team
      );
      const filteredSafeSteps = moveKingArray.filter((item) => {
        const chessBoardClone = [...chessBoard];
        chessBoardClone[indexKing] = {};
        chessBoardClone[item.finallyPoint] = { ...king };

        const damageNextStepsArray = checkChessDamageBoard(chessBoardClone)
          .filter((itemCell) => {
            if (
              itemCell.damage.length &&
              itemCell.index !== item.finallyPoint
            ) {
              const filteredFireTeam = itemCell.damage.filter((itemDamage) => {
                return (
                  chessBoardClone[itemCell.index].team !==
                  chessBoardClone[itemDamage].team
                );
              });
              if (filteredFireTeam.length === itemCell.damage.length) {
                return true;
              }
            }
            return false;
          })
          .filter(
            (itemCell) =>
              itemCell.damage.filter(
                (itemDamage) => chessBoardClone[itemDamage].type === "king"
              ).length
          ).length;
        return !damageNextStepsArray;
      });
      if (filteredSafeSteps.length !== moveKingArray) {
        return { damage: filteredSafeSteps, index: indexKing };
      } else return true;
    } else return false;
  };
};
export default checkmateFunc;
