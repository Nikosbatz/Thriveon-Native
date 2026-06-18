import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Food, Recipe, UserInterface } from "../types";
import { api, BASE_URI } from "./axiosApi";

export async function login(email: string, password: string) {
  const loginData = { email: email, password: password };

  try {
    const res = await axios.post(`${BASE_URI}/user/login`, loginData, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    });

    if (res.status === 200) {
      if (res.data.accessToken) {
        await SecureStore.setItemAsync("accessToken", res.data.accessToken);
        await SecureStore.setItemAsync("refreshToken", res.data.refreshToken);
      } else {
        alert("Server could not create token");
      }
      return res.data;
    }
  } catch (error: any) {
    if (error.status === 401) {
      throw new Error("Wrong Credentials...");
    } else if (error.status === 403) {
      return error.response.data;
    }
  }
}

export async function googleLogin(googleData: any) {
  const authData = { googleData: googleData };

  try {
    const res = await axios.post(`${BASE_URI}/user/googleAuth`, authData, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    });

    if (res.status === 200 || res.status === 201) {
      if (res.data.accessToken) {
        await SecureStore.setItemAsync("accessToken", res.data.accessToken);
        await SecureStore.setItemAsync("refreshToken", res.data.refreshToken);
      } else {
        throw new Error("Could not create new session...");
      }
      return res.data;
    }
  } catch (error: any) {
    console.log(error);
    if (error.status === 401) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(error.message);
    }
  }
}

export async function register(email: string, password: string) {
  const registerData = { email: email, password: password };

  try {
    const res = await axios.post(`${BASE_URI}/user/register`, registerData, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    });
    if (res.status === 201) {
      return;
    }
  } catch (error: any) {
    if (error.status === 400) {
      throw new Error("A user with this E-mail already exists...");
    } else if (error.status === 409) {
      throw new Error("E-mail address is not valid.");
    }
  }
}

export async function getEmailVerificationToken(email: string) {
  try {
    const res = await axios.post(
      `${BASE_URI}/user/resend-verification-code`,
      {
        email: email,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
      },
    );
    if (res.status === 200) {
      return;
    }
  } catch (error: any) {
    if (error.status === 401) {
      throw new Error("User was not found!");
    } else {
      throw new Error("Could not send email to user!");
    }
  }
}

export async function postEmailVerificationToken(verificationToken: string) {
  try {
    const res = await axios.post(
      `${BASE_URI}/user/verify-email`,
      {
        verificationToken: verificationToken,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
      },
    );
    if (res.status === 200) {
      await SecureStore.setItemAsync("accessToken", res.data.accessToken);
      await SecureStore.setItemAsync("refreshToken", res.data.refreshToken);
    }
  } catch (error: any) {
    if (error.status === 400) {
      throw new Error("Invalid or Expired verification token!");
    } else {
      throw new Error("Server Error. Please try again later...");
    }
  }
}

export async function postForgotPasswordEmail(email: string, platform: string) {
  try {
    const res = await axios.post(
      `${BASE_URI}/user/forgot-password`,
      {
        email: email,
        platform: platform,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
      },
    );

    if (res.status === 200) {
      return;
    }
  } catch (error: any) {
    if (error.status === 404) {
      throw new Error("User wasn't found!");
    } else if (error.status === 400) {
      throw new Error("Something went wrong! Please try again later.");
    }
  }
}

export async function postResetPassword(password: string, token: string) {
  try {
    const res = await axios.post(
      `${BASE_URI}/user/reset-password/${token}`,
      {
        password: password,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
      },
    );

    if (res.status === 200) {
      return;
    }
  } catch (error: any) {
    if (error.status === 400) {
      throw new Error("Invalid password reset token.");
    } else {
      throw new Error("Unexpected Error!");
    }
  }
}

export async function postUserInfo(info: Partial<UserInterface>) {
  try {
    const res = await api.post(`${BASE_URI}/user/update-info`, info, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    });

    if (res.status === 200) {
      return res.data;
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getUserInfo() {
  try {
    const res = await api.get(`${BASE_URI}/user/info`, {
      headers: { Accept: "application/json" },
    });
    if (res.status === 200) {
      return res.data;
    }
  } catch (error: any) {
    if (error.status === 401) {
      throw new Error("User not Found!");
    } else {
      throw new Error("Uknown Error Code...");
    }
  }
}

export async function getFoods(path: string, date: string) {
  /* 
  path = "/foods" to fetch all the foods from the DB
  path = "/foods/userlogs" to fetch the User's food logs (Today currently...)
  */

  try {
    const res = await api.get(`${path}/${date}`, {
      headers: { Accept: "application/json" },
    });

    if (res.status === 200) {
      return res.data;
    }
  } catch (error: any) {
    // console.log(error);

    throw new Error(`${error.response.data}`);
  }
}

// Posts food object on /api/foods/userlogs
export async function postFood(data: Food, path: string, date: string) {
  try {
    const res = await api.post(`${path}/${date}`, data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    });

    if (res.status === 201 || res.status === 200) {
      return res.data;
    }
  } catch (error: any) {
    console.log(error.status);
    throw new Error("Something went wrong while logging your food...");
  }
}

export async function postRecipe(recipe: Recipe) {
  try {
    const res = await api.post(`foods/userlogs/myfoods`, recipe, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    });

    if (res.status === 201 || res.status === 200) {
      return res.data.myFoods;
    }
  } catch (error) {
    throw new Error("Could not create recipe...");
  }
}

export async function deleteRecipe(recipe: Recipe) {
  try {
    const res = await api.delete(`foods/userlogs/myfoods/${recipe._id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    });

    if (res.status === 200) {
      return res.data.myFoods;
    }
  } catch (error) {
    throw new Error("Could not delete recipe...");
  }
}

export async function deleteUserLogsFood(food: Food, date: string) {
  const res = await api.delete(`/foods/userlogs/${date}/${food._id}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
  });

  if (res.status === 200) {
    return;
  } else if (res.status === 500) {
    throw new Error();
  }
}

export async function getUserWaterIntake(date: string) {
  try {
    const res = await api.get(`/health/water-logs/${date}`, {
      headers: { Accept: "application/json" },
    });
    if (res.status === 200) {
      return res.data.water;
    }
  } catch (error: any) {
    throw new Error(`Error fetching user water intake: ${error.status}`);
  }
}

export async function postUserWaterIntake(water: number, date: string) {
  try {
    const res = await api.post(
      `/health/water-logs/${date}`,
      { water: water },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );

    if (res.status === 200 || res.status === 201) {
      return water;
    }
  } catch (error) {
    throw Error("Could not find userId...");
  }
}

export async function getUserActivities(date: string) {
  try {
    const res = await api.get(`/activities/user-logs/${date}`, {
      headers: { Accept: "application/json" },
    });

    if (res.status === 200) {
      return res.data;
    }
  } catch (error: any) {
    throw new Error(`Error fetching user activites: ${error.status}`);
  }
}

//TODO:change any type
export async function postUserActivity(activityValues: any, date: string) {
  const res = await api.post(`/activities/user-logs/${date}`, activityValues, {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
  });

  if (res.status === 200 || res.status === 201) {
    return res.data.data;
  } else {
    throw Error();
  }
}

export async function getUserWeightLogs(date: string) {
  try {
    let res = await api.get(`/health/weight-logs/${date}`, {
      headers: { Accept: "application/json" },
    });

    if (res.status === 200) {
      return res.data.data;
    }
  } catch (error) {
    throw new Error("Could not get weight logs");
  }
}

export async function postUserWeightLogs(weight: number, date: string) {
  try {
    const res = await api.post(
      `/health/weight-logs/${date}`,
      { weight: weight },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );

    if (res.status === 200 || res.status === 201) {
      return res.data.data;
    }
  } catch (error) {
    throw Error();
  }
}

export async function getBarcodeFood(code: string) {
  try {
    const res = await api.get(`/foods/barcode/${code}`);
    return res.data;
  } catch (error: any) {
    if (error.status === 404) {
      throw Error("Requested food doesn't exist in our database");
    } else {
      throw Error("");
    }
  }
}

export async function getSearchFoods(searchInput: string) {
  try {
    const res = await api.get(`/foods/search/${searchInput}`);
    return res.data;
  } catch (error: any) {
    throw new Error("Could not complete the search!");
  }
}

export async function getRecipes() {
  try {
    const res = await api.get(`/foods/recipes`);
    return res.data;
  } catch (error) {
    throw new Error("Could not fetch recipes!");
  }
}

export async function postRefreshToken() {
  const refreshToken = await SecureStore.getItemAsync("refreshToken");
  try {
    const res = await api.post(
      `/user/refresh-token`,
      { refreshToken: refreshToken },
      {
        headers: { Accept: "application/json" },
      },
    );

    console.log(res.data.accessToken);
    if (res.status === 201) {
      await SecureStore.setItemAsync("accessToken", res.data.accessToken);
      return res.data.accessToken;
    }
  } catch (error: any) {
    console.log(error);
    if (error.status === 400) {
      throw new Error("Error 400: Missing refresh token from request");
    } else if (error.status === 401) {
      throw new Error("Error 401: Refresh token invalid or expired");
    } else {
      throw new Error("Unknown Error...");
    }
  }
}

export async function authToken() {
  try {
    const res = await api.get("/user/auth");
    if (res.status === 200) {
      return true;
    } else if (res.status === 201) {
      return res.data.token;
    }
  } catch (error) {
    console.log("authToken error");
  }

  throw new Error();
}
