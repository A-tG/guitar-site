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
    state: {
        isPlaying: false,
        volume: 50,
        beats: DEFAULT_METR_BEATS,
        beatValue: DEFAULT_METR_BEAT_VAL,
        tempo: DEFAULT_METR_TEMPO,
    },
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
        if (that.state.isPlaying) {return;}
        that.state.isPlaying = true;
        $(this).hide();
        that.$stopBtn.show();
        that.scheduler.start();
    },
    
    onStopBtn: function(event)
    {
        that = event.data.that;
        if (!that.state.isPlaying) {return;}
        that.state.isPlaying = false;
        $(this).hide();
        that.$playBtn.show();
        that.scheduler.stop();
    },
    
    onVolumeChange: function(event)
    {
        that = event.data.that;
        var volume = $(this).val();
        that.state.volume = volume;
        that.scheduler.updateVolume();
    },
    
    onTempoChange: function(event)
    {
        that = event.data.that;
        var tempo = $(this).val();
        that.$tempoInput.val(tempo);
        tempo = +tempo;
        that.state.tempo = tempo;
        that.scheduler.onRateChange();
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
        that.state.tempo = tempo;
        $(this).val(tempo);
        that.$tempoRange.val(tempo);
        that.scheduler.onRateChange();
    },
    
    onTempoLeftArrow: function(event)
    {
        that = event.data.that;
        var tempo = that.$tempoInput.val()
        if (tempo > MIN_TEMPO)
        {
            tempo--;
            that.state.tempo = tempo;
            that.$tempoInput.val(tempo);
            that.$tempoRange.val(tempo);
            that.scheduler.onRateChange();
        }
    },
    
    onTempoRightArrow: function(event)
    {
        that = event.data.that;
        var tempo = that.$tempoInput.val()
        if (tempo < MAX_TEMPO)
        {
            tempo++;
            that.state.tempo = tempo;
            that.$tempoInput.val(tempo);
            that.$tempoRange.val(tempo);
            that.scheduler.onRateChange();
        }
    },
    
    onBeatsChange: function(event)
    {
        that = event.data.that;
        var beats = $(this).val();
        beats = +beats;
        that.state.beats = beats;
    },
    
    onBeatsLeftArrow: function(event)
    {
        that = event.data.that;
        var beats = that.state.beats;
        if (!(beats <= MIN_BEATS))
        {
            beats--;
            that.state.beats = beats;
            that.$beatsSelect.val(beats).prop("selected", true);
        }
    },
    
    onBeatsRightArrow: function(event)
    {
        that = event.data.that;
        var beats = that.state.beats;
        if (!(beats >= MAX_BEATS))
        {
            beats++;
            that.state.beats = beats;
            that.$beatsSelect.val(beats).prop("selected", true);
        }
    },
    
    onBeatValChange: function(event)
    {
        that = event.data.that;
        var beatVal = $(this).val();
        beatVal = +beatVal;
        that.state.beatValue = beatVal;
        that.scheduler.onRateChange();
    },
    
    onBeatValLeftArrow: function(event)
    {
        that = event.data.that;
        var beatVal = that.state.beatValue;
        if (!(beatVal <= MIN_BEAT_VAL))
        {
            beatVal /= 2;
            that.state.beatValue = beatVal;
            that.$beatValSelect.val(beatVal).prop("selected", true);
            that.scheduler.onRateChange();
        }
    },
    
    onBeatValRightArrow: function(event)
    {
        that = event.data.that;
        var beatVal = that.state.beatValue;
        if (!(beatVal >= MAX_BEAT_VAL))
        {
            beatVal *= 2;
            that.state.beatValue = beatVal;
            that.$beatValSelect.val(beatVal).prop("selected", true);
            that.scheduler.onRateChange();
        }
    },

    initUI: function()
    {
        this.$tempoRange.val(this.state.tempo);
        this.$volumeRange.val(this.state.volume);
        this.$tempoInput.val(this.state.tempo);
        this.$beatsSelect.val(this.state.beats).prop("selected", true);
        this.$beatValSelect.val(this.state.beatValue).prop("selected", true);
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
        this.initUI();

        this.scheduler = new MetrScheduler(this.state, this.audioCtx, this.worker);

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
