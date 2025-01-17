"use strict";
onmessage = function (e) {
    const payload = e.data.payload;
    switch (e.data.action) {
        case 'set':
            postMessage(setCookie(payload));
            break;
        case 'get':
        default:
            postMessage(getCookie(payload));
            break;
    }
};
function getCookie(payload) {
    let parsed;
    let cookieMap = new Map();
    if (typeof payload.data === 'string') {
        payload.data.split(';').map(v => {
            const rec = v.trim().split('=');
            cookieMap.set(rec[0], rec[1]);
        });
    }
    const cookieVal = cookieMap.get(payload.key);
    switch (payload.parse) {
        case 'jwt':
            parsed = parseJwt(cookieVal);
            break;
        case 'json':
            try {
                parsed = JSON.parse(cookieVal || '{}');
            }
            catch (e) {
                console.error("Unable to parse value as JSON. Detail:", e);
                parsed = {};
            }
            break;
        default:
            parsed = JSON.parse(cookieVal || '{}');
            break;
    }
    return parsed;
}
function setCookie(payload) {
    let parsed;
    switch (payload.parse) {
        case 'jwt':
            parsed = `${payload.key}=${payload.data};`;
            break;
        case 'json':
            if (typeof payload.data === 'string') {
                eval(`payload.data = JSON.stringify(${payload.data})`);
            }
            parsed = `${payload.key}=${payload.data};`;
            break;
        default:
            parsed = `${payload.key}=${payload.data};`;
            break;
    }
    return parsed;
}
function parseJwt(token) {
    if (token) {
        try {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        }
        catch (e) {
            console.error("Unable to parse JWT. Detail:", e);
            return {};
        }
    }
    else {
        return {};
    }
}
;
