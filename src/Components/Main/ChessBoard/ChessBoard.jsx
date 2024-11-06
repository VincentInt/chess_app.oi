import "./ChessBoard.css";
import DestroyedCheck from "./DestroyedCheck/DestroyedCheck.jsx";
import ChessCell from "./ChessCell/СhessCell.jsx";

const ChessBoard = () => {


  return (
    <div className="main_container_chessboard">
      <div className="container_chessboard">
        <div className="chessboard">
          <ChessCell />
        </div>
      </div>
      <DestroyedCheck />
    </div>
  );
};

export default ChessBoard;
