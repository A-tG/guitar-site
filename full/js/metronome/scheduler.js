function MetrScheduler(state, audioCtx, worker)
{
    this.metrState = state;
    this.audioCtx = audioCtx;
    this.worker = worker;
    this.msgEnum = msgActionEnum.metr;
    this.Q = [];
    this.nextBeatNumber = 0;
    this.lookAheadNumber = 1;

    this.init();
}

MetrScheduler.prototype.scheduleBeats = function()
{
    while (this.Q.length > 1)
    {
        var beat = this.Q.shift();
        this.audio.scheduleBeat(beat);
        this.metrAnimation.scheduleBeatVisual(beat, this.getDurBetweenBeats());
    }
}

MetrScheduler.prototype.addBeatsToQ = function(number)
{
    var delay = this.getDurBetweenBeats();
    var lastBeatTime = this.Q[this.Q.length - 1].audioTime;
    if ((this.audio.getTime() + delay * number) >= lastBeatTime)
    {
        for (var i = this.Q.length; i < number; i++)
        {
            this.nextBeatNumber = (this.nextBeatNumber + 1) % this.metrState.beats;
            var beat = new MetrBeat(lastBeatTime + delay, this.nextBeatNumber, delay / 2);
            this.Q.push(beat);
            lastBeatTime = this.Q[this.Q.length - 1].audioTime;
        }
        this.scheduleBeats();
    }
}

MetrScheduler.prototype.beatsSchedulerTick = function()
{
    if (this.Q.length > 0)
    {
        var tickTime = 1 / this.ticksPerSecond;
        var lookAheadNumber = Math.ceil((tickTime * 2) / this.getDurBetweenBeats()) + 1;
        this.lookAheadNumber = lookAheadNumber;
        this.addBeatsToQ(lookAheadNumber);
    } else
    {
        var beat = new MetrBeat(this.audio.getTime(), this.nextBeatNumber, this.getDurBetweenBeats() / 2);
        this.Q.push(beat);
    }
}

MetrScheduler.prototype.beatsSchedulerStart = function()
{
    this.clearQ();
    this.nextBeatNumber = 0;
}

MetrScheduler.prototype.clearQ = function()
{
    this.Q = [];
}

MetrScheduler.prototype.getDurBetweenBeats = function()
{
    return (240 / this.metrState.beatValue) / this.metrState.tempo;
}

MetrScheduler.prototype.onRateChange = function()
{
    if (!this.metrState.isPlaying) {return;}
    this.audio.clearAudioQ();
    if (this.getDurBetweenBeats() * this.lookAheadNumber > 0.5)
    {
        this.clearQ();
        this.metrAnimation.animationQ.clear();
    }
}

MetrScheduler.prototype.getWorkerTickrate = function()
{
    var msg = new workerMsg(this.msgEnum.getTickrate);
    this.worker.postMessage(msg);
}

MetrScheduler.prototype.onWorkerMessage = function(e)
{
    var action = e.data.action;
    var data = e.data.data;
    switch (action)
    {
        case this.msgEnum.tick:
            this.beatsSchedulerTick();
            break;
        case this.msgEnum.tickrate:
            this.ticksPerSecond = data;
            break;
    }
}

MetrScheduler.prototype.updateVolume = function()
{
    this.audio.updateVolume()
}

MetrScheduler.prototype.start = function()
{
    this.beatsSchedulerStart();
    this.metrAnimation.play();
    var msg = new workerMsg(this.msgEnum.startTicking);
    this.worker.postMessage(msg);
}

MetrScheduler.prototype.stop = function()
{
    this.audio.clearAudioQ();
    this.metrAnimation.stop();
    var msg = new workerMsg(this.msgEnum.stopTicking);
    this.worker.postMessage(msg);
}

MetrScheduler.prototype.init = function()
{
    this.audio = new MetrAudio(this.metrState, this.audioCtx, this.worker);
    this.audio.updateVolume(this.metrState.volume);
    this.metrAnimation = new MetrCanvPointerAnimation(this.audioCtx, $('#' + METR_BEAT_VIS_POINTER_BLOCK_ID));
    this.worker.onmessage = this.onWorkerMessage.bind(this);
    this.getWorkerTickrate();
}
