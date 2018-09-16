msgActionEnum = {}

msgActionEnum.metr = {
    startTicking: 1,
    stopTicking: 2,
    getTickrate: 3,
    tickrate: 4,
    tick: 5
}

function workerMsg(action, data)
{
    this.action = action;
    this.data = data;
}
