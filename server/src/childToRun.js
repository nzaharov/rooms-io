let interval = null;

const state = process.env.state || { text: 'unset' };

process.on('message', ({ event, msg }) => {
    switch (event) {
        case 'msg':
            state.text = msg;
            break;
        case 'die':
            endSelf(interval);
            break;
    }
    console.log(event);
});

interval = setInterval(() => {
    process.send({ msg: Date.now() });
}, 1000);

function endSelf(interval) {
    console.log('process dying')
    clearInterval(interval);
    process.exit();
}