import figurinesArray from "../../../../images/figures";

const ChessCell = ({
  chessBoard,
  onChangeFigure,
  onMoveFigure,
  highlightingKeys,
  selectFigure,
  moveTeam,
  statusWin,
}) => {
  return (
    <>
      {chessBoard?.map((item, index) => {
        const count = Math.floor(index / 8) % 2 ? index + 1 : index;

        const indexCellMove = highlightingKeys?.filter(
          (item) => item.finallyPoint === index
        );
        const styleDamage = highlightingKeys
          ?.map((item) => item.damage)
          ?.flat();

        return (
          <div
            key={index}
            className={count % 2 ? "black_cell_board" : "white_cell_board"}
            onClick={() =>
              indexCellMove.length && !statusWin
                ? onMoveFigure(index, indexCellMove[0]?.damage)
                : ""
            }
          >
            {indexCellMove.length ||
            selectFigure?.index === index ||
            styleDamage.includes(index) ? (
              <div
                className={
                  styleDamage.includes(index) ? "damage_move_cell" : "move_cell"
                }
              >
                {item?.type ? (
                  <div
                    className="figure"
                    onClick={() =>
                      moveTeam === item?.team && !statusWin
                        ? onChangeFigure(index)
                        : ""
                    }
                    style={
                      moveTeam === item.team
                        ? { width: "100%" }
                        : { width: "75%" }
                    }
                  >
                    <img
                      src={figurinesArray[item.team][item.type]?.img}
                      alt="img_figures"
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
            ) : item?.type ? (
              <div
                className="figure"
                onClick={() =>
                  moveTeam === item?.team && !statusWin
                    ? onChangeFigure(index)
                    : ""
                }
                style={
                  moveTeam === item.team ? { width: "100%" } : { width: "75%" }
                }
              >
                <img
                  src={figurinesArray[item.team][item.type]?.img}
                  alt="img_figures"
                />
              </div>
            ) : (
              ""
            )}
          </div>
        );
      })}
    </>
  );
};

export default ChessCell;
