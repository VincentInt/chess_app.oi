const moveFigures = (selectFigure, setHighlightingKeys, dataMove) => {
  return () => {
    const moveArray = dataMove[selectFigure.type]();

    setHighlightingKeys(moveArray);
  };
};
export default moveFigures;
