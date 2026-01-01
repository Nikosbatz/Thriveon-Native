import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { api, BASE_URI } from "./axiosApi";

export async function login(email: string, password: string) {
  const loginData = { email: email, password: password };

  console.log(loginData);

  try {
    const res = await axios.post(`${BASE_URI}/user/login`, loginData, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    });
    if (res.status === 200) {
      console.log("login code 200");
      if (res.data.accessToken) {
        await SecureStore.setItemAsync("token", res.data.accessToken);
      } else {
        alert("Server could not create token");
      }
      return res.data;
    }
  } catch (error: any) {
    if (error.status === 401) {
      // console.log("login code 401");
      throw new Error("Wrong Credentials...");
    } else if (error.status === 403) {
      // console.log("login code 403");
      return error.response.data;
    }
  }
}

export async function register(email: string, password: string) {
  const registerData = { email: email, password: password };

  console.log("register data:" + registerData);

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
      }
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
  console.log("Verify Email");

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
      }
    );
    if (res.status === 200) {
      await SecureStore.setItemAsync("token", res.data.accessToken);
    }
  } catch (error: any) {
    if (error.status === 400) {
      throw new Error("Invalid or Expired verification token!");
    } else {
      throw new Error("Server Error. Please try again later...");
    }
  }
}

export async function postForgotPasswordEmail(email: string) {
  console.log("Verify Email");
  const res = await axios.post(
    `${BASE_URI}/user/forgot-password`,
    {
      email: email,
    },
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    }
  );

  if (res.status === 200) {
    return;
  } else if (res.status === 400) {
    throw new Error("User wasn't found");
  }
}

export async function postResetPassword(password: string, token: string) {
  console.log("Reset Password");

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
    }
  );

  if (res.status === 200) {
    return;
  } else if (res.status === 400) {
    throw new Error("Invalid password reset token.");
  }
}
//TODO: change any
export async function postUserInfo(info: any) {
  const res = await api.post(`${BASE_URI}/user/update-info`, info, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
  });

  if (res.status === 200) {
    return res.data;
  } else {
    throw new Error(
      "Something went wrong. If the error persists please contact support"
    );
  }
}

export async function getUserInfo() {
  try {
    const res = await api.get(`${BASE_URI}/user/info`, {
      headers: { Accept: "application/json" },
    });
    console.log("katw apo to res getUserInfo");
    if (res.status === 200) {
      console.log("res.data: ", res.data);
      return res.data;
    }
  } catch (error: any) {
    console.log("getUserInfo error: ", error);
    if (error.status === 401) {
      throw new Error("User not Found!");
    } else {
      throw new Error("Uknown Error Code...");
    }
  }
}

export async function getFoods(path: string) {
  /* 
  path = "/foods" to fetch all the foods from the DB
  path = "/foods/userlogs" to fetch the User's food logs (Today currently...)
  */

  try {
    const res = await api.get(`${path}`, {
      headers: { Accept: "application/json" },
    });
    if (res.status === 200) {
      //console.log(data);
      return res.data;
    }
  } catch (error: any) {
    throw new Error(`${error.response.data}`);
  }
}

// Posts food object on /api/foods
//TODO:change any type
export async function postFood(data: FoodType, path: string) {
  try {
    const res = await api.post(`${path}`, data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    });

    if (res.status === 201 || res.status === 200) {
      console.log(res.data);
      return res.data;
    }
  } catch (error: any) {
    if (error.response.status === 409) {
      throw new Error(
        `Error: ${error.response.status}\nAn Item with this name already exists! `
      );
    } else {
      // console.log(error.response.status);
      throw new Error(`${error}`);
    }
  }
}

//TODO:change any type
export async function deleteUserLogsFood(food: LoggedFoodType) {
  console.log(food);
  const res = await api.delete(`/foods/userlogs/${food._id}`, {
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

export async function getUserWaterIntake() {
  try {
    const res = await api.get(`/health/water-logs`, {
      headers: { Accept: "application/json" },
    });
    if (res.status === 200) {
      return res.data.water;
    }
  } catch (error: any) {
    throw new Error(`Error fetching user water intake: ${error.status}`);
  }
}

export async function postUserWaterIntake(water: number) {
  console.log("water " + water);

  try {
    const res = await api.post(
      `/health/water-logs`,
      { water: water },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (res.status === 200 || res.status === 201) {
      console.log("postWater status 200", res.data);
      return res.data;
    }
  } catch (error) {
    throw Error("Could not find userId...");
  }
}

export async function getUserActivities() {
  try {
    const res = await api.get(`/activities/user-logs`, {
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
export async function postUserActivity(activityValues: any) {
  const res = await api.post(`/activities/user-logs`, activityValues, {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
  });

  if (res.status === 200 || res.status === 201) {
    return res.data.data;
  } else {
    throw Error();
  }
}

export async function getUserWeightLogs() {
  let res = await api.get(`/health/weight-logs`, {
    headers: { Accept: "application/json" },
  });

  if (res.status === 200) {
    return res.data;
  } else {
    throw new Error();
  }
}

export async function postUserWeightLogs(weight: number) {
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ weight: weight }),
  };

  const res = await api.post(
    `/health/weight-logs`,
    { weight: weight },
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  if (res.status === 200 || res.status === 201) {
    return res.data;
  } else {
    throw Error();
  }
}
