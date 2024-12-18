import "./DestroyedItemTeam.css";
import { useSelector } from "react-redux";
import figurinesArray from "../../../../images/figures";

const DestroyedItemTeam = ({ team }) => {
  const destroyedFigures = useSelector(
    (state) => state.chessBoard.destroyedFigures
  );

  return (
    <div className="container_destroyed">
      <div className="destroyed">
        <h3>Killed {team[0].toUpperCase() + team.slice(1, team.length)} team:</h3>
        {destroyedFigures
          .filter((item) => item.figure.team !== team)
          .map((item, index) => (
            <div key={index} className="destroyed_item">
              <img
                src={figurinesArray[item.figure.team][item.figure.type].img}
                alt="destroyed_figure_img"
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default DestroyedItemTeam;
