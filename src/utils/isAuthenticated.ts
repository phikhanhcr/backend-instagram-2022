import jsonwebtoken from "jsonwebtoken";

function clearCookie(res) {
  res.clearCookie("user", { path: "/", domain: process.env.COOKIE_DOMAIN, httpOnly: false });
  res.clearCookie("jwt", { path: "/", domain: process.env.COOKIE_DOMAIN, httpOnly: false });
}

const isAuthenticated = async (req, res) => {
  try {
    let isMobileAuth = false;
    let token = '';
    if (req.headers && req.headers.token) {
      isMobileAuth = true;
      token = req.headers.token;
    }

    if (!req.signedCookies && !isMobileAuth) {
      clearCookie(res);
      return false;
    }
    if (!req.signedCookies.jwt && !isMobileAuth) {
      clearCookie(res);
      return false;
    }

    let jwt = {
      exp: 0,
    };
    
    if (!isMobileAuth) {
      jwt = await jsonwebtoken.verify(req.cookies.jwt, process.env.JWT_SECRET);
    } else {
      jwt = await jsonwebtoken.verify(token, process.env.JWT_SECRET);
    }

    let expiredJwt = new Date();
    if (jwt && jwt.exp) {
      expiredJwt = new Date(jwt.exp * 1000);
    }

    if (expiredJwt < new Date()) {
      clearCookie(res);
      return false;
    }
    return true;
  } catch (err) {
    clearCookie(res);
    return false;
  }
};

const getUserIdFromreq = async (req) => {
  try {
    let isMobileAuth = false;
    let token = '';
    if (req.headers && req.headers.token) {
      isMobileAuth = true;
      token = req.headers.token;
    }

    let jwt = {
      exp: 0,
      userID: '',
    };
    if (!isMobileAuth) {
      if (req.signedCookies && req.signedCookies.jwt) {
        const jwt = await jsonwebtoken.verify(req.cookies.jwt, process.env.JWT_SECRET);
        return jwt.userID;
      } else {
        return null;
      }
    } else {
      jwt = await jsonwebtoken.verify(token, process.env.JWT_SECRET);
      return jwt.userID;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};

export { isAuthenticated, getUserIdFromreq };
