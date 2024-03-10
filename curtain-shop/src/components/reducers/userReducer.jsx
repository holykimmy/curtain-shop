export function userReducer(state = null, action) {
  switch (action.type) {
    case "LOGIN":
      return "welcome";

    case "LOGOUT":
      return "see u agint";
    default:
      return state;
  }
}
