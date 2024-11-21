const stateCookiesDefault = {
  moveTeam: "",
  matrixBoard: [],
  destroyedFigures: [],
};
export const setCookiesBoard = (cookiesData) => {
  const objectCookies = {};

  for (const key in stateCookiesDefault) {
    if (cookiesData[key]) {
      objectCookies[key] = cookiesData[key];
    } else {
      return false;
    }
  }
  localStorage.setItem("board", JSON.stringify(objectCookies));
};
export const getCookiesBoard = () => {
  const cookiesObject = localStorage.getItem("board");
  return cookiesObject ? JSON.parse(cookiesObject) : null;
};
