"use strict";

function validate(name, validationObj) {
  let errors = Object.keys(validationObj).filter(
    (key) => validationObj[key] !== true
  );

  if (errors.length > 0) {
    console.warn(
      errors.reduce(
        (res, key) => Object.assign(res, { [key]: validationObj[key] }),
        {}
      )
    );
    throw new Error(`Invalid ${name} received`);
  }
}

function lengthCheck(item, length) {
  switch (typeof length) {
    case "number":
      return item.length === length || item.length;
    case "function":
      return length(item.length) || item.length;
    default:
      throw new Error(
        `The supplied length argument of type ${typeof length} is unsupported  for lengthCheck()`
      );
  }
}

function cookies(cookieObj, length) {
  // console.log(cookieObj);
  this.cookieIsObject = typeof cookieObj === "object";
  this.numCookies = lengthCheck(Object.keys(cookieObj), length);
}

function authSettings(settings) {
  this.settingsIsObject = typeof settings === "object";
  this.csrfExists = settings.hasOwnProperty("csrf");
  this.csrfLength = lengthCheck(settings.csrf, (i) => i >= 200);
  this.transIdExists = settings.hasOwnProperty("transId");
  this.transIdLength = lengthCheck(settings.transId, 78);
  this.hostsIsObject = typeof settings.hosts === "object";
  this.policyExists = settings.hosts.hasOwnProperty("policy");
  this.policyLength = lengthCheck(settings.hosts.policy, 32);
}

function JSessionId(id) {
  this.JSessionIdExists = id != null && typeof id === "string";
  this.JSessionIdLength = lengthCheck(id, 35);
}

function nuffLoginCode(code) {
  this.nuffCodeExists = code != null && typeof code === "string";
  this.nuffCodeLength = lengthCheck(code, (i) => i > 1000);
}

function SSOToken(token) {
  this.SSOTokenExists = token != null && typeof token === "string";
  this.SSOTokenLength = lengthCheck(token, 236);
}

function authToken(token) {
  this.authTokenExists = token != null && typeof token === "string";
  this.authTokenLength = lengthCheck(token, 22);
}

function member_ID(id) {
  this.memberIdExists = id != null && typeof id === "number";
  this.memberIdLength = lengthCheck(id.toString(), 5);
}

module.exports = {
  JSessionId: (id) => validate("JSESSIONID", new JSessionId(id)),
  cookies: (cookie, len) => validate("cookies", new cookies(cookie, len)),
  authSettings: (settings) =>
    validate("auth settings", new authSettings(settings)),
  nuffLoginCode: (code) => validate("login code", new nuffLoginCode(code)),
  SSOToken: (token) => validate("SSOToken", new SSOToken(token)),
  authToken: (token) => validate("authToken", new authToken(token)),
  member_ID: (id) => validate("member_ID", new member_ID(id)),
};
