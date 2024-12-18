import "./ChessBoard.css";
import { useDispatch, useSelector } from "react-redux";
import ChessCell from "./ChessCell/СhessCell.jsx";
import { useEffect, useMemo, useState } from "react";
import dataMoveFigures from "./moveFigures/dataMoveFigures.js";
import moveFigures from "./moveFigures/moveFigures.js";
import checkmateFunc from "./moveFigures/checkmate.js";
import checkWin from "./moveFigures/checkLose.js";
import {
  resetBoard,
  loadBoard,
  moveFigure,
  winningCheck,
} from "../../../store/matrixChessBoardReducer/matrixChessBoardReducer.js";
import {
  setCookiesBoard,
  getCookiesBoard,
} from "../../../cookies/cookiesBoard.js";

const ChessBoard = () => {
  const statusWin = useSelector((state) => state.chessBoard.statusWin);
  const chessBoard = useSelector((state) => state.chessBoard.matrixBoard);
  const destroyedFigures = useSelector(
    (state) => state.chessBoard.destroyedFigures
  );

  const dispatch = useDispatch();
  
  const [selectFigure, setSelectFigure] = useState({});
  const [highlightingKeys, setHighlightingKeys] = useState([]);
  const [moveTeam, setMoveTeam] = useState("black");
  const [statusCheckmate, setStatusCheckmate] = useState(false);
  const [statusReset, setStatusReset] = useState(false);

  const dataMove = useMemo(
    () => dataMoveFigures(chessBoard, selectFigure, moveTeam),
    [selectFigure, moveTeam]
  );
  const moveFiguresFunc = useMemo(
    () => moveFigures(selectFigure, setHighlightingKeys, dataMove),
    [selectFigure, setHighlightingKeys, chessBoard]
  );
  const checkmate = useMemo(
    () => checkmateFunc(chessBoard, dataMove),
    [dataMove, chessBoard]
  );
  const checkWinFunc = useMemo(() => checkWin(chessBoard), [chessBoard]);

  useEffect(() => {
    const cookiesObject = getCookiesBoard();

    const matrixBoard = cookiesObject?.matrixBoard;
    const destroyedFigures = cookiesObject?.destroyedFigures;
    const moveTeam = cookiesObject?.moveTeam;

    if (matrixBoard && destroyedFigures && moveTeam) {
      setMoveTeam(moveTeam);
      dispatch(loadBoard({ matrixBoard, destroyedFigures }));
    }
  }, []);

  useEffect(() => {
    setTimeout(
      () =>
        setCookiesBoard({
          moveTeam: moveTeam,
          matrixBoard: chessBoard,
          destroyedFigures: destroyedFigures,
        }),
      0
    );
  }, [chessBoard, moveTeam]);

  useEffect(() => {
    if (statusReset) {
      setSelectFigure({});
      setMoveTeam("black");
      setStatusCheckmate(false);
      dispatch(resetBoard());
      setStatusReset(false);
    }
  }, [statusReset]);

  useEffect(() => {
    if (!statusCheckmate) {
      if (selectFigure?.type) {
        moveFiguresFunc();
      } else {
        setHighlightingKeys([]);
      }
    }
  }, [selectFigure]);

  useEffect(() => {
    const figuresTeamCount = checkWinFunc();

    let winTeam = false;

    if (figuresTeamCount.black === 0) {
      winTeam = "white";
    } else if (figuresTeamCount.white === 0) {
      winTeam = "black";
    }
    dispatch(winningCheck({ teamLose: winTeam }));
  }, [chessBoard, moveTeam]);

  useEffect(() => {
    const checkmateClone = checkmate();
    if (
      Array.isArray(checkmateClone.damage) &&
      chessBoard[checkmateClone.index].team === moveTeam
    ) {
      setStatusCheckmate(checkmateClone);
      setSelectFigure({
        index: checkmateClone.index,
        ...chessBoard[checkmateClone.index],
      });
      setHighlightingKeys(checkmateClone.damage);
    } else if (checkmateClone !== false) {
      setStatusCheckmate(true);
      //Пофиксить проблему
      winningCheck(moveTeam === "black" ? "white" : "black");
      //
    }
  }, [chessBoard, moveTeam]);

  function onChangeFigure(index) {
    if (!statusCheckmate) {
      setSelectFigure((prev) => {
        if (prev.index === index) return {};
        return { index: index, ...chessBoard[index] };
      });
    }
  }
  function onMoveFigure(index, damage = []) {
    const filteredDamage = damage.filter(
      (item) => chessBoard[item]?.type && chessBoard[item]?.team !== moveTeam
    );
    dispatch(
      moveFigure({
        startIndex: selectFigure.index,
        endIndex: index,
        damage: filteredDamage,
      })
    );
    setMoveTeam((prev) => (prev === "black" ? "white" : "black"));
    setSelectFigure({});
    setHighlightingKeys([]);
    setStatusCheckmate(false);
  }
  return (
    <div>
      <div className="container_chessboard">
        <div className="chessboard">
          <ChessCell
            chessBoard={chessBoard}
            onChangeFigure={onChangeFigure}
            onMoveFigure={onMoveFigure}
            highlightingKeys={highlightingKeys}
            selectFigure={selectFigure}
            moveTeam={moveTeam}
            statusWin={statusWin}
          />
        </div>
      </div>
      <button className="btn_reset" onClick={() => setStatusReset(true)}>
        Reset
      </button>
    </div>
  );
};

export default ChessBoard;
