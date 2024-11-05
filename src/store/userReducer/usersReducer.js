const defaultState = [
  {
    userName: "Cheftain",
    email: "1111@gmail.com",
    password: "1234",
  },
];

export const ADD_USER = "ADD_USER";

export const userReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ADD_USER:
      return [...state, ...action.payload];
    default:
      return state;
  }
};
