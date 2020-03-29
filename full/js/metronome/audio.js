function MetrAudio(state, audioCtx, worker)
{
    // audio nodes:  
    // oscilator(click) -> dummyNode(for removing scheduled clicks) -> rampNode (fadeOut for click) -> 
    //     gainNode (volume) -> EQ lowpass (to reduce possible fatigue) -> destination
    this.metrState = state;
    this.ctx = audioCtx;
    this.worker = worker;
    this.clickOscType = "square";
    this.validOscTypes = ["sine", "square", "sawtooth", "triangle"]
    this.dummyNode = {};
    this.rampNode = {};
    this.gainNode = {};
    this.eqNode = {};

    this.init();
}

MetrAudio.prototype.scheduleBeat = function(beat)
{
    var osc = this.ctx.createOscillator();
    osc.type = this.clickOscType;
    var freq = NORMAL_CLICK_FREQ;
    var duration = this.secondClickDur;
    if (beat.number == 0)
    {
        freq = ACCENT_CLICK_FREQ;
        duration = this.firstClickDur;
    }
    if (duration > beat.maxDur)
    {
        duration = this.getDurationForFreq(freq, beat.maxDur)
    }
    osc.frequency.value = freq;
    osc.connect(this.dummyNode);
    osc.start(beat.audioTime);
    osc.stop(beat.audioTime + duration);
    this.rampAudio(beat.audioTime, duration);
    osc.onended = function() {osc.disconnect()};
}

MetrAudio.prototype.getDurationForFreq = function(freq, closeDuration)
{
    var desiredDuration = closeDuration;
    var cycleDuration = 1 / freq;
    var completedCycles = Math.floor(desiredDuration / cycleDuration);
    return completedCycles * cycleDuration;
}

MetrAudio.prototype.rampAudio = function(time, soundDur)
{
    var transitionDur = soundDur * 0.05;
    this.rampNode.gain.setTargetAtTime(0, time + transitionDur, this.getTimeConstForClick(transitionDur));
    var transitionDur = soundDur + soundDur * 0.25;
    this.rampNode.gain.setTargetAtTime(1, time + transitionDur, Number.MIN_VALUE);
}

MetrAudio.prototype.getTimeConstForClick = function(dur)
{
    var timeConst = dur * 3;
    if (dur < 0.002)
    {
        timeConst = dur * 1.5;
    }
    if (dur < 0.0015)
    {
        timeConst *= 1.5;
    }
    if (dur < 0.001)
    {
        timeConst *= 1.5;
    }
    return timeConst;
}

MetrAudio.prototype.setClickType = function(type)
{
    var isValidType = this.validOscTypes.indexOf(type) !== -1;
    if (isValidType)
    {
        this.clickOscType = type;
    }
}

MetrAudio.prototype.getTime = function()
{
    return this.ctx.currentTime;
}

MetrAudio.prototype.updateVolume = function()
{
    this.gainNode.gain.value = sliderLogVal(this.metrState.volume, 1, 100) / 100;
}

MetrAudio.prototype.clearAudioQ = function()
{
    this.rampNode.disconnect();
    this.dummyNode.disconnect();
    this.rampNode = {};
    this.dummyNode = {};
    this.initRampNode();
    this.initDummyNode();
}

MetrAudio.prototype.initRampNode = function()
{
    this.rampNode = this.ctx.createGain();
    this.rampNode.connect(this.gainNode);
}

MetrAudio.prototype.initGainNode = function()
{
    this.gainNode = this.ctx.createGain();
    this.updateVolume();
    this.gainNode.connect(this.eqNode);
}

MetrAudio.prototype.initEqNode = function()
{
    this.eqNode = this.ctx.createBiquadFilter();
    this.eqNode.type = "lowpass";
    this.eqNode.frequency.value = LOWPASS_FILTER_FREQ;
    this.eqNode.connect(this.ctx.destination);
}

MetrAudio.prototype.initDummyNode = function()
{
    this.dummyNode = this.ctx.createGain();
    this.dummyNode.connect(this.rampNode);
}

MetrAudio.prototype.init = function()
{
    this.initEqNode();
    this.initGainNode();
    this.initRampNode();
    this.initDummyNode();
    this.firstClickDur = this.getDurationForFreq(ACCENT_CLICK_FREQ, 0.05);
    this.secondClickDur = this.getDurationForFreq(NORMAL_CLICK_FREQ, 0.05);
}
