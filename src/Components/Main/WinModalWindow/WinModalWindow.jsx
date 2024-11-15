import { useSelector } from "react-redux";
import "./WinModalWindow.css";

const WinModalWindow = () => {
  const statusWin = useSelector((state) => state.chessBoard.statusWin);
  return (
    <>
      {statusWin ? (
        <div className="container_modal">
          <div className="window">
            <div>
              <h1>Team Win: {statusWin}</h1>
              <a href="#">Reset</a>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default WinModalWindow;
