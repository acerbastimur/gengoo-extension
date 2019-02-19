console.log("NETFLİX IS OPENED");

let _global = {
  checkFirst: true
};

main();

function main() {
  setInterval(() => {
    $(".player-timedtext-text-container").css("z-index", "10000");
  }, 150);
 
  
  isHover();
   
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
  let element = $(".player-timedtext-text-container"); // player-timedtext && player-timedtext-text-container
  
   
  if (element.length == 0) {
    setTimeout(() => {
      element = null; // GARBAGE COLLECTOR <3
      console.log("-")
      return isHover();
    }, 100);
  } else {
    console.log("else ye girdi");
    
    $('*').mouseover(function(e){
      var par = $(e.target)
      // console.log(par);
      
       if(par.parent()[0].className == "player-timedtext-text-container") {
        pauseVideo();
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
         console.log(par);
        
         
      } 

     })

     $('*').mouseleave(function(e){
      var par = $(e.target)
       console.log("leave",par.parent()[0].firstChild.className);
      
       if(par.parent()[0].firstChild.className == "gengooWord") { // YOU ARE HERE
        playVideo()          
         
      } 

     })

  }
  //console.log(element);

  
  /* element.mouseenter(function(e) {
    alert()
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
  }); */

  
}
  