import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moveFigures from "../moveFigures/moveFigures";
import figurinesArray from "../../../../images/figures";
import { moveFigureAction } from "../../../../store/matrixChessBoardReducer/matrixChessBoardReducer";

const ChessCell = () => {
  const chessBoard = useSelector((state) => state.chessBoard.matrixBoard);
  const dispatch = useDispatch();

  const [selectFigure, setSelectFigure] = useState({});
  const [highlightingKeys, setHighlightingKeys] = useState([]);
  const [moveTeam, setMoveTeam] = useState("black");

  const moveFiguresFunc = useMemo(
    () =>
      moveFigures(selectFigure, setHighlightingKeys, chessBoard, moveTeam),
    [selectFigure, setHighlightingKeys, chessBoard]
  );

  useEffect(() => {
    if (selectFigure?.type) {
      moveFiguresFunc();
    } else {
      setHighlightingKeys([]);
    }
  }, [selectFigure]);

  function onChangeFigure(index) {
    setSelectFigure((prev) => {
      if (prev.index === index) return {};
      return { index: index, ...chessBoard[index] };
    });
  }
  function onMoveFigure(index, damage = []) {
    const filteredDamage = damage.filter(
      (item) => chessBoard[item]?.type && chessBoard[item]?.team !== moveTeam
    );
    dispatch(
      moveFigureAction({
        startIndex: selectFigure.index,
        endIndex: index,
        damage: filteredDamage,
      })
    );
    setMoveTeam((prev) => (prev === "black" ? "white" : "black"));
    setSelectFigure({});
    setHighlightingKeys([]);
  }
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
              indexCellMove.length
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
                      moveTeam === item?.team ? onChangeFigure(index) : ""
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
                  moveTeam === item?.team ? onChangeFigure(index) : ""
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
