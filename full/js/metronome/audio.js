function MetrAudio(audioCtx, worker)
{
    this.ctx = audioCtx;
    this.worker = worker;
    this.volume = 0;
    this.clickOscType = "square";

    this.scheduleBeat = function(beat)
    {
        var osc = this.ctx.createOscillator();
        osc.type = this.clickOscType;
        var freq = SECOND_CLICK_FREQ;
        var duration = this.secondClickDur;
        if (beat.number == 0)
        {
            freq = FIRST_CLICK_FREQ;
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
        this.rampAudio(beat.audioTime, duration)
    }

    this.getDurationForFreq = function(freq, closeDuration)
    {
        var desiredDuration = closeDuration;
        var cycleDuration = 1 / freq;
        var completedCycles = Math.floor(desiredDuration / cycleDuration);
        return completedCycles * cycleDuration;
    }

    this.rampAudio = function(time, soundDur)
    {
        var transitionDur = soundDur * 0.05;
        this.rampNode.gain.setTargetAtTime(0, time + transitionDur, transitionDur * 2);
        var transitionDur = soundDur + soundDur * 0.25;
        this.rampNode.gain.setTargetAtTime(1, time + transitionDur, 0);

    }

    this.getTime = function()
    {
        return this.ctx.currentTime;
    }

    this.setVolumePercent = function(vol)
    {
        this.volume = sliderLogVal(vol, 1, 100) / 100;
        this.gainNode.gain.value = this.volume;
    }

    this.getVolumePercent = function()
    {
        return this.volume * 100;
    }

    this.clearAudioQ = function()
    {
        this.dummyNode.disconnect();
        this.dummyNode = {};
        this.initDummyNode();
    }

    this.initRampNode = function()
    {
        this.rampNode = this.ctx.createGain();
        this.rampNode.connect(this.ctx.destination);
    }

    this.initGainNode = function()
    {
        this.gainNode = this.ctx.createGain();
        this.setVolumePercent(DEFAULT_METR_VOLUME);
        this.gainNode.gain.value = this.volume;
        this.gainNode.connect(this.rampNode);
    }

    this.initDummyNode = function()
    {
        this.dummyNode = this.ctx.createGain();
        this.dummyNode.connect(this.gainNode);
    }

    this.init = function()
    {
        this.initRampNode();
        this.initGainNode();
        this.initDummyNode();
        this.firstClickDur = this.getDurationForFreq(FIRST_CLICK_FREQ, 0.05);
        this.secondClickDur = this.getDurationForFreq(SECOND_CLICK_FREQ, 0.05);
    }

    this.init();
}
