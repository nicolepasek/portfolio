(function () {
  var PASSWORD = "blue";
  var COOKIE_NAME = "auth";
  var MAX_AGE = 60 * 60 * 24; // 24 hours

  document.documentElement.style.visibility = "hidden";

  function reveal() {
    document.documentElement.style.visibility = "";
  }

  function getCookie(name) {
    var match = document.cookie.match("(?:^|; )" + name + "=([^;]*)");
    return match ? match[1] : null;
  }

  function setCookie(name, value) {
    document.cookie = name + "=" + value + ";path=/;max-age=" + MAX_AGE;
  }

  function isAuthed() {
    return getCookie(COOKIE_NAME) === "ok";
  }

  function currentPage() {
    var page = location.pathname.split("/").pop();
    return page || "index.html";
  }

  function getNextParam() {
    var match = location.search.match(/[?&]next=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  function showIncorrect() {
    function render() {
      document.body.innerHTML =
        '<p style="text-align:center;margin-top:20vh;font-family:sans-serif">Incorrect password.</p>';
      reveal();
    }
    if (document.body) {
      render();
    } else {
      document.addEventListener("DOMContentLoaded", render);
    }
  }

  if (isAuthed()) {
    if (currentPage() === "index.html") {
      var authedNext = getNextParam();
      if (authedNext && authedNext !== "index.html") {
        window.location.replace(authedNext);
        return;
      }
    }
    reveal();
    return;
  }

  if (currentPage() !== "index.html") {
    window.location.replace("index.html?next=" + encodeURIComponent(currentPage()));
    return;
  }

  var entered = prompt("Enter password:");
  if (entered === PASSWORD) {
    setCookie(COOKIE_NAME, "ok");
    var next = getNextParam();
    if (next && next !== "index.html") {
      window.location.replace(next);
      return;
    }
    reveal();
  } else {
    showIncorrect();
  }
})();
