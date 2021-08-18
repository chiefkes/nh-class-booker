const Cookie = require("cookie");

/**
 * Converts a "set-cookie" HTML header array into an object of cookies
 * @param {Array.<string>} header "set-cookie" header (array of strings representing each cookie)
 * @param {string|Array.<string>} [matchStr] optional string or array of strings for filtering returned cookies keys
 * @returns {Object.<string, string>} an object containing the cookies
 */
function parseSetCookie(header, matchStr = null) {
  if (!header || !header["set-cookie"] || !Array.isArray(header["set-cookie"]))
    throw new Error("Error parsing set-cookie header");

  const filterObjectProperties = (obj, predicate) =>
    Object.keys(obj)
      .filter((key) => predicate(key))
      .reduce((res, key) => Object.assign(res, { [key]: obj[key] }), {});

  return header["set-cookie"].reduce((cookies, cookie) => {
    const parsedCookie = Cookie.parse(cookie);
    return Object.assign(
      cookies,
      matchStr === null
        ? parsedCookie
        : filterObjectProperties(parsedCookie, (key) => {
            if (typeof matchStr === "string") return key.includes(matchStr);
            else if (Array.isArray(matchStr))
              return matchStr.some((str) => key.includes(str));
            else
              throw new Error(
                'argument "matchStr" should be a string or an array of strings'
              );
          })
    );
  }, {});
}

/**
 * Stringify a cookie object
 * @param {Object.<string, string>} cookies
 * @returns {string} The stringified cookie object
 */
function stringify(cookies) {
  let cookieString = "";
  for (let key in cookies) {
    cookieString += key + "=" + cookies[key] + "; ";
  }
  return cookieString;
}

module.exports = {
  parseSetCookie,
  stringify,
};
