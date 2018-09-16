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
