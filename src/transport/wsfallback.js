module.exports = Wsfallback;

function Wsfallback() {

}

Wsfallback.WebSocket = () => {
    let ws = undefined


    if (typeof WebSocket !== 'undefined') {
        ws = WebSocket;
    } else if (typeof MozWebSocket !== 'undefined') {
        ws = MozWebSocket;
    } else if (typeof window !== 'undefined') {
        ws = window.WebSocket || window.MozWebSocket;
    }

    return ws
}