const { fork } = require('child_process');
const { Subject, fromEvent } = require('rxjs');

class Worker {
    constructor() {
        this.child = fork('./src/childToRun.js');
        this.input = new Subject();
        this.input.subscribe((data) => {
            this.child.send(data);
        });
        this.output = fromEvent(this.child, 'message');
    }

    sendMsg(msg) {
        this.input.next({ event: 'msg', msg });
    }

    kill() {
        this.input.next({ event: 'die' });
        this.input.unsubscribe();
    }
}

module.exports = Worker;