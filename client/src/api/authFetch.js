import { refreshAccessToken } from "./auth";

export const authFetch = async (url, options = {}) => {
  let accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (res.status === 403 && refreshToken) {
    // refresh token
    const newTokens = await refreshAccessToken(refreshToken);

    if (newTokens.accessToken) {
      localStorage.setItem("accessToken", newTokens.accessToken);

      // retry request
      return fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${newTokens.accessToken}`
        }
      });
    }
  }

  return res;
};
