ifUrlChange();

var request = {
  state: false
};

let CollectedWords = [];
let uid;
chrome.storage.local.get("uid", function(result) {
  console.log("%c Value currently is ", "color:red;background-color:yellow");
  console.log(result.uid);
  uid = result.uid;
  initialize(result.uid);
});

function initialize(uid) {
  // INITIALIZE GENGOO

  if (window.location.href.includes("https://www.youtube.com/watch")) {
    if (uid != null) {
      console.log(
        "%c GENGOO IS OPENED !",
        "background: #222;  bakcground-color: green"
      );
      main();
      firebaseInitialization();
    } else {
      setTimeout(() => {
        var makeBlock = document.querySelector(".captions-text");
        if (makeBlock != null) {
          makeBlock.style.display = "block";
        }
        setInterval(() => {
          var makeBlock2 = document.querySelector(".captions-text");
          if (makeBlock2 != null) {
            makeBlock2.style.display = "block";
          }
        }, 100);
      }, 1000);
    }
  }
}

function main() {
  if (document.querySelector(".ytp-subtitles-button").style.display != "none") {
    console.log(document.querySelector(".ytp-subtitles-button").style.display);
    hideYoutubeSubtitleIcon(); // TO HIDE YOUTUBE'S SUBTITLE ICON
    getVideoEnd();
    $(".ytp-right-controls").prepend(
      "<img class='gengooSubmit gengooSubtitleClosed' src='https://firebasestorage.googleapis.com/v0/b/gengoo2192.appspot.com/o/icon.png?alt=media&token=0350a4bd-126f-4688-8739-cd4e2ff73e31' />"
    );

    var listenerScrnBtn = false;

    if ($(".ytp-fullscreen-button").attr("title") == "Full screen") {
      // TO SET SUBTITLE POSITION
      $(".gengooSubmit").height("52px"); // DEFAULT VALUE IN EVERY SCREEN
      listenerScrnBtn = false;
    } else {
      $(".gengooSubmit").height("34px"); // DEFAULT VALUE IN EVERY SCREEN
      listenerScrnBtn = true;
    }

    $(".ytp-fullscreen-button").on("click", () => {
      // TO SET SUBTITLE POSITION WHILE CLICKING TO THE SCREEN BUTTON
      if (listenerScrnBtn == false) {
        $(".gengooSubmit").height("34px"); // DEFAULT VALUE IN EVERY SCREEN
        listenerScrnBtn = true;
      } else {
        listenerScrnBtn = false;
        $(".gengooSubmit").height("5px"); // DEFAULT VALUE IN EVERY SCREEN
      }
    });

    $(".gengooSubmit").on("click", () => {
      console.log("CLICKED, GENGOO SUBTITLE IS", !request.state);

      if (request.state == false) {
        // TO CHANGE GENGOO SUBTITLE STATE
        request.state = true;
      } else {
        request.state = false;
      }

      if (request.state === true) {
        $(".gengooSubmit").removeClass("gengooSubtitleClosed"); // TO HIGHLIGHT IT

        if ($(".ytp-subtitles-button").attr("aria-pressed") == "false") {
          // IF THERE IS NO SUBTITLE THAN OPEN IT
          toggleYoutubeSubtitle();
        }

        isSubtitleShowing(".captions-text").then(() => {
          // AFTER BEING SURE THAT YOUTUBE'S SUBTITLES ARE OPEN

          hideYoutubeSubtitle();

          appendGengooSubtitle();

          textPusher();

          waitForClick();

          hoverSubtitle();
        });
      } else if (request.state == false) {
        $(".gengooSubmit").addClass("gengooSubtitleClosed"); // TO UNHIGHLIGHT SUBMIT BUTTON

        removeGengooSubtitle();
      }
    });
  }
}

function ifUrlChange() {
  // REFRESH IF URL CHANGES :(
  console.log(window.location.href);
  var oldUrl = window.location.href;
  setInterval(() => {
    if (window.location.href != oldUrl) {
      oldUrl = window.location.href;
      console.log(window.location.href);
      window.location.reload();
    }
  }, 300);
}

function popUp(e, translatedText, translatedText1, translatedText2) {
  removeChosenTrans();
  appendTrans();
  var choosenTrans = $(".choosenTrans");
  var clickedElement = $(e.target);
  document.querySelectorAll("#gengooWord").forEach(element => {
    // TO REMOVE BACKGROUND IF THERE IS ON ANOTHER ONE
    $(element).css({
      "background-color": "transparent"
    });
  });
  /* PUSH DOM A CONTAINER FOR TRANSLATE OBJECTS */
  choosenTrans.append(
    "<span class='translatedText'>" + translatedText + "</span>"
  );

  if (translatedText1) {
    choosenTrans.append(
      "<br><span class='translatedText' >" + translatedText1 + "</span>"
    );
  }
  if (translatedText2) {
    choosenTrans.append(
      "<br><span class='translatedText'>" + translatedText2 + "</span>"
    );
  }
  var itemTop = e.currentTarget.offsetTop - choosenTrans.innerHeight();
  var clickedWith = clickedElement.width();
  var translateWith = choosenTrans.outerWidth(true);
  var clickedLeft = e.target.offsetLeft;
  if (clickedWith >= translateWith) {
    var itemLeft = clickedLeft + (clickedWith - translateWith) / 2;
  } else {
    var itemLeft = clickedLeft - (translateWith - clickedWith) / 2;
  }
  choosenTrans
    .offset({
      // POSITION OF THE SPAN OF TRANSLATED WORD
      top: itemTop,
      left: itemLeft
    })
    .fadeIn(400);
  var tl = new TimelineMax();
  tl.set(clickedElement, {
    borderRadius: "4px 4px 4px 4px"
  }).fromTo(
    clickedElement,
    0.4,
    {
      backgroundColor: "none"
    },
    { backgroundColor: "#5C9531", ease: Power3.easeOut }
  );
  hoverSubtitle(clickedElement);
}

function closePopupIfResize() {
  $(window).resize(function() {
    removeChosenTrans();
  });
}

function removeChosenTrans() {
  $(".choosenTrans").remove();
}

function appendTrans() {
  $(".html5-video-player").append("<div class='choosenTrans'> </div>");
  hoverSubtitle();
}

function appendGengooSubtitle() {
  if ($(".gengooSubtitle").length == 0) {
    $(".html5-video-player").append("<div class='gengooSubtitle'> </div>");
    closePopupIfResize();
  }
}

function waitForClick() {
  $(".gengooSubtitle").click(e => {
    do {
      // DO WHILE BECAUSE WE WANT IT TO START ONCE
      // console.log(e);
      translate(e, e.target.innerText); // FIRST TRANSLATE WORD THAN INITIALIZE FOR UI
    } while (false);
  });
}

function textPusher() {
  var oldCaptions = "";

  setInterval(() => {
    if ($(".captions-text").text() != oldCaptions) {
      // IF THERE IS A CHANGE IN YOUTUBE'S SUBTITLES
      removeChosenTrans(); // REMOVE TRANS OBJ IF THERE IS
      $(".gengooSubtitle").empty(); // MAKE GENGOO SUB. BLANK
      $(".captions-text")
        .text()
        .replace("?", "? ")
        .replace(".", ". ")
        .replace("!", "! ")
        .replace(/\xA0/g, " ")
        .split(" ")
        .forEach(element => {
          //SPLIT IT AS WORDS
          $(".gengooSubtitle").append(
            "<span id='gengooWord'>" + element + " </span>"
          ); // MAKE EVERY WORD A SPAN
          oldCaptions = $(".captions-text").text(); // EQUAL THE TEXTS
        });
    }
  }, 100);
}

function pauseVideoSequence(time) {
  if (isVideoPlaying() === true) {
    console.log("TRUE");

    $(".ytp-play-button").click();

    setTimeout(() => {
      $(".ytp-play-button").click();
    }, time);
  } else {
    console.log("Already paused!");
  }
}

function isVideoPlaying() {
  var attr = $(".ytp-play-button").attr("aria-label");
  if (attr) {
    if (
      $(".ytp-play-button")
        .attr("aria-label")
        .indexOf("Duraklat") != -1 ||
      $(".ytp-play-button")
        .attr("aria-label")
        .indexOf("Pause") != -1
    ) {
      // PLAYING //MUST BE INDEXOF
      return true;
    } else if (
      $(".ytp-play-button")
        .attr("aria-label")
        .indexOf("Oynat") != -1 ||
      $(".ytp-play-button")
        .attr("aria-label")
        .indexOf("Play") != -1
    ) {
      // PAUSED //MUST BE INDEXOF
      return false;
    }
  }
}

function toggleYoutubeSubtitle() {
  $(".ytp-subtitles-button").click();
}

function hideYoutubeSubtitleIcon() {
  $(".ytp-subtitles-button").css({
    display: "none"
  });
}

function hideYoutubeSubtitle() {
  setInterval(() => {
    $(".captions-text").css({
      visibility: "hidden"
    });
  }, 300);
}

function removeGengooSubtitle() {
  $(".gengooSubtitle").remove();
}

async function translate(e, word) {
  if (e.target.id == "gengooWord") {
    var request = new XMLHttpRequest();
    var words = [];
    request.open(
      "GET",
      "https://us-central1-gengoo2192.cloudfunctions.net/gengooTranslate/en/tr/" +
        word,
      true
    );
    request.onload = function() {
      // Begin accessing JSON data here

      var data = JSON.parse(this.response); // Begin accessing JSON data here

      if (request.status >= 200 && request.status < 400) {
        // console.log(e, data[0], data[1], data[2]);
        console.log(this.response);
        console.log(data);

        popUp(e, data[0], data[1], data[2]); // NOW JUST FIRST TRANSLATION IS SENT TO POPUP
        saveWords(word, data[0]);
      } else {
        console.log("error");
      }
    };
    request.send();
  }
}

async function isSubtitleShowing(selector) {
  return new Promise(resolve => {
    var checkExist = setInterval(async function() {
      if ($(selector).length) {
        clearInterval(checkExist);
        resolve(true);
      }
    }, 100);
  });
}

function hoverSubtitle(clickedElement) {
  var popupListener = false;
  $(".choosenTrans").mouseover(function() {
    popupListener = true;
  });
  $(".choosenTrans").mouseleave(function() {
    popupListener = false;
  });
  $(".gengooSubtitle").mouseleave(function() {
    setTimeout(() => {
      if (isVideoPlaying() === false && isVideoPlaying() === false) {
        $(".ytp-play-button").click();
        var tl = new TimelineMax();
        tl.to(".choosenTrans", 0.15, {
          y: 20,
          opacity: 0,
          delay: 0.5
        });
        if (clickedElement) {
          tl.to(clickedElement, 0.15, {
            backgorundColor: "none",
            delay: 0.5
          });
        }

        for (
          let index = 0;
          index < document.querySelectorAll("#gengooWord").length;
          index++
        ) {
          document.querySelectorAll("#gengooWord")[
            index
          ].style.backgroundColor = "transparent";
        }
      }
    }, 500);
  });

  $(".gengooSubtitle, .choosenTrans").mouseover(function() {
    if (isVideoPlaying() === true) {
      $(".ytp-play-button").click();
    }
  });
}

function saveWords(word, translation) {
  let checkIfThereIs = CollectedWords.filter(data => {
    return data.word == word;
  });

  if (checkIfThereIs.length == 0) {
    CollectedWords.push({
      word,
      translation
    });
  }
}

function getVideoEnd() {
  let endScreen = document.querySelector(".videowall-endscreen");
  if (endScreen) {
    if (
      document.querySelector(".videowall-endscreen").style.display == "none"
    ) {
      // console.log("%c NOT END", "color:purple;backgorund-color:green");
      setTimeout(() => {
        getVideoEnd();
      }, 300);
    } else {
      // console.log("%c END", "color:blue;backgorund-color:pink");
      setTimeout(() => {
        if (CollectedWords.length != 0) {
          addToCardUI();
        }
      }, 300);
    }
  }
}

function addToCardUI() {
  $(".ytp-upnext-cancel-button").click();
  console.log(CollectedWords);
  setInterval(() => {
    $(".ytp-videowall-still-image").hide();
    $(".ytp-suggestion-set").hide();
    $(".ytp-endscreen-next").hide();
    $(".ytp-endscreen-previous").hide();
    $(".gengooSubtitle").hide();
  }, 150);
  $(".ytp-endscreen-content").append(
    "<div class='createCard'>" +
      "<div class='createTitle'>" +
      document.querySelector("#container > h1 > yt-formatted-string")
        .innerText +
      "</div>"
  );
  $(".createCard").append("<div class='wordsContainer'></div> ");

  for (let index = 0; index < CollectedWords.length; index++) {
    $(".wordsContainer").append(
      "<div class='words'>" +
        CollectedWords[index].word +
        " " +
        CollectedWords[index].translation +
        "</div>"
    );
  }

  $(".createCard").append("<div class='send'>Create Card</div></div>");
  let videoHeight = $(".ytp-endscreen-content").height();
  let videoWidth = $(".ytp-endscreen-content").width();
  $(".createCard").css({
    height: videoHeight * 0.8,
    width: videoWidth * 0.5,
    "margin-left": videoWidth * 0.25
  });
  $(".wordsContainer").css({
    height: videoHeight * 0.6,
    width: videoWidth * 0.5
  });

  $(".send").click(() => {
    addToCard(
      document.querySelector("#container > h1 > yt-formatted-string").innerText,
      CollectedWords
    );
  });

  $(window).resize(function() {
    let videoHeight = $(".ytp-endscreen-content").height();
    let videoWidth = $(".ytp-endscreen-content").width();
    $(".createCard").css({
      height: videoHeight * 0.8,
      width: videoWidth * 0.5,
      "margin-left": videoWidth * 0.25
    });
    $(".wordsContainer").css({
      height: videoHeight * 0.6,
      width: videoWidth * 0.5
    });
  });
}

function addToCard(cardName, words) {
  firebase
    .database()
    .ref("cards/" + uid)
    .push({
      cardName: cardName,
      learningRate: 0,
      wordCounter: words.length,
      words: words
    })
    .then(() => {
      savedToCardsUI();
    });
}

function savedToCardsUI() {
  TweenMax.to(".createCard", 0.6, {
    transformOrigin: "50% 50%",
    scale: 0
  });
}

function firebaseInitialization() {
  var config = {
    apiKey: "AIzaSyBD9lKavl8YYX1mH0JQbMWEHRC-JE7COtk",
    authDomain: "gengoo2192.firebaseapp.com",
    databaseURL: "https://gengoo2192.firebaseio.com",
    projectId: "gengoo2192",
    storageBucket: "gengoo2192.appspot.com",
    messagingSenderId: "1049883744272"
  };
  firebase.initializeApp(config);
}
