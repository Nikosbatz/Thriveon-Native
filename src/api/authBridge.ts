let logoutHandler: (() => void) | null = null;

export const setLogoutHandler = (func: () => void) => {
  logoutHandler = func;
};

export const triggerLogout = () => {
  logoutHandler?.();
};
