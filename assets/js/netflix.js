console.log("NETFLİX IS OPENED");

let _global = {
  checkFirst: true
};

main();

function main() {
  setInterval(() => {
    find();
    $(".player-timedtext-text-container").css("z-index", "10000");
  }, 150);

  isHover();
  waitForClick();
  
}

/* function find() {
  let mock = $(".player-timedtext-text-container").text();

  setTimeout(() => {
    if (
      mock !== $(".player-timedtext-text-container").text() &&
      $(".player-timedtext-text-container").text() !== ""
    ) {
      mock = $(".player-timedtext-text-container").text();
      // console.log(mock);
    }
  }, 100);
}
 */

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

function isHover() {
  let element = $(".player-timedtext"); // player-timedtext && player-timedtext-text-container
  let element1 = $(".player-timedtext"); // player-timedtext && player-timedtext-text-container
 
   
  if (element.length == 0) {
    setTimeout(() => {
      element = null; // GARBAGE COLLECTOR <3
      return isHover();
    }, 100);
  }
  console.log(element,element1);

  element.mouseenter(function(e) {
    pauseVideo("pause");
    setInterval(() => {
      if ($(".gengooWord").length == 0) {
        try {
          new SplitText(".player-timedtext-text-container", {
            type: "words",
            wordsClass: "gengooWord"
          });
        } catch (err) {
          console.log("Nothing found to split");
        }
      }
    }, 100);
  });

  element.mouseleave(function(e) {
    playVideo();
  });
}

function waitForClick() {
  console.log("waiting for click");

  $("*").click(function(e){
   // console.log(e.target.class)
    })
}
