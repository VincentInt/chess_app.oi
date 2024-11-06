import "./ChessBoard.css";

import ChessCell from "./ChessCell/СhessCell.jsx";

const ChessBoard = () => {
  return (
    <div className="container_chessboard">
      <div className="chessboard">
        <ChessCell />
      </div>
    </div>
  );
};

export default ChessBoard;
