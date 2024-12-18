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
              <button className="btn_reset">Reset</button>
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
