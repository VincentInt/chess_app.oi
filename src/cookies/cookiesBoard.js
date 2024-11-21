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
    }
  }
  localStorage.setItem("board", JSON.stringify(objectCookies));
};
export const getCookiesBoard = () => {
  return JSON.parse(localStorage.getItem("board"));
};
