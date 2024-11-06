import "./Main.css"
import ChessBoard from "./Chessboard/ChessBoard";
import DestroyedCheck from "./DestroyedCheck/DestroyedCheck.jsx";

const Main = () => {
  return (
    <div className="container_main">
      <ChessBoard />
      <DestroyedCheck />
    </div>
  );
};

export default Main;
