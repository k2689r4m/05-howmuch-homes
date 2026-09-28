import axios from "axios";
import VueCookies from "vue-cookies";
import router from "./router";

const _domain = "https://hmhomes.kr/home";
// const _domain = "https://plushdev.com/home";

// const _domain = "https://192.168.0.12/home";

let id = 1;
let handlers = {};

function onMessageReceive(handle, error, data) {
  if (error) {
    handlers[handle].resolve(data);
  } else {
    handlers[handle].reject(data);
  }
  delete this.handlers[handle];
}

// window.addEventListener("onMessageReceive", onMessageReceive, false);
window.onMessageReceive = onMessageReceive;
// function _apiGET(url) {
//   try {
//     axios.get(url).then(({ data }) => {
//       console.log(data);

//       return data;
//     });
//   } catch (e) {
//     console.log(e);
//   }
// }

function _getOsCheck() {
  let mobile = /iphone|ipad|ipod|android/i.test(
    navigator.userAgent.toLowerCase()
  );

  let currentOS = "";

  if (mobile) {
    // 유저에이전트를 불러와서 OS를 구분합니다.
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.search("android") > -1) {
      currentOS = "android";
    } else if (
      userAgent.search("iphone") > -1 ||
      userAgent.search("ipod") > -1 ||
      userAgent.search("ipad") > -1
    ) {
      currentOS = "ios";
    } else {
      currentOS = "else";
    }
  } else {
    // 모바일이 아닐 때
    currentOS = "nomobile";
  }

  return currentOS;
}

function _getAppCheck() {
  if (_getOsCheck() == "nomobile") {
    return "none";
  } else if (window.Android) {
    return "android";
  } else {
    return "ios";
  }
}

function _getUUID() {
  const isOs = _getAppCheck();

  if (isOs == "android") {
    return window.Android.GetDeviceInfo();
  } else if (isOs == "ios") {
    return "ios";
  } else {
    return "1";
  }
}

function _getId() {
  const isOs = _getAppCheck();

  if (isOs == "android") {
    return window.Android.GetGuestId();
  } else if (isOs == "ios") {
    alert("아이폰임");
    iosGetId()
      .then((re) => {
        console.log(re);
      })
      .catch((err) => {
        console.log(err);
      });
    return "IOS UUID ~~";
  } else {
    return "1";
  }
}

function iosGetId() {
  return new Promise((resolve, reject) => {
    const handle = "m" + id++;
    handlers[handle] = { resolve, reject };
    // window.webkit.messageHandlers.postKey.postMessage({
    //   key: "test",
    //   id: handle,
    // });

    window.webkit.messageHandlers.getKey.postMessage({
      id: handle,
    });
  });
}

function iosGetDeviceInfo() {
  return new Promise((resolve, reject) => {
    const handle = "m" + id++;
    handlers[handle] = { resolve, reject };

    window.webkit.messageHandlers.IOS.postMessage({
      id: handle,
    });
  });
}

function ztest(re) {
  // sendMessage(data) {
  //   return new Promise((resolve, reject) => {
  //     const handle = 'm'+ this.id++;
  //     this.handlers[handle] = { resolve, reject};
  //     window.webkit.messageHandlers.<yourHandler>.postMessage({data: data, id: handle});
  //   });
  // }

  alert(re);
}

function setFToken() {
  const myOs = _getAppCheck();

  if (myOs == "android") {
    const ftokon = window.Android.getFToken();

    if (ftokon == "" || ftokon == null) {
      return false;
    }

    axios
      .post(_domain + "/ft", {
        Token: ftokon,
      })
      .then((re) => {
        console.log(re);
      });
  }
}

async function _agree() {
  const re = await axios.get(_domain + "/agree");
  if (re.data.d.Agree != 1) {
    router.push({
      name: "Agree",
    });
    // alert("asdasd");
    // location.href = "https://hmhomes.kr/agree";
    console.log(router);
    return false;
  } else {
    return true;
  }
}

async function _login(domain) {
  let myUUID = _getUUID();
  const myOs = _getAppCheck();

  let maxCnt = 1;

  if (domain == null) {
    domain = _domain;
  }

  while (maxCnt > 0) {
    try {
      // myUUID = "1";
      if (myUUID == "1") {
        const re = await axios.post(domain + "/auth", {
          UUID: myUUID,
          GuestId: "2b41q7nkvlft8dc1q7nkvlft8dd",
        });
        axios.defaults.headers.common["jwt"] = re.headers.jwt;
        VueCookies.set("jwt", re.headers.jwt);
        // await _agree();
        return re;
      } else {
        //내 db에 key값이 있는지 확인
        let keyId = "";

        if (myOs == "android") {
          keyId = window.Android.GetGuestId();
        } else {
          const iosRe = await iosGetId();
          myUUID = await iosGetDeviceInfo();
          keyId = iosRe;
        }

        ////있으면 uuid + key /auth 요청
        if (keyId != "") {
          const re = await axios.post(domain + "/auth", {
            UUID: myUUID,
            GuestId: keyId,
          });
          axios.defaults.headers.common["jwt"] = re.headers.jwt;
          VueCookies.set("jwt", re.headers.jwt);
          // await _agree();

          setFToken();
          return re;
        }

        ////없으면 uuid /auth 요청
        else {
          const re = await axios.post(domain + "/auth", {
            UUID: myUUID,
          });

          if (myOs == "android") {
            window.Android.SetGuestId(re.data.GuestId);
          } else {
            window.webkit.messageHandlers.postKey.postMessage({
              key: re.data.GuestId,
            });
          }

          axios.defaults.headers.common["jwt"] = re.headers.jwt;
          VueCookies.set("jwt", re.headers.jwt);
          // await _agree();

          setFToken();
          return re;
        }
      }
    } catch (e) {
      maxCnt--;
    }
  }
}

function logout() {
  VueCookies.keys().forEach((cookie) => VueCookies.remove(cookie));
  delete axios.defaults.headers.common.jwt;
  router.go();
}

const methods = {
  // apiGEO: async (lat, lng) => {
  //   let maxCnt = 3;
  //   while (maxCnt > 0) {
  //     try {
  //       const re = await axios.get(
  //         "https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?request=coordsToaddr&coords=129.1133567,35.2982640&sourcecrs=epsg:4326&output=json&orders=legalcode"
  //       );
  //       console.log(re);
  //       return re;
  //     } catch (e) {
  //       if (e.response && e.response.status === 418) {
  //         await _login(_domain);
  //       }
  //       maxCnt--;
  //     }
  //   }
  //   console.log(lat, lng);
  // },

  apiGET: async (path) => {
    let maxCnt = 1;
    let msg = "잠시후 다시 시도 해주세요.";
    while (maxCnt > 0) {
      try {
        const re = await axios.get(_domain + path);
        axios.defaults.headers.common["jwt"] = re.headers.jwt;
        VueCookies.set("jwt", re.headers.jwt);
        return re;
      } catch (e) {
        if (
          (e.response && e.response.status === 418) ||
          e.response.status === 401
        ) {
          logout();
          // await _login(_domain);
        } else if (
          e.response &&
          e.response.data &&
          e.response.data.message &&
          e.response.status === 400
        ) {
          const re = { data: { code: e.response.status } };
          msg = e.response.data.message;

          if (msg == "약관 동의를 해주세요.") {
            await _agree();
          }
          alert(msg);
          return re;
        } else if (e.response && e.response.data && e.response.data.message) {
          msg = e.response.data.message;
        }
        maxCnt--;
      }
    }
    // alert(msg);
    console.log(msg);
  },

  apiPOST: async (path, param) => {
    let maxCnt = 1;
    let msg = "잠시후 다시 시도 해주세요.";
    while (maxCnt > 0) {
      try {
        const re = await axios.post(_domain + path, param);
        axios.defaults.headers.common["jwt"] = re.headers.jwt;
        VueCookies.set("jwt", re.headers.jwt);
        return re;
      } catch (e) {
        if (
          (e.response && e.response.status === 418) ||
          e.response.status === 401
        ) {
          logout();
          // await _login(_domain);
        } else if (
          e.response &&
          e.response.data &&
          e.response.data.message &&
          e.response.status === 400
        ) {
          const re = { data: { code: e.response.status } };
          msg = e.response.data.message;

          if (msg == "약관 동의를 해주세요.") {
            await _agree();
          }
          alert(msg);
          return re;
          // break;
        } else if (e.response && e.response.data && e.response.data.message) {
          msg = e.response.data.message;
        }
        maxCnt--;
      }
    }
    // alert(msg);
    console.log(msg);
  },

  getAppCheck: () => {
    return _getAppCheck();
  },

  getUUID: () => {
    const isOs = _getAppCheck();

    if (isOs == "android") {
      return window.Android.GetDeviceInfo();
    } else if (isOs == "ios") {
      return "IOS UUID ~~";
    } else {
      return "1";
    }
  },

  getId: () => {
    return "123";
  },

  login: async () => {
    return _login(null);
  },

  logout() {
    // axios.defaults.headers.common["jwt"] = re.headers.jwt;
    // VueCookies.remove("jwt");
    VueCookies.keys().forEach((cookie) => VueCookies.remove(cookie));
    delete axios.defaults.headers.common.jwt;
  },

  setLogin: () => {
    if (VueCookies.get("jwt")) {
      axios.defaults.headers.common["jwt"] = VueCookies.get("jwt");
    }
  },

  numberToKorean: (number) => {
    number = parseInt(number);
    number = number * 10000;
    number = String(number);

    var inputNumber = number < 0 ? false : number;
    var unitWords = ["", "만 ", "억 ", "조 ", "경 "];
    var splitUnit = 10000;
    var splitCount = unitWords.length;
    var resultArray = [];
    var resultString = "";

    for (var i = 0; i < splitCount; i++) {
      var unitResult =
        (inputNumber % Math.pow(splitUnit, i + 1)) / Math.pow(splitUnit, i);
      unitResult = Math.floor(unitResult);
      if (unitResult > 0) {
        if (i == 0) {
          resultArray[i] = 0;
        } else {
          resultArray[i] = unitResult;
        }
      }
    }

    for (let i = 0; i < resultArray.length; i++) {
      if (!resultArray[i]) continue;
      resultString = String(resultArray[i]) + unitWords[i] + resultString;
    }

    return resultString;
  },

  numberToKorean2: (number) => {
    number = String(number);

    var inputNumber = number < 0 ? false : number;
    var unitWords = ["", "만 ", "억 ", "조 ", "경 "];
    var splitUnit = 10000;
    var splitCount = unitWords.length;
    var resultArray = [];
    var resultString = "";

    for (var i = 0; i < splitCount; i++) {
      var unitResult =
        (inputNumber % Math.pow(splitUnit, i + 1)) / Math.pow(splitUnit, i);
      unitResult = Math.floor(unitResult);
      if (unitResult > 0) {
        if (i == 0) {
          resultArray[i] = 0;
        } else {
          resultArray[i] = unitResult;
        }
      }
    }

    for (let i = 0; i < resultArray.length; i++) {
      if (!resultArray[i]) continue;
      resultString = String(resultArray[i]) + unitWords[i] + resultString;
    }

    return resultString;
  },
};

const local = { _login, _getId, ztest };

export default {
  local,
  install(Vue) {
    Vue.prototype.$getAppCheck = methods.getAppCheck;
    Vue.prototype.$getUUID = methods.getUUID;
    Vue.prototype.$getId = methods.getId;
    Vue.prototype.$apiGET = methods.apiGET;
    Vue.prototype.$apiPOST = methods.apiPOST;
    Vue.prototype.$logout = methods.logout;
    Vue.prototype.$login = methods.login;
    Vue.prototype.$setLogin = methods.setLogin;
    Vue.prototype.$numberToKorean = methods.numberToKorean;
    Vue.prototype.$numberToKorean2 = methods.numberToKorean2;
  },
};
