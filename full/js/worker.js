var metronome = {
    tickIntervalID: null,
    tick: function()
    {
        postMessage('metronomeTick');
    },
    start: function()
    {
        this.tickIntervalID = setInterval(this.tick, 1000 / 60);
    },
    stop: function()
    {
        if (this.tickIntervalID != undefined)
        {
            clearInterval(this.tickIntervalID);
        }
    }
}

onmessage = function(e)
{
    var action = e.data;
    switch (action)
    {
        case 'startMetronomeTicking':
            metronome.start();
            break;
        case 'stopMetronomeTicking':
            metronome.stop();
            break;
    }
}
