import "./ChessBoard.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { moveFigureAction } from "../../../store/matrixChessBoardReducer/matrixChessBoardReducer.js";
import figurinesArray from "./module/figures.js";
import highlightingMove from "./module/highlightingMove.js";

const ChessBoard = () => {
  const dispatch = useDispatch();

  const chessBoard = useSelector((state) => state.chessBoard.matrixBoard);

  const [selectFigure, setSelectFigure] = useState({});
  const [highlightingKeys, setHighlightingKeys] = useState([]);
  const [moveTeam, setMoveTeam] = useState("black");

  const highlightingMoveFunc = useMemo(
    () => highlightingMove(selectFigure, setHighlightingKeys, chessBoard, moveTeam),
    [selectFigure, setHighlightingKeys, chessBoard]
  );

  const onChangeFigure = (index) => {
    setSelectFigure((prev) => {
      if (prev.index === index) return {};
      return { index: index, ...chessBoard[index] };
    });
  };
  const onMoveFigure = (index, damage = []) => {
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
  };
  useEffect(() => {
    if (selectFigure?.type) {
      highlightingMoveFunc();
    } else {
      setHighlightingKeys([]);
    }
  }, [selectFigure]);
  return (
    <div className="main_container_chessboard">
      <div className="container_chessboard">
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
                    styleDamage.includes(index)
                      ? "damage_move_cell"
                      : "move_cell"
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
          );
        })}
      </div>
    </div>
  );
};

export default ChessBoard;
