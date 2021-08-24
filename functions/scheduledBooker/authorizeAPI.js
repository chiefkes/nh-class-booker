"use strict";

const axios = require("axios").default;
const $ = require("jquery-jsdom");
const Cookie = require("./cookie.js");
const config = require("./config.js").booking;
const constants = require("./constants.js");
const headers = constants.headers;
const { wait } = require("./wait.js");
const validate = require("./validation.js");
const Err = require("./error.js");

module.exports = async function authorizeAPI() {
  console.log(`---- Authorizing API ----`);

  const SSOToken = await withRetries("SSOToken", getSSOToken, (token) =>
    validate.SSOToken(token)
  );

  const { authToken, member_ID } = await withRetries(
    "AuthToken",
    async () => await getAuthToken(SSOToken),
    [
      ({ authToken }) => validate.authToken(authToken),
      ({ member_ID }) => validate.member_ID(member_ID),
    ]
  );

  return {
    authToken,
    member_ID,
  };
};

async function withRetries(name, func, predicate) {
  let errors = 0;

  for (let attempt = 0; attempt <= config.numBookingChecks; attempt++) {
    try {
      console.log(`Getting ${name} (attempt ${attempt + 1})`);
      let res = await func();
      if (typeof predicate === "function") predicate(res);
      else if (Array.isArray(predicate)) predicate.forEach((test) => test(res));
      else return false;
      return res;
    } catch (err) {
      errors++;
      console.error(err);
      if (errors >= config.errorRetries) {
        throw new Err("AUTH_API", `Too many errors getting getting ${name}!`);
      }
      //exponential back-off
      await wait(2 ** (errors / 2) * 200);
    }
  }
}

async function getSSOToken() {
  let { JSESSIONID, cookies, settings } = await onMicrosoftAuthorize();
  cookies = await onMicrosoftSubmitCredentials(cookies, settings);
  const code = await onMicrosoftGetCode(cookies, settings);
  const SSOToken = await login(JSESSIONID, code);
  return SSOToken;
}

async function getAuthToken(SSOToken) {
  let response = await axios({
    method: "post",
    url: `${constants.apiURL}/api/v1/login/sso/${config.company_ID}`,
    headers: constants.headers,
    data: {
      token: SSOToken,
    },
  });

  return {
    authToken: response.data.auth_token,
    member_ID: response.data._embedded.members[0].id,
  };
}

async function onMicrosoftAuthorize() {
  let id, redirect;
  try {
    await axios({
      method: "get",
      url: `${constants.nhURL}/account/idaaslogin`,
      maxRedirects: 0,
    });
  } catch (res) {
    // forcibly preventing redirect gives access to the set-cookie containing JSESSIONID cookie
    id = Cookie.parseSetCookie(res.response.headers, "JSESSIONID");
    redirect = res.response.headers.location;
  }
  validate.JSessionId(id.JSESSIONID);

  // "manually" continue re-direct request
  let res1 = await axios({
    method: "get",
    url: redirect,
    headers: {
      cookie: Cookie.stringify(id),
    },
  });

  let cookies = Cookie.parseSetCookie(res1.headers, "x-ms-cpim");
  validate.cookies(cookies, 4);
  let settings = parseSettings(res1.data);
  validate.authSettings(settings);

  return {
    JSESSIONID: id,
    cookies,
    settings,
  };
}

async function onMicrosoftSubmitCredentials(cookies, settings) {
  let res = await axios({
    method: "post",
    url: `${constants.onMicrosoftURL}/${settings.hosts.policy}/SelfAsserted?tx=${settings.transId}&p=${settings.hosts.policy}`,
    headers: {
      Cookie: Cookie.stringify(cookies),
      "X-Csrf-Token": settings.csrf,
    },
    data: `request_type=RESPONSE&email=${config.userLogin}&password=${config.userPassword}`,
  });

  let newCookies = Cookie.parseSetCookie(res.headers, "x-ms-cpim");
  validate.cookies(newCookies, 2);

  return {
    ...cookies,
    ...newCookies,
  };
}

async function onMicrosoftGetCode(cookies, settings) {
  let res = await axios({
    method: "get",
    url: `${constants.onMicrosoftURL}/${settings.hosts.policy}/api/CombinedSigninAndSignup/confirmed?rememberMe=true&csrf_token=${settings.csrf}&tx=${settings.transId}&p=${settings.hosts.policy}`,
    headers: {
      Cookie: Cookie.stringify(cookies),
    },
  });

  let code = $(res.data).find("#code").attr("value");
  validate.nuffLoginCode(code);
  return code;
}

async function login(JSESSIONID, code) {
  let userHomePage = await axios({
    method: "post",
    url: `${constants.nhURL}/account/login`,
    headers: {
      cookie: Cookie.stringify(JSESSIONID),
    },
    data: `code=${code}`,
  });

  let token = $(userHomePage.data)
    .find("div[member-sso-login]")
    .attr("member-sso-login");

  // validate.SSOToken(token);
  return token;
}

function parseSettings(html) {
  return JSON.parse(html.match(/(?<=SETTINGS = )(.*)(?=;)/g)[0]);
}
