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
    console.error(err);
}

function MetrAudio(audioCtx, worker)
{
    this.ctx = audioCtx;
    this.worker = worker;
    this.volume = 0;

    this.scheduleBeat = function(beat)
    {
        var osc = this.ctx.createOscillator();
        osc.type = 'square';
        var freq = SECOND_CLICK_FREQ;
        if (beat.number == 0)
        {
            freq = FIRST_CLICK_FREQ;
        }
        osc.frequency.value = freq;
        osc.connect(this.dummyNode);
        osc.start(beat.audioTime);
        osc.stop(beat.audioTime + 50 / freq);
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

    this.initDummyNode = function()
    {
        this.dummyNode = this.ctx.createGain();
        this.dummyNode.connect(this.gainNode);
        this.gainNode.connect(this.ctx.destination);
    }

    this.init = function()
    {
        this.gainNode = this.ctx.createGain();
        this.setVolumePercent(DEFAULT_METR_VOLUME);
        this.gainNode.gain.value = this.volume;
        this.initDummyNode();
    }

    this.init();
}

function MetrAnimation() 
{
    this.$beatVisNumber = $('#' + METR_BEAT_VIS_NUMBER_ID);
    this.$beatVisPointer = $('#' + METR_BEAT_VIS_POINTER_BLOCK_ID);
    this.pointerSVG = SVG.adopt($('#' + METR_BEAT_VIS_POINTER_ID)[0]);
    this.isPlaying = false;

    this.scheduleBeatVisual = function(beat, currentTime)
    {
        var time = (beat.audioTime - currentTime) * 1000;
        var isFirstBeat = (beat.number == 1) || (this.beats == 1);
        this.$beatVisPointer.toggleClass(METR_BEAT_VIS_POINTER_OTHER_CLASS, !isFirstBeat).
            toggleClass(METR_BEAT_VIS_POINTER_FIRST_CLASS, isFirstBeat);
        if (time > 0)
        {
            this.pointerSVG.finish();
            this.pointerSVG.animate(time).rotate(360).after(function() {
                if (this.isPlaying)
                {
                    this.$beatVisNumber.toggleClass(METR_FIRST_BEAT_VIS_NUMBER_CLASS, beat.number == 0);
                    this.$beatVisNumber.text(beat.number + 1);
                }
            }.bind(this));
        }
        else
        {
            this.$beatVisNumber.text(beat.number + 1); 
        }
    }

    this.stop = function()
    {
        this.isPlaying = false;
        this.$beatVisNumber.text("");
        this.$beatVisPointer.hide();
    }

    this.play = function()
    {
        this.isPlaying = true;
        this.$beatVisPointer.show();
    }

    this.$beatVisPointer.hide();
}

var metronome = {
    audioCtx: audioCtx,
    worker: worker,
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

    scheduleBeatFromQueue: function()
    {
        if (this.beatsQueue.length > 0)
        {
            var beat = this.beatsQueue.shift();
            this.audio.scheduleBeat(beat);
            this.metrAnimation.scheduleBeatVisual(beat, this.audio.getTime());
        }
    },
    
    beatsSchedulerTick: function()
    {
        if (this.beatsQueue.length > 0)
        {
            var currentAudioTime = this.audio.getTime();
            var lastBeatInQueue = this.beatsQueue[this.beatsQueue.length - 1];
            var delay = (240 / this.beatValue) / this.tempo;
            if ((currentAudioTime + delay) >= lastBeatInQueue.audioTime)
            {
                this.nextBeatNumber = (this.nextBeatNumber + 1) % this.beats;
                this.beatsQueue.push({
                    audioTime: lastBeatInQueue.audioTime + delay,
                    number: this.nextBeatNumber
                });
                this.scheduleBeatFromQueue();
            }
        }
        else
        {
            this.beatsQueue.push({
                audioTime: this.audio.getTime(),
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
        that.metrAnimation.play();
        that.beatsQueue = [];
        that.nextBeatNumber = 0;
        that.worker.postMessage('startMetronomeTicking');
    },
    
    onStopBtn: function(event)
    {
        that = event.data.that;
        that.isPlaying = false;
        that.audio.clearAudioQ();
        $(this).hide();
        that.$playBtn.show();
        that.metrAnimation.stop();
        that.worker.postMessage('stopMetronomeTicking');
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
    
    workerTick: function(e)
    {
        var action = e.data;
        if (action == 'metronomeTick')
        {
            this.beatsSchedulerTick();
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
        this.metrAnimation = new MetrAnimation();
        this.tempo = +this.$tempoRange.val();
        this.worker.onmessage = this.workerTick.bind(this);
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
