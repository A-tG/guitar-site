var audioCtx;
var metronomeWorker;
var isMetronomeCanWork = false;

try
{
    audioCtx = new AudioContext;
    metronomeWorker = new Worker("js/worker_metr.js");
    isMetronomeCanWork = true;
}
catch (err)
{
    console.error(err);
}

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

function AnimationQ(timeCtx)
{
    this.ctx = timeCtx;
    this.Q = [];
    this.handle = null;
    this.maxQlength = 50;

    this.update = function(timestamp)
    {
        if (this.Q.length > 0)
        {
            var animation = this.Q[0];
            var startTime = animation.time;
            var targetTime = startTime + animation.duration;
            var currentTime = this.getCurrentTime();
            var isCurrentAnim = (currentTime >= startTime) && (currentTime <= targetTime);
            while (!isCurrentAnim && (this.Q.length > 1))
            {
                this.Q.shift();
                animation = this.Q[0];
                startTime = animation.time;
                targetTime = startTime + animation.duration;
                currentTime = this.getCurrentTime();
                isCurrentAnim = (currentTime >= startTime) && (currentTime <= targetTime);
            }
            if (isCurrentAnim)
            {
                if (animation.begin && !animation.isBeginDone)
                {
                    animation.isBeginDone = true;
                    animation.begin();
                }
                var progress = this.getAnimationProgress(currentTime, startTime, targetTime);
                this.setAngle(animation.el, 360 * progress);
            }
        }
        this.handle = requestAnimationFrame(this.update.bind(this));
    }

    this.getAnimationProgress = function(time, startTime, targetTime)
    {
        return (time - startTime) / (targetTime - startTime);
    }

    this.getCurrentTime = function()
    {
        return this.ctx.currentTime;
    }

    this.setAngle = function(el, deg)
    {
        el.setAttribute("style", "transform: rotate(" + deg + "deg);");
        deg = deg % 360;
    }

    this.push = function(anim)
    {
        if (this.Q.length < this.maxQlength)
        {
            this.Q.push(anim);
        }
    }

    this.clear = function()
    {
        this.Q = [];
    }

    this.stop = function()
    {
        cancelAnimationFrame(this.handle);
        this.clear();
    }

    this.start = function()
    {
        this.handle = requestAnimationFrame(this.update.bind(this));
    }
}

function MetrAnimation(timeCtx) 
{
    this.ctx = timeCtx;
    this.$beatVisNumber = $('#' + METR_BEAT_VIS_NUMBER_ID);
    this.$beatVisPointer = $('#' + METR_BEAT_VIS_POINTER_BLOCK_ID);
    this.pointerToAnimate = $('#' + METR_BEAT_VIS_POINTER_ID)[0];
    this.isPlaying = false;
    this.animationQ = new AnimationQ(timeCtx);

    this.scheduleBeatVisual = function(beat, duration)
    {
        var isFirstBeat = beat.number == 0;
        var animation = {el: this.pointerToAnimate, type: "rotaton360cw", time: beat.audioTime, duration: duration};
        var beginFunc = function()
        {
            this.$beatVisPointer.toggleClass(METR_BEAT_VIS_POINTER_OTHER_CLASS, !isFirstBeat).toggleClass(METR_BEAT_VIS_POINTER_FIRST_CLASS, isFirstBeat);
            this.$beatVisNumber.toggleClass(METR_FIRST_BEAT_VIS_NUMBER_CLASS, beat.number == 0);
            this.$beatVisNumber.text(beat.number + 1);
        }
        animation.begin = beginFunc.bind(this);
        this.animationQ.push(animation);
    }

    this.stop = function()
    {
        this.isPlaying = false;
        this.animationQ.stop();
        this.animationQ.setAngle(this.pointerToAnimate, 0)
        this.$beatVisNumber.text("");
        this.$beatVisPointer.hide();
    }

    this.play = function()
    {
        this.isPlaying = true;
        this.$beatVisPointer.show();
        this.animationQ.start();
    }

    this.$beatVisPointer.hide();
}

function MetrScheduler(ctx, worker)
{
    this.ctx = ctx;
    this.worker = worker;
}

function MetrBeat(time, number, maxDur)
{
    this.audioTime = time;
    this.number = number;
    this.maxDur = maxDur;
}

var metronome = {
    audioCtx: audioCtx,
    worker: metronomeWorker,
    msgEnum: msgActionEnum.metr,
    isPlaying: false,
    beats: DEFAULT_METR_BEATS,
    beatValue: DEFAULT_METR_BEAT_VAL,
    tempo: DEFAULT_METR_TEMPO,
    nextBeatNumber: 0,
    beatsQueue: [],

    $playBtn: $('#' + METR_PLAY_BTN_ID),
    $stopBtn: $('#' + METR_STOP_BTN_ID),
    $volumeRange: $('#' + METR_VOLUME_RANGE_ID),
    $tempoRange: $('#' + METR_TEMPO_RANGE_ID),
    $tempoOptionsBlock: $('#' + METR_TEMPO_OPTIONS_ID),
    $tempoInput: $('#' + METR_TEMPO_INPUT_ID),
    $tempoLeftArrow: $('#' + METR_TEMPO_LEFT_ARROW_ID),
    $tempoRightArrow: $('#' + METR_TEMPO_RIGHT_ARROW_ID),
    $beatsSelect: $('#' + METR_BEATS_SELECT_ID),
    $beatsLeftArrow: $('#' + METR_BEATS_LEFT_ARROW_ID),
    $beatsRightArrow: $('#' + METR_BEATS_RIGHT_ARROW_ID),
    $beatValSelect: $('#' + METR_BEAT_VAL_SELECT_ID),
    $beatValLeftArrow: $('#' + METR_BEAT_VAL_LEFT_ARROW_ID),
    $beatValRightArrow: $('#' + METR_BEAT_VAL_RIGHT_ARROW_ID),

    scheduleBeats: function()
    {
        while (this.beatsQueue.length > 1)
        {
            var beat = this.beatsQueue.shift();
            this.audio.scheduleBeat(beat);
            this.metrAnimation.scheduleBeatVisual(beat, this.getDurBetweenBeats());
        }
    },

    addBeatsToQ: function(number)
    {
        var delay = this.getDurBetweenBeats();
        var lastBeatTime = this.beatsQueue[this.beatsQueue.length - 1].audioTime;
        if ((this.audio.getTime() + delay * number) >= lastBeatTime)
        {
            for (var i = this.beatsQueue.length; i < number; i++)
            {
                this.nextBeatNumber = (this.nextBeatNumber + 1) % this.beats;
                var beat = new MetrBeat(lastBeatTime + delay, this.nextBeatNumber, delay / 2);
                this.beatsQueue.push(beat);
                lastBeatTime = this.beatsQueue[this.beatsQueue.length - 1].audioTime;
            }
            this.scheduleBeats();
        }
    },
    
    beatsSchedulerTick: function()
    {
        if (this.beatsQueue.length > 0)
        {
            var tickTime = 1 / this.ticksPerSecond;
            var lookAheadNumber = Math.ceil((tickTime * 2) / this.getDurBetweenBeats()) + 1;
            this.addBeatsToQ(lookAheadNumber);
        }
    },

    beatsSchedulerStart: function()
    {
        this.beatsQueue = [];
        this.nextBeatNumber = 0;
        var beat = new MetrBeat(this.audio.getTime(), 0, this.getDurBetweenBeats() / 2);
        this.beatsQueue.push(beat);
    },

    getDurBetweenBeats: function()
    {
        return (240 / this.beatValue) / this.tempo;
    },

    initTempoOptionsDatalist: function()
    {
        for (var i = MIN_TEMPO; i <= MAX_TEMPO; i += TEMPO_OPTIONS_STEP)
        {
            var param = {tempo: i};
            $(METR_DATALIST_OPTION_TMPL(param)).appendTo(this.$tempoOptionsBlock);
        }
    },
    
    onPlayBtn: function(event)
    {
        that = event.data.that;
        that.isPlaying = true;
        $(this).hide();
        that.$stopBtn.show();
        that.beatsSchedulerStart();
        that.metrAnimation.play();
        var msg = new workerMsg(that.msgEnum.startTicking);
        that.worker.postMessage(msg);
    },
    
    onStopBtn: function(event)
    {
        that = event.data.that;
        that.isPlaying = false;
        that.audio.clearAudioQ();
        $(this).hide();
        that.$playBtn.show();
        that.metrAnimation.stop();
        var msg = new workerMsg(that.msgEnum.stopTicking);
        that.worker.postMessage(msg);
    },
    
    onVolumeChange: function(event)
    {
        that = event.data.that;
        var volume = $(this).val();
        that.audio.setVolumePercent(volume);
    },
    
    onTempoChange: function(event)
    {
        that = event.data.that;
        var tempo = $(this).val();
        that.$tempoInput.val(tempo);
        tempo = +tempo;
        that.tempo = tempo;
        that.audio.clearAudioQ();
    },
    
    onTempoInputChange: function(event)
    {
        that = event.data.that;
        var tempo = $(this).val().replace(/[^,.0-9]/gim, '').replace(/[,.]+/gim, '.');
        tempo = parseFloat(tempo);
        if (tempo < MIN_TEMPO)
        {
            tempo = MIN_TEMPO;
        }
        else if (tempo > MAX_TEMPO)
        {
            tempo = MAX_TEMPO;
        }
        that.tempo = tempo;
        $(this).val(tempo);
        that.$tempoRange.val(tempo);
        that.audio.clearAudioQ();
    },
    
    onTempoLeftArrow: function(event)
    {
        that = event.data.that;
        var tempo = that.$tempoInput.val()
        if (tempo > MIN_TEMPO)
        {
            tempo--;
            that.tempo = tempo;
            that.$tempoInput.val(tempo);
            that.$tempoRange.val(tempo);
            that.audio.clearAudioQ();
        }
    },
    
    onTempoRightArrow: function(event)
    {
        that = event.data.that;
        var tempo = that.$tempoInput.val()
        if (tempo < MAX_TEMPO)
        {
            tempo++;
            that.tempo = tempo;
            that.$tempoInput.val(tempo);
            that.$tempoRange.val(tempo);
            that.audio.clearAudioQ();
        }
    },
    
    onBeatsChange: function(event)
    {
        that = event.data.that;
        var beats = $(this).val();
        beats = +beats;
        that.beats = beats;
        that.audio.clearAudioQ();
    },
    
    onBeatsLeftArrow: function(event)
    {
        that = event.data.that;
        var beats = that.beats;
        if (!(beats <= MIN_BEATS))
        {
            beats--;
            that.beats = beats;
            that.$beatsSelect.find("[value='" + beats + "']").prop("selected", true);
            that.audio.clearAudioQ();
        }
    },
    
    onBeatsRightArrow: function(event)
    {
        that = event.data.that;
        var beats = that.beats;
        if (!(beats >= MAX_BEATS))
        {
            beats++;
            that.beats = beats;
            that.$beatsSelect.find("[value='" + beats + "']").prop("selected", true);
            that.audio.clearAudioQ();
        }
    },
    
    onBeatValChange: function(event)
    {
        that = event.data.that;
        var beatVal = $(this).val();
        beatVal = +beatVal;
        that.beatValue = beatVal;
        that.audio.clearAudioQ();
    },
    
    onBeatValLeftArrow: function(event)
    {
        that = event.data.that;
        var beatVal = that.beatValue;
        if (!(beatVal <= MIN_BEAT_VAL))
        {
            beatVal /= 2;
            that.beatValue = beatVal;
            that.$beatValSelect.find("[value='" + beatVal + "']").prop("selected", true);
            that.audio.clearAudioQ();
        }
    },
    
    onBeatValRightArrow: function(event)
    {
        that = event.data.that;
        var beatVal = that.beatValue;
        if (!(beatVal >= MAX_BEAT_VAL))
        {
            beatVal *= 2;
            that.beatValue = beatVal;
            that.$beatValSelect.find("[value='" + beatVal + "']").prop("selected", true);
            that.audio.clearAudioQ();
        }
    },

    getWorkerTickrate: function()
    {
        var msg = new workerMsg(this.msgEnum.getTickrate);
        this.worker.postMessage(msg);
    },
    
    onWorkerMessage: function(e)
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
    },
    
    init: function()
    {
        this.$stopBtn.hide();
        if (!isMetronomeCanWork)
        {
            return;
        }
        $('#' + METRONOME_DISABLED_ID).hide(0);
        this.initTempoOptionsDatalist();
        this.audio = new MetrAudio(this.audioCtx, this.worker);
        this.audio.setVolumePercent(+this.$volumeRange.val());
        this.metrAnimation = new MetrAnimation(this.audioCtx);
        this.tempo = +this.$tempoRange.val();
        this.worker.onmessage = this.onWorkerMessage.bind(this);
        this.getWorkerTickrate();
        this.$tempoInput.val(this.tempo);
        this.beats = this.$beatsSelect.val();
        this.beatValue = this.$beatValSelect.val();
        this.$playBtn.click({that: this}, this.onPlayBtn);
        this.$stopBtn.click({that: this}, this.onStopBtn);
        this.$volumeRange.change({that: this}, this.onVolumeChange);
        this.$volumeRange.on("input", {that: this}, this.onVolumeChange);
        this.$tempoRange.change({that: this}, this.onTempoChange);
        this.$tempoRange.on("input", {that: this}, this.onTempoChange);
        this.$tempoInput.change({that: this}, this.onTempoInputChange);
        this.$tempoLeftArrow.click({that: this}, this.onTempoLeftArrow);
        this.$tempoRightArrow.click({that: this}, this.onTempoRightArrow);
        this.$beatsSelect.change({that: this}, this.onBeatsChange);
        this.$beatsLeftArrow.click({that: this}, this.onBeatsLeftArrow);
        this.$beatsRightArrow.click({that: this}, this.onBeatsRightArrow);
        this.$beatValSelect.change({that: this}, this.onBeatValChange);
        this.$beatValLeftArrow.click({that: this}, this.onBeatValLeftArrow);
        this.$beatValRightArrow.click({that: this}, this.onBeatValRightArrow);
    }
}
