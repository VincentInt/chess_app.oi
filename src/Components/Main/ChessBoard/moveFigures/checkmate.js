const checkmateFunc = (chessBoard, dataMove) => {
  return () => {
    const damageArray = [];

    chessBoard.forEach((item, index) => {
      if (!item?.type) return;
      const figuresDataMove = dataMove[item.type];

      figuresDataMove(index, item.team).forEach((moveItem) => {
        if (moveItem?.damage) {
          damageArray.push({ damage: moveItem.damage, index });
        }
      });
    });

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
    return searchDamageKing;
  };
};
export default checkmateFunc;
