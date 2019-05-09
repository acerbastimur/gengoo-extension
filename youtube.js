ifUrlChange();

var request = {
  state: false
};

let _global = {
  wordLeft: 0
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
    $('.ytp-settings-button').click()
    $('.ytp-settings-button').click()
    $(".ytp-right-controls").prepend(
      "<img class='gengooSubmit gengooSubtitleClosed' src='https://firebasestorage.googleapis.com/v0/b/gengoo2192.appspot.com/o/icon.png?alt=media&token=0350a4bd-126f-4688-8739-cd4e2ff73e31' />"
    );

    var listenerScrnBtn = false;

    setInterval(()=>{
      if ($(".ytp-fullscreen-button").attr("title").indexOf("Full screen" || "Tam ekran") == -1) {
        // TO SET SUBTITLE POSITION
        $(".gengooSubmit").css({'margin-bottom':'5px', 'height':'45px'});// DEFAULT VALUE IN EVERY SCREEN
        listenerScrnBtn = false;
        subtitleVerticalAlignment();
        subtitleHorizontalAlignment();
      } else {
        $(".gengooSubmit").css({'margin-bottom':'5px', 'height':'25px'});// DEFAULT VALUE IN EVERY SCREEN
        listenerScrnBtn = true;
        subtitleVerticalAlignment();
        subtitleHorizontalAlignment();
      }
    },100)

    $(".ytp-fullscreen-button").on("click", () => {
      // TO SET SUBTITLE POSITION WHILE CLICKING TO THE SCREEN BUTTON
      if (listenerScrnBtn == false) {
        $(".gengooSubmit").css({'margin-bottom':'5px', 'height':'25px'});// DEFAULT VALUE IN EVERY SCREEN
        subtitleVerticalAlignment();
        subtitleHorizontalAlignment();
        listenerScrnBtn = true;
      } else {
        listenerScrnBtn = false;
        $(".gengooSubmit").css({'margin-bottom':'5px', 'height':'45px'});// DEFAULT VALUE IN EVERY SCREEN
        subtitleVerticalAlignment();
        subtitleHorizontalAlignment();
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
  var clickedListener = true;
  document.querySelectorAll(".gengooWord").forEach(element => {
    // TO REMOVE BACKGROUND IF THERE IS ON ANOTHER ONE
    $(element).css({
      "color": "white"
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
  var translateWith = choosenTrans.outerWidth( true );
  var clickedLeft = e.target.offsetLeft + ($('.html5-main-video').width() - $('.'+e.target.offsetParent.className).width())/2;
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
  tl.fromTo(
    clickedElement,
    0.4,
    {
      color: "white"
    },
    { color: "#5C9531", ease: Power3.easeOut }
  );
  subtitleMouseLeave(clickedListener);
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
}

function appendGengooSubtitle() {
  if ($(".gengooSubtitle").length == 0) {
    $(".html5-video-player").append("<div class='gengooSubtitle'> </div>");
    closePopupIfResize();
  }
  setInterval(() => {
    isYoutubeSettingsOpen();
  }, 300);
}

function waitForClick() {
  $(".gengooSubtitle").stop().click(e => {
    do {
      // DO WHILE BECAUSE WE WANT IT TO START ONCE
      if (_global.wordLeft > 0) {
        translate(e, e.target.innerText); // FIRST TRANSLATE WORD THAN INITIALIZE FOR UI
        _global.wordLeft = _global.wordLeft -1
        wordLeftUpdater(_global.wordLeft)
      }
    } while (false);
  });
}

function textPusher() {
  
  var autoTranslateControl = document.querySelector("#ytp-id-18 > div > div > div:nth-child(4) > div.ytp-menuitem-content").textContent;
  if ( autoTranslateControl.indexOf('auto-generated') != -1) {
    autoTranslatedSubtitle();
  } else {
    noneAutoTranslatedSubtitle();
  }
}

function autoTranslatedSubtitle() {
  var oldCaption = "";  // Old caption of the pushed line
  var newCaption = "";  // New caption of the pushed line
  setInterval(() => {
    newCaption = $('.caption-visual-line').last().text(); // Last line of the pushed caption
    if ( newCaption.length < oldCaption.length ) {  // If the youtube push new caption line
      createNewLine();
      waitForClick();
    } else if ( newCaption != oldCaption ) {
      $('.gengooSubtitle').empty();
      parser();
      subtitleVerticalAlignment();
    }
    oldCaption = $('.caption-visual-line').last().text(); // EQUAL THE TEXTS
}, 100);
}

function noneAutoTranslatedSubtitle() {
  var oldCaption = "";  // Old caption of the pushed line
  var newCaption = "";  // New caption of the pushed line
  setInterval(() => {
    newCaption = $('.caption-visual-line').last().text(); // Last line of the pushed caption
    if ( newCaption != oldCaption ) {  // If the youtube push new caption line
      createNewLine();
      parser(); // parse the new capiton as spaces
      subtitleVerticalAlignment();
      subtitleHorizontalAlignment();
      waitForClick();
    }
    oldCaption = $('.caption-visual-line').last().text(); // EQUAL THE TEXTS
}, 100);
}

function createNewLine() {
  clickedListener = false;
  $('.topGengooSubtitle').remove();  // remove the top line of the caption
  $('.gengooSubtitle').addClass('topGengooSubtitle'); // create a new top caption class name
  $('.topGengooSubtitle').removeClass('gengooSubtitle');  // remove the old caption class name
  $(".html5-video-player").append("<div class='gengooSubtitle'> </div>"); // create a new caption to push from youtube
  subtitleMouseOver();
  subtitleMouseLeave(clickedListener);
}

function parser() {
  $('.caption-visual-line').last()
  .text()
  .replace("?", "? ")
  .replace(".", ". ")
  .replace("!", "! ")
  .replace(/\xA0/g, " ")
  .split(" ")
  .forEach(element => {
    //SPLIT IT AS WORDS
    $(".gengooSubtitle").append(
      "<span class='gengooWord'>" + element + " </span>"
    ); // MAKE EVERY WORD A SPAN
  });
}

function subtitleVerticalAlignment() {
  var subtitleH = $('.gengooSubtitle').height();
  var videoSceenH = $('.html5-video-player').height();
  var youtubeTimeLineH = $('.ytp-chrome-bottom').height();
  var bottomSubAlignmentCalc = videoSceenH - youtubeTimeLineH - 55;
  var topSubAlignmentCalc = bottomSubAlignmentCalc - subtitleH - 5;
  $('.gengooSubtitle').css({'margin-top': bottomSubAlignmentCalc});
  $('.topGengooSubtitle').css({'margin-top': topSubAlignmentCalc});
  $(window).resize(function(){
    var subtitleH = $('.gengooSubtitle').height();
    var videoSceenH = $('.html5-video-player').height();
    var youtubeTimeLineH = $('.ytp-chrome-bottom').height();
    var bottomSubAlignmentCalc = videoSceenH - youtubeTimeLineH - 40;
    var topSubAlignmentCalc = bottomSubAlignmentCalc - subtitleH - 5;
    $('.gengooSubtitle').css({'margin-top': bottomSubAlignmentCalc});
    $('.topGengooSubtitle').css({'margin-top': topSubAlignmentCalc});
  });
}

function subtitleHorizontalAlignment() {
  var videoScreenW = $('.html5-main-video').width();
  var bottomGengooSubtitleW = $('.gengooSubtitle').width();
  var topGengooSubtitileW = $('.topGengooSubtitle').width();
  var calcBottomSubtitleMargin = ( videoScreenW - bottomGengooSubtitleW ) / 2;
  var calcTopSubtitleMargin = ( videoScreenW - topGengooSubtitileW ) / 2;
  $('.gengooSubtitle').css({
    'text-align':'center',
    'margin-left': calcBottomSubtitleMargin,
    'margin-left': calcBottomSubtitleMargin
  });
  $('.topGengooSubtitle').css({
    'text-align':'center',
    'margin-left': calcTopSubtitleMargin,
    'margin-left': calcTopSubtitleMargin
  });
  $(window).resize(function(){
    var videoScreenW = $('.html5-main-video').width();
    var bottomGengooSubtitleW = $('.gengooSubtitle').width();
    var topGengooSubtitileW = $('.topGengooSubtitle').width();
    var calcBottomSubtitleMargin = ( videoScreenW - bottomGengooSubtitleW ) / 2;
    var calcTopSubtitleMargin = ( videoScreenW - topGengooSubtitileW ) / 2;
    $('.gengooSubtitle').css({
      'text-align':'center',
      'margin-left': calcBottomSubtitleMargin,
      'margin-left': calcBottomSubtitleMargin
    });
    $('.topGengooSubtitle').css({
      'text-align':'center',
      'margin-left': calcTopSubtitleMargin,
      'margin-left': calcTopSubtitleMargin
    });
  })
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
    if ( $(".ytp-play-button").attr("aria-label").indexOf("Duraklat") != -1 ||
      $(".ytp-play-button").attr("aria-label").indexOf("Pause") != -1 ) {
      // PLAYING
      return true;
    } else if (
      $(".ytp-play-button").attr("aria-label").indexOf("Oynat") != -1 ||
      $(".ytp-play-button").attr("aria-label").indexOf("Play") != -1 ) {
      // PAUSED
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
  $(".gengooSubtitle, .topGengooSubtitle").remove();
}

async function translate(e, word) {

  if (e.target.className == "gengooWord") {
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

function subtitleMouseLeave(clickedListener) {
  $(".gengooSubtitle, .topGengooSubtitle, .choosenTrans").mouseleave(()=>{
    if ( isVideoPlaying() === false && !clickedListener ) {
      $(".ytp-play-button").click();
      $(".choosenTrans").stop().fadeOut(400)
      document.querySelectorAll(".gengooWord").forEach(element => {
        // TO REMOVE BACKGROUND IF THERE IS ON ANOTHER ONE
        $(element).css({
          "color": "white"
        });
      });
    } else if ( isVideoPlaying() === false && clickedListener ) {
      setTimeout(()=>{
        $(".ytp-play-button").click();
        $(".choosenTrans").stop().fadeIn(400)
        document.querySelectorAll(".gengooWord").forEach(element => {
          // TO REMOVE BACKGROUND IF THERE IS ON ANOTHER ONE
          $(element).css({
            "color": "white"
          });
        });
        clickedListener = false;
        var newTime = setTimeout(()=>{
          $(".ytp-play-button").click();
          $(".choosenTrans").stop().fadeOut(400)
          document.querySelectorAll(".gengooWord").forEach(element => {
            // TO REMOVE BACKGROUND IF THERE IS ON ANOTHER ONE
            $(element).css({
              "color": "white"
            });
          });
        },1000)
        $('.gengooSubtitle, .topGengooSubtitle, .choosenTrans').mouseover(()=>{
          clearTimeout(newTime);
        })
      },0)
    }
  });

}

function subtitleMouseOver() {
  $(".gengooSubtitle, .topGengooSubtitle").mouseover(()=>{
    if (isVideoPlaying() === true) {
      $(".ytp-play-button").click();
    }
  });
  $(".gengooSubtitle, .topGengooSubtitle").mouseover((e)=>{
    document.querySelectorAll(".gengooWord").forEach(element => {
      // TO REMOVE BACKGROUND IF THERE IS ON ANOTHER ONE
      $(element).css({
        "color": "white"
      });
    });
    $(e.target).css({'color':'skyblue'});
  })
}

function saveWords(word, translation) {
  if ( translation != undefined ) {
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
      $('.topGengooSubtitle, .gengooSubtitle').remove();
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
  for ( let i=0; i<words.length; i++ ) {
    if ( words[i]['translation'] == undefined ) {
      words.slice(0, i).concat(words.slice(i+2, words.length));
    }
  }
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
  getWordLeft();
}

function getWordLeft() {
  firebase
    .database()
    .ref("users/" + uid)
    .once("value", snapshot => {
      _global.wordLeft = snapshot.child("wordLeft").val();
      console.log("WORD LEFT IS ", _global.wordLeft);
    });
}
function wordLeftUpdater(count) {
  firebase
    .database()
    .ref("users/" + uid)
    .update( {
     wordLeft : count
    });
}
function isYoutubeSettingsOpen() {
  let settings = document.querySelector(".ytp-settings-button");

  if (settings) {
    let isOpen = settings.hasAttribute("aria-expanded");
    if (isOpen) {
      $(".gengooSubtitle").hide();
    } else {
      $(".gengooSubtitle").show();
    }
  }
}
