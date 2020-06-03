firebase.initializeApp({
    messagingSenderId: '623401606880'
});

function detectUnsupportedFeature() {
    if (window.location.protocol !== 'https:') {
        console.log('Is not from HTTPS');
    } else if (!('Notification' in window)) {
        console.log('Notification not supported');
    } else if (!('serviceWorker' in navigator)) {
        console.log('ServiceWorker not supported');
    } else if (!('localStorage' in window)) {
        console.log('LocalStorage not supported');
    } else if (!('fetch' in window)) {
        console.log('fetch not supported');
    } else if (!('postMessage' in window)) {
        console.log('postMessage not supported');
    }

    console.warn('This browser does not support desktop notification.');
    console.log('Is HTTPS', window.location.protocol === 'https:');
    console.log('Support Notification', 'Notification' in window);
    console.log('Support ServiceWorker', 'serviceWorker' in navigator);
    console.log('Support LocalStorage', 'localStorage' in window);
    console.log('Support fetch', 'fetch' in window);
    console.log('Support postMessage', 'postMessage' in window);
}
function canReceiveNotification() {
    return window.location.protocol === 'https:' &&
        'Notification' in window &&
        'serviceWorker' in navigator &&
        'localStorage' in window &&
        'fetch' in window &&
        'postMessage' in window;
}

function init() {
    if (canReceiveNotification()) {
        var messaging = firebase.messaging();

        if (Notification.permission === 'granted') {
            getToken(messaging);
        }

        // handle catch the notification on current page
        messaging.onMessage(function (payload) {
            console.log('Message received. ', payload);
            new Notification(payload.notification.title, payload.notification);
            /* // register fake ServiceWorker for show notification on mobile devices
             navigator.serviceWorker.register('messaging-sw.js');
             Notification.requestPermission(function(permission) {
             if (permission === 'granted') {
             navigator.serviceWorker.ready.then(function(registration) {
             payload.notification.data = payload.notification;
             registration.showNotification(payload.notification.title, payload.notification);
             }).catch(function(error) {
             // registration failed :(
             showError('ServiceWorker registration failed.', error);
             });
             }
             });*/
        });

        // Callback fired if Instance ID token is updated.
        messaging.onTokenRefresh(function () {
            messaging.getToken()
                .then(function (refreshedToken) {
                    console.log('Token refreshed.');
                    // Send Instance ID token to app server.
                    sendTokenToServer(refreshedToken);
                })
                .catch(function (error) {
                    console.log('Unable to retrieve refreshed token.', error);
                });
        });

    } else {
        detectUnsupportedFeature();
    }
}

function getToken(messaging) {
    messaging.requestPermission()
        .then(function() {
            // Get Instance ID token. Initially this makes a network call, once retrieved
            // subsequent calls to getToken will return from cache.
            messaging.getToken()
                .then(function(currentToken) {

                    if (currentToken) {
                        sendTokenToServer(currentToken);
                    } else {
                        console.log('No Instance ID token available. Request permission to generate one.');
                        setTokenSentToServer(false);
                    }
                })
                .catch(function(error) {
                    console.log('An error occurred while retrieving token.', error);
                    setTokenSentToServer(false);
                });
        })
        .catch(function(error) {
            console.log('Unable to get permission to notify.', error);
        });
}

// Send the Instance ID token your application server, so that it can:
// - send messages back to this app
// - subscribe/unsubscribe the token from topics
function sendTokenToServer(currentToken) {
    var serverUrl = '/provider/notifications/register';
    if (!isTokenSentToServer(currentToken)) {
        console.log('Sending token to server...');
        $.post(serverUrl, {token: currentToken});
        setTokenSentToServer(currentToken);
    } else {
        console.log('Token already sent to server so won\'t send it again unless it changes');
    }
}

function isTokenSentToServer(currentToken) {
    return window.localStorage.getItem('sentFirebaseMessagingToken') == currentToken;
}

function setTokenSentToServer(currentToken) {
    if (currentToken) {
        window.localStorage.setItem('sentFirebaseMessagingToken', currentToken);
    } else {
        window.localStorage.removeItem('sentFirebaseMessagingToken');
    }
}

function askPermission() {
    return new Promise(function(resolve, reject) {
        const permissionResult = Notification.requestPermission(function(result) {
            resolve(result);
        });

        if (permissionResult) {
            permissionResult.then(resolve, reject);
        }
    })
        .then(function(permissionResult) {
            if (permissionResult !== 'granted') {
                throw new Error('We weren\'t granted permission.');
            }
            init();
        });
}