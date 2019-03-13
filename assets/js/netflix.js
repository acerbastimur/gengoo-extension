console.log("NETFLİX IS OPENED");

let _global = {
  checkFirst: true,
  highlightedWords: []
};

main();

function main() {
  setInterval(() => {
    $(".player-timedtext-text-container").css("z-index", "10000");
  }, 150);
  setInterval(() => {
    if (isPlaying() == "Playing") {
      hideTranslateArea();
    }
  }, 1000);

  isHover();
  appendTranslateArea();
}

function appendTranslateArea() {
  $("body").append("<div class='translateArea'></div>");
}

function pauseVideo() {
  if ($(".button-nfplayerPause")) {
    $(".button-nfplayerPause").click();
  }
}

function playVideo() {
  if ($(".button-nfplayerPlay")) {
    $(".button-nfplayerPlay").click();
  }
}

function isPlaying() {
  let length = $(".button-nfplayerPlay").length;
  if (length) {
    console.log("paused");

    return "Paused";
  } else {
    console.log("playing");

    return "Playing";
  }
}

function isHover() {
  let element = $(".player-timedtext-text-container"); // player-timedtext && player-timedtext-text-container

  if (element.length == 0) {
    setTimeout(() => {
      element = null; // GARBAGE COLLECTOR <3
      console.log("-");
      return isHover();
    }, 100);
  } else {
    console.log("else ye girdi");

    $("*").mouseover(function(e) {
      var par = $(e.target);
      console.log("item is", par.classList);

      if (par.parent()[0].className == "player-timedtext-text-container") {
        if ($(".gengooWord").length == 0) {
          makeGengooWords();
          ifGengooWordClicked();
          // console.log("gengoo word is ", $(".gengooWord").text());
        }
        //console.log(par);
      }
    });

    /*  $("*").mouseleave(function(e) {
      var par = $(e.target);
      // console.log("leave", par.parent()[0].firstChild.className);

      if (par.parent()[0].firstChild.className == "gengooWord") {
        // YOU ARE HERE
        playVideo();
      }
    }); */
  }
}

const makeGengooWords = () => {
  try {
    new SplitText(".player-timedtext-text-container", {
      type: "words",
      wordsClass: "gengooWord wordNumber++"
    });
  } catch (err) {
    console.log("Nothing found to split");
  }
};

const gengooSubHover = () => {};
const ifGengooWordClicked = () => {
  const gengooWord = $(".gengooWord");
  gengooWord.click(e => {
    pauseVideo();
    translate(e);
    
  });
};

const translate = async e => {
  const word = e.target.textContent;
  const wordNumber = e.target.classList[1];
  console.log(word, wordNumber);
  highlightSelectedWord(wordNumber, "red");
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
      showPopup(data[0], data[1], data[2]);
      popupResponsive(e);
      //popUp(e, data[0], data[1], data[2]); // NOW JUST FIRST TRANSLATION IS SENT TO POPUP
      //saveWords(word, data[0]);
    } else {
      console.log("error");
    }
  };
  request.send();
};

const highlightSelectedWord = (className, color) => {
  const isThere = document.getElementsByClassName(className)[0];

  if (isThere) {
    highlightRemover();
    _global.highlightedWords.push(className);
    // isThere.style.color = color;
    $(isThere).toggleClass("highlight");
  }
};

const highlightRemover = () => {
  if (_global.highlightedWords.length) {
    _global.highlightedWords.forEach(element => {
      const isExist = document.getElementsByClassName(element)[0];
      if (isExist) {
        isExist.style.color = "white";
      }

      _global.highlightedWords.pop();
    });
  }
};

const showPopup = (translatedText, translatedText1, translatedText2) => {
  const translateArea = $(".translateArea");
  translateArea.empty();

  translateArea.append(
    "<span class='translatedText'>" + translatedText + "</span>"
  );

  if (translatedText1) {
    translateArea.append(
      "<br><span class='translatedText' >" + translatedText1 + "</span>"
    );
  }
  if (translatedText2) {
    translateArea.append(
      "<br><span class='translatedText'>" + translatedText2 + "</span>"
    );
  }

  translateArea.css("display", "block");
};

function hideTranslateArea() {
  const translateArea = $(".translateArea");
  translateArea.css("display", "none");
  highlightRemover();
}

const popupResponsive = e => {
  
  const left = $(e.target).offset().left;
  const top = $(e.target).offset().top - 20;
  const width = $(e.target).width();
  const height = $('.translateArea').height();
  console.log(height);
  
  const translated_word_width = $('.translateArea').width();
  if ( width >= translated_word_width ) {
    const calculation = left + ( translated_word_width - width ) / 2;
    $('.translateArea').stop().animate({marginLeft:calculation,marginTop:top - height},300)
  } else {
    const calculation = left - ( translated_word_width - width ) / 2;
    $('.translateArea').stop().animate({marginLeft:calculation,marginTop:top - height},300)
  }
};
