var audioCtx;
var worker;
var isMetronomeCanWork = false;

try
{
    audioCtx = new AudioContext;
    worker = new Worker("js/worker.js");
    isMetronomeCanWork = true;
}
catch (err)
{
    console.log(err);
}


var metronome = {
    isPlaying: false,
    beats: DEFAULT_METR_BEATS,
    beatValue: DEFAULT_METR_BEAT_VAL,
    volume: (sliderLogVal(DEFAULT_METR_VOLUME, 1, 100)) / 100,
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
    $beatVisBlock: $('#' + METR_BEAT_VIS_BLOCK_ID),
    $beatVisNumber: $('#' + METR_BEAT_VIS_NUMBER_ID),
    $beatVisPointer: $('#' + METR_BEAT_VIS_POINTER_ID),

    scheduleBeatAudio: function(beat)
    {
        var osc = audioCtx.createOscillator();
        osc.type = 'square';
        var freq = SECOND_CLICK_FREQ;
        if (beat.number == 0)
        {
            freq = FIRST_CLICK_FREQ;
        }
        osc.frequency.value = freq;
        osc.connect(this.gainNode);
        osc.start(beat.audioTime);
        osc.stop(beat.audioTime + 50 / freq);
    },

    scheduleBeatVisual: function(beat)
    {
        var time = beat.visTime - performance.now();
        if (time < 0)
        {
            time = 0;
        }
        var isFirstBeat = (beat.number == 1) || (this.beats == 1);
        this.$beatVisPointer.toggleClass(METR_BEAT_VIS_POINTER_OTHER_CLASS, !isFirstBeat).
            toggleClass(METR_BEAT_VIS_POINTER_FIRST_CLASS, isFirstBeat);
        this.$beatVisPointer.rotate({
            duration: time,
            angle: 0,
            animateTo: 360,
            easing: function (x,t,b,c,d){ return c*(t/d)+b;} // linear
        });
        setTimeout(function() {
            if (metronome.isPlaying)
            {
                metronome.$beatVisNumber.toggleClass(METR_FIRST_BEAT_VIS_NUMBER_CLASS, beat.number == 0);
                metronome.$beatVisNumber.text(beat.number + 1);
            }
        }, time);
    },

    scheduleBeatFromQueue: function()
    {
        if (this.beatsQueue.length > 0)
        {
            var beat = this.beatsQueue.shift();
            this.scheduleBeatAudio(beat);
            this.scheduleBeatVisual(beat);
        }
    },
    
    beatsScheduler: function()
    {
        that = metronome;
        if (that.beatsQueue.length > 0)
        {
            var currentAudioTime = audioCtx.currentTime;
            var lastBeatInQueue = that.beatsQueue[that.beatsQueue.length - 1];
            var delay = (240 / that.beatValue) / that.tempo;
            if ((currentAudioTime + delay) >= lastBeatInQueue.audioTime)
            {
                that.nextBeatNumber = (that.nextBeatNumber + 1) % that.beats;
                that.beatsQueue.push({
                    audioTime: lastBeatInQueue.audioTime + delay,
                    visTime: lastBeatInQueue.visTime + delay * 1000,
                    number: that.nextBeatNumber
                });
                that.scheduleBeatFromQueue();
            }
        }
        else
        {
            that.beatsQueue.push({
                audioTime: audioCtx.currentTime,
                visTime: performance.now(),
                number: 0
            });
        }
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
        that.$beatVisPointer.show();
        that.beatsQueue = [];
        that.nextBeatNumber = 0;
        worker.postMessage('startMetronomeTicking');
    },
    
    onStopBtn: function(event)
    {
        that = event.data.that;
        that.isPlaying = false;
        $(this).hide();
        that.$playBtn.show();
        that.$beatVisPointer.hide();
        that.$beatVisNumber.text("");
        worker.postMessage('stopMetronomeTicking');
    },
    
    onVolumeChange: function(event)
    {
        that = event.data.that;
        var volume = $(this).val();
        volume = sliderLogVal(+volume, 1, 100);
        volume = volume / 100;
        that.gainNode.gain.value = volume;
        that.volume = volume;
    },
    
    onTempoChange: function(event)
    {
        that = event.data.that;
        var tempo = $(this).val();
        that.$tempoInput.val(tempo);
        tempo = +tempo;
        that.tempo = tempo;
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
        }
    },
    
    onBeatsChange: function(event)
    {
        that = event.data.that;
        var beats = $(this).val();
        beats = +beats;
        that.beats = beats;
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
        }
    },
    
    onBeatValChange: function(event)
    {
        that = event.data.that;
        var beatVal = $(this).val();
        beatVal = +beatVal;
        that.beatValue = beatVal;
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
        }
    },
    
    workerTick: function(e)
    {
        var action = e.data;
        var that = metronome;
        if (action == 'metronomeTick')
        {
            that.beatsScheduler();
        }
    },
    
    init: function()
    {
        this.$stopBtn.hide();
        this.$beatVisPointer.hide();
        if (!isMetronomeCanWork)
        {
            return;
        }
        $('#' + METRONOME_DISABLED_ID).hide(0);
        this.initTempoOptionsDatalist();
        this.tempo = +this.$tempoRange.val();
        var initVolume = sliderLogVal(+this.$volumeRange.val(), 1, 100)
        this.volume = initVolume / 100;
        this.gainNode = audioCtx.createGain();
        this.gainNode.gain.value = this.volume;
        this.gainNode.connect(audioCtx.destination);
        worker.onmessage = this.workerTick;
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
