let loop = null;

const state = {
    units: []
};
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
    if (inputQueue.length) {

        const action = inputQueue.shift();
        if (action.event === 'newUnit') {
            state.units.push(action.payload);

            process.send({ msg: action });
        }

    }
}, 1000 / 30);

function endSelf(interval) {
    console.log('process dying')
    clearInterval(interval);
    process.exit();
}