let loop = null;

const state = process.env.state || { text: 'unset' };
const inputQueue = [];

process.on('message', ({ event, msg }) => {
    switch (event) {
        case 'msg':
            inputQueue.push(msg);
            break;
        case 'die':
            endSelf(loop);
            break;
    }
});

loop = setInterval(() => {
    // process.send({ msg: Date.now() });
    if (inputQueue.length) {
        process.send({ msg: inputQueue.shift() });
    }
}, 1000 / 30);

function endSelf(interval) {
    console.log('process dying')
    clearInterval(interval);
    process.exit();
}