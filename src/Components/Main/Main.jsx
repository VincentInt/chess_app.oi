import "./Main.css";
import ChessBoard from "./Chessboard/ChessBoard";
import DestroyedCheck from "./DestroyedCheck/DestroyedCheck.jsx";
import WinModalWindow from "./WinModalWindow/WinModalWindow.jsx";

const Main = () => {
  return (
    <div className="container_main">
      <div className="container_board">
        <div>
          <ChessBoard />
          <DestroyedCheck />
        </div>
      </div>
      <WinModalWindow />
    </div>
  );
};

export default Main;
