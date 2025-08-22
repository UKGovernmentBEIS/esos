const PREFERENCES_SET_COOKIE = "uk_esos_cookies_preferences_set";
const COOKIES_POLICY = "uk_esos_cookies_policy";

function init() {
  document.getElementById("success-message-cookies").style.display = "none";
  const cookieValue = JSON.parse(getCookie(COOKIES_POLICY));
  if (cookieValue) {
    if (cookieValue.usage) {
      document.getElementById("use-google-analytics").checked = true;
    } else {
      document.getElementById("do-not-use-google-analytics").checked = true;
    }
  }
}

/**
 * Delete the existing cookies.
 */
function deleteCookies() {
  setCookie(PREFERENCES_SET_COOKIE, "", {
    expires: -1
  });
  setCookie(COOKIES_POLICY, "", {
    expires: -1
  });
}

/**
 * Save two cookies when pressing the save button.
 */
function savePreferences() {
  let setPreferencesCookie = getCookie(PREFERENCES_SET_COOKIE);
  if (setPreferencesCookie) {
    deleteCookies();
  }
  const cookieExpirationTime = 365;
  const d = new Date();
  d.setTime(d.getTime() + cookieExpirationTime * 24 * 60 * 60 * 1000); // Valid for 1 year
  setCookie(PREFERENCES_SET_COOKIE, "true", {
    // secure: true,
    expires: d
  });
  setCookie(
    COOKIES_POLICY,
    JSON.stringify({
      essential: true,
      usage: document.getElementById("use-google-analytics").checked
    }),
    {
      // secure: true,
      expires: d
    }
  );
  document.getElementById("success-message-cookies").style.display = "block";
  document.getElementById("success-message-cookies").focus();
}

/**
 * Set a new Cookie
 * @param name The name of the Cookie
 * @param value The value of the Cookie
 * @param options Additional configuration of the Cookie
 */
function setCookie(name, value, options) {
  const cookieOptions = {
    path: "/",
    ...options
  };

  if (cookieOptions.expires instanceof Date) {
    cookieOptions.expires = cookieOptions.expires.toUTCString();
  }

  let updatedCookie = name + "=" + value;

  Object.keys(cookieOptions).forEach(option => {
    updatedCookie += "; " + option;
    let optionValue = cookieOptions[option];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  });

  document.cookie = updatedCookie;
}

/**
 * Get the value of a specific Cookie if exists
 * @param name The name of the Cookie
 */
function getCookie(name) {
  const cookieName = name + "=";
  const cookieValue = document.cookie.split(";");
  for (const cookie of cookieValue) {
    let c = cookie;
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(cookieName) === 0) {
      return c.substring(cookieName.length, c.length);
    }
  }
  return null;
}

function goBack() {
  window.history.back();
}

// cookie for index

/**
 * Display the pop up if the user has not accept the Cookies
 */
function checkIfCookiesNotAccepted() {
  if (notAccepted()) {
    // check if cookies are disabled by browser
    if (!navigator.cookieEnabled) {
      document.getElementById("acceptAllCookiesBtn").disabled = true;
      document.getElementById("setPreferencesCookiesBtn").disabled = true;
    }

    document.getElementById("global-cookie-message-to-accept").style.display =
      "block";
  } else {
    document.getElementById("global-cookie-message-to-accept").style.display =
      "none";
  }
}

function hideCookieMessage() {
  document.getElementById("global-cookie-message-approval").style.display =
    "none";
}

/**
 * Accept all cookies in the application.
 */
function acceptAllCookies() {
  if (!navigator.cookieEnabled) {
    return;
  }
  document.getElementById("global-cookie-message-approval").style.display =
    "block";
  document.getElementById("global-cookie-message-to-accept").style.display =
    "none";
  const d = new Date();
  d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000); // Valid for 1 year
  setCookie(PREFERENCES_SET_COOKIE, "true", {
    // secure: true,
    expires: d
  });
  setCookie(
    COOKIES_POLICY,
    JSON.stringify({
      essential: true,
      usage: true
    }),
    {
      // secure: true,
      expires: d
    }
  );
}

/**
 * Check if the Cookies have been accepted by the user
 */
function notAccepted() {
  return getCookie(PREFERENCES_SET_COOKIE) === null;
}

/**
 * Set a new Cookie
 * @param name The name of the Cookie
 * @param value The value of the Cookie
 * @param options Additional configuration of the Cookie
 */
function setCookie(name, value, options) {
  const cookieOptions = {
    path: "/",
    ...options
  };

  if (cookieOptions.expires instanceof Date) {
    cookieOptions.expires = cookieOptions.expires.toUTCString();
  }

  let updatedCookie = name + "=" + value;

  Object.keys(cookieOptions).forEach(option => {
    updatedCookie += "; " + option;
    let optionValue = cookieOptions[option];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  });

  document.cookie = updatedCookie;
}

/**
 * Get the value of a specific Cookie if exists
 * @param name The name of the Cookie
 */
function getCookie(name) {
  const cookieName = name + "=";
  const cookieValue = document.cookie.split(";");
  for (const cookie of cookieValue) {
    let c = cookie;
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(cookieName) === 0) {
      return c.substring(cookieName.length, c.length);
    }
  }
  return null;
}

/**
 * Redirects to Set Preferences page
 */
function goToSetPreferences() {
  location.href = '/cookies';
}