var uid = '';

console.log("TEST")

$(document).ready(function () {
    firebaseInitialization();
    checkAuthState();
    validationUI();
 
    $('.signInBtn').on("click", () => {
        var email = $('.email').val();
        var password = $('.password').val();
        signIn(email, password);
        checkAuthState();
    })

})


function logOut() {
    firebase.auth().signOut();
    chrome.storage.local.set({
        'uid': null
    });
    reloadPage();
}


function reloadPage() {
    chrome.tabs.getSelected(null, function (tab) {
        chrome.tabs.reload(tab.id);
    });
}

function checkAuthState() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            uid = user.uid;
            var providerData = user.providerData;
            signInUi();
            getUserInfoFromDb(user.uid);
            console.log("logged in as", uid)
            chrome.storage.local.set({
                'uid': uid
            });

            // ...
        } else {
            console.log("non auth");
            chrome.storage.local.set({
                'uid': null
            });


            $('.loading').hide()
        }
    });
}


function getUserInfoFromDb(uid) {
    console.log(uid)
    firebase.database().ref('/users').child(uid).once('value', data => {
        $('.loading').hide();
        let youtubeState = data.child("youtube").val();
        switchListener(youtubeState);
        if (youtubeState == false) {
            switchToFalse();

        }
        willSbtlOpn("youtube", youtubeState)
        let name = data.child("name").val();
        $('.username').text(name)
    })

}




function signIn(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password).then(data => {
            console.log("SIGNED IN ! = ", data);
            reloadPage();
            signInUi();

        })
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
            console.log(errorMessage);
            loginErrorUi();

        });



}





function openUrl() {
    $('body').on('click', 'a', function () {
        chrome.tabs.create({
            url: $(this).attr('href')
        });
        return false;
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



function validationUI() {
    const email = $('.email')
    const password = $('.password')
    email.keyup(function () {
        if (email.val() != '') {
            if (email.val().indexOf("@") != -1 && email.val().indexOf(".") != -1) {
                email.css({
                    'box-shadow': '0 2px 0 0 #05A539'
                })


            } else {
                email.css({
                    'box-shadow': '0 2px 0 0 #F7584A'
                })

            }
        } else {
            email.css({
                'box-shadow': '0 2px 0 0 #00ade2'
            })

        }
    })
    password.keyup(function () {
        if (password.val() != '') {
            password.css({
                'box-shadow': '0 2px 0 0 #05A539'
            })
        } else {
            password.css({
                'box-shadow': '0 2px 0 0 #F7584A'
            })
        }
    })
    password.focusout(function () {
        if (password.val() == '') {
            password.css({
                'box-shadow': '0 2px 0 0 #00ade2'
            })
        }
    })
}

function loginErrorUi() {
    const email = $('.email');
    const password = $('.password');
    password.css({
        'box-shadow': '0 2px 0 0 red',
        'filter': 'grayscale(0)'
    });
    email.css({
        'box-shadow': '0 2px 0 0 #F7584A',
        'filter': 'grayscale(0)'
    });

    TweenMax.fromTo('.email', 0.1, {
        x: -20
    }, {
        x: 20,
        repeat: 5,
        yoyo: true,
        ease: Sine.easeInOut,
        onComplete: function () {
            TweenMax.to(this.target, 1.5, {
                x: 0,
                ease: Elastic.easeOut
            })
        }
    });
    TweenMax.fromTo('.password', 0.12, {
        x: -20
    }, {
        x: 20,
        repeat: 5,
        delay: 0.01,
        yoyo: true,
        ease: Sine.easeInOut,
        onComplete: function () {
            TweenMax.to(this.target, 1.5, {
                x: 0,
                ease: Elastic.easeOut
            })
        }
    });

}

function signInUi() {
    const home = $('.home')
    const extProfile = $('.extProfile')
    counter = false
    if (counter == false) {
        counter = true
        home.css({
            'display': 'none'
        })
        extProfile.css({
            'display': 'block'
        })
    } else {
        counter = false
        home.css({
            'display': 'block'
        })
        extProfile.css({
            'display': 'none'
        })
    }

}

function switchToFalse() {
    const switchBall = $('.switchBall')
    const switchBox = $('.switchBox')
    TweenMax.to(switchBall, 0.15, {
        css: {
            'margin-left': '-2px',
            'filter': 'grayscale(1)'
        }
    })
    TweenMax.to(switchBox, 0.15, {
        css: {
            'filter': 'grayscale(1)'
        }
    })
}

function switchListener(firstState) {
    const switchTragger = $('.switch')
    const switchBall = $('.switchBall')
    const switchBox = $('.switchBox')
    let listener = firstState
    switchTragger.click(function () {
        if (listener == false) {
            listener = true
            TweenMax.to(switchBall, 0.15, {
                css: {
                    'margin-left': '-2px',
                    'filter': 'grayscale(1)'
                }
            })
            TweenMax.to(switchBox, 0.15, {
                css: {
                    'filter': 'grayscale(1)'
                }
            })
        } else {
            listener = false
            TweenMax.to(switchBall, 0.15, {
                css: {
                    'margin-left': '14px',
                    'filter': 'grayscale(0)'
                }
            })
            TweenMax.to(switchBox, 0.15, {
                css: {
                    'filter': 'grayscale(0)'
                }
            })
        }
    })
}




function willSbtlOpn(platform, flag) {
    var check = flag;

    $('.switch').on('click', () => {
        if (check == true) {
            platformStateChange(platform, check);
            check = false;
        } else {
            platformStateChange(platform, check);
            check = true;

        }

        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                state: !check
            })
        });

    });


}

function platformStateChange(platform, state) {
    firebase.database().ref('/users').child(uid).update({
        [platform]: state
    })
}