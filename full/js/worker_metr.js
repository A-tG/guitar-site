importScripts("worker_msg.js")

var metronomeTicker = {
    tickIntervalID: null,
    ticksPerSecond: 30,
    msgEnum: msgActionEnum.metr,
    
    tick: function()
    {
        var msg = new workerMsg(this.msgEnum.tick);
        postMessage(msg);
    },

    start: function()
    {
        this.tickIntervalID = setInterval(this.tick.bind(this), 1000 / this.ticksPerSecond);
    },

    stop: function()
    {
        if (this.tickIntervalID != undefined)
        {
            clearInterval(this.tickIntervalID);
        }
    },

    tickrate: function()
    {
        var msg = new workerMsg(this.msgEnum.tickrate, this.ticksPerSecond);
        postMessage(msg);
    },

    onmessage: function(e)
    {
        var action = e.data.action;
        switch (action)
        {
            case this.msgEnum.startTicking:
                this.start();
                break;
            case this.msgEnum.stopTicking:
                this.stop();
                break;
            case this.msgEnum.getTickrate:
                this.tickrate();
        }
    }
}

onmessage = metronomeTicker.onmessage.bind(metronomeTicker);
