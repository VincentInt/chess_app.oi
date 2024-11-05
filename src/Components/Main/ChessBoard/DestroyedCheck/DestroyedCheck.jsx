import "./DestroyedCheck.css";
import DestroyedItemTeam from "./DestroyedItemTeam/DestroyedItemTeam";

const DestroyedCheck = () => {
  return (
    <div className="main_container_destroyed">
      <div className="position_destroyed">
        <DestroyedItemTeam team={"white"} />
        <DestroyedItemTeam team={"black"} />
      </div>
    </div>
  );
};

export default DestroyedCheck;
