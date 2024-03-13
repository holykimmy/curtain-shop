let initialState = [];

if (typeof window !== "undefined") {
  if (sessionStorage.getItem("cart")) {
    initialState = JSON.parse(sessionStorage.getItem("cart"));
  } else {
    initialState = [];
  }
}

export function cartReducer(state = initialState, action) {
  switch (action.type) {
    case "ADD_TO_CART":
      return action.payload;
    default:
      return state;
  }
}
export default cartReducer;