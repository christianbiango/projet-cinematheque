export const URL = {
  // Auth
  USER_LOGIN: "http://localhost:9000/api/auth/login",
  USER_CHECK_SIGNUP: "http://localhost:9000/api/auth/check-signup",
  USER_SIGNUP: "http://localhost:9000/api/auth/signup",
  USER_SESSION: "http://localhost:9000/api/auth/session",

  // User
  GET_USER_INFORMATIONS: "http://localhost:9000/api/user/account",
  UPDATE_USER_INFORMATIONS: "http://localhost:9000/api/user/update-account",
  UPDATE_USER_PASSWORD: "http://localhost:9000/api/user/update-password",
  CHECK_RECOVER_PASSWORD_TOKEN:
    "http://localhost:9000/api/user/check-recover-password-token",
  USER_LOGOUT: "http://localhost:9000/api/user/logout",
  GET_HOME_MOVIES: "http://localhost:9000/api/user/movies",
  GET_MOVIES_PREFERENCES: "http://localhost:9000/api/user/movies-preferences",
  GET_MOVIE_PREFERENCE: "http://localhost:9000/api/user/movie-preference",
  PATCH_MOVIES_PREFERENCES:
    "http://localhost:9000/api/user/patch/movie-preference",
  GET_TMDB_MOVIE: "http://localhost:9000/api/user/tmdb-movie",
  GET_NEAR_USER_MOVIES: "http://localhost:9000/api/user/near-movies",
  UPDATE_USER_PASSWORD_REQUEST:
    "http://localhost:9000/api/user/update-password-request",
  DELETE_ACCOUNT: "http://localhost:9000/api/user/delete-account",
};
