const checkWin = (chessBoard) => {
  return () => {
    const figuresTeamCount = { black: 0, white: 0 };

    chessBoard.forEach((item) => {
      if (item?.type) {
        figuresTeamCount[item.team] += 1;
      }
    });
    return figuresTeamCount;
  };
};

export default  checkWin;
