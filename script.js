var uid = '';

 

$(document).ready(function () {
    firebaseInitialization();
    checkAuthState();
    validationUI();
    openSetting();
    logOut();
    document.getElementById('email').addEventListener('keyup', function(event){
        if ( event.keyCode === 13 ) {
            document.getElementById('signInBtn').click()
        }
    })
    document.getElementById('password').addEventListener('keyup', function(event){
        if ( event.keyCode === 13 ) {
            document.getElementById('signInBtn').click()
        }
    })
    $('.signInBtn').on("click", () => {
        var email = $('.email').val();
        var password = $('.password').val();
        signIn(email, password);
        checkAuthState();
    })

    $('.userDetail').on('click', function () {
        navigateUrl("https://gengoo.net/contain/profile")
    })
    $(".userPhoto").on('click', function(){
        navigateUrl("https://gengoo.net/contain/profile")

    })
    $('.suggestButton').on('click', function() {
        navigateUrl('https://gengoo.net/contain/contact')
    })
    $('.register').on('click', function() {
        navigateUrl('https://gengoo.net/home')
    })
})

function navigateUrl(e) {
    chrome.tabs.create({url:e})
}

function logOut() {
    $('.logOut').click(function(){
        firebase.auth().signOut();
    chrome.storage.local.set({
        'uid': null
    });
    reloadPage();
    })
}

function openSetting() {
    var listener = true
    $('.settings').click(function(){
        if ( listener ) {
            var tl = new TimelineMax()
        tl
            .set('.userDetail', {
                display: 'block'
            })
            .to('.userDetail', 0.2, {
                y: 30,
                opacity: 1,
                delay: 0.1
            })
        tl
            .set('.logOut', {
                display: 'block'
            })
            .to('.logOut', 0.2, {
                y: 65,
                opacity: 1,
            })
        listener = false
        } else {
            var tl = new TimelineMax()
        tl
            .to('.userDetail', 0.2, {
                y: 20,
                opacity: 0,
                delay: 0.1
            })
            .set('.userDetail', {
                display: 'none'
            })
        tl
            .to('.logOut', 0.2, {
                y: 20,
                opacity: 0,
            })
            .set('.logOut', {
                display: 'none'
            })
        listener = true
        }
    });
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
            var isAnonymous = user.isAnonymous;
            uid = user.uid;
            var providerData = user.providerData;
            signInUi();
            getUserInfoFromDb(user.uid);
            console.log("logged in as", uid)
            chrome.storage.local.set({
                'uid': uid
            });
        } else {
            console.log("non auth");
            $('.loading').hide();
            chrome.storage.local.set({
                'uid': null
            });


            
        }
    });
}

function getUserInfoFromDb(uid) {
    console.log(uid)
    firebase.database().ref('/users').child(uid).once('value', data => {
        let youtubeState = data.child("youtube").val();
        switchListener(youtubeState);
        if (youtubeState == false) {
            switchToFalse();

        }
        willSbtlOpn("youtube", youtubeState)
        let name = data.child("name").val();
        let profilePhoto = data.child("pp").val();
        $('.username').text(name)
        $('.userImg').attr('src', profilePhoto)
        $('.loading').hide()
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
