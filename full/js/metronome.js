var audioCtx = new AudioContext;
var worker = new Worker("js/worker.js");

var metronome = {
    beats: DEFAULT_METR_BEATS,
    beatValue: DEFAULT_METR_BEAT_VAL,
    volume: DEFAULT_METR_VOLUME / 100,
    tempo: DEFAULT_METR_TEMPO,
    gainNode: audioCtx.createGain(),
    beatNumber: 0,
    beatsQueue: [],
    $playBtn: $('#' + METR_PLAY_BTN_ID),
    $stopBtn: $('#' + METR_STOP_BTN_ID),
    $volumeRange: $('#' + METR_VOLUME_RANGE_ID),
    $tempoRange: $('#' + METR_TEMPO_RANGE_ID),
    $tempoInput: $('#' + METR_TEMPO_INPUT_ID),
    $tempoLeftArrow: $('#' + METR_TEMPO_LEFT_ARROW_ID),
    $tempoRightArrow: $('#' + METR_TEMPO_RIGHT_ARROW_ID),
    $beatsSelect: $('#' + METR_BEATS_SELECT_ID),
    $beatsLeftArrow: $('#' + METR_BEATS_LEFT_ARROW_ID),
    $beatsRightArrow: $('#' + METR_BEATS_RIGHT_ARROW_ID),
    $beatValSelect: $('#' + METR_BEAT_VAL_SELECT_ID),
    $beatValLeftArrow: $('#' + METR_BEAT_VAL_LEFT_ARROW_ID),
    $beatValRightArrow: $('#' + METR_BEAT_VAL_RIGHT_ARROW_ID),
    
    playBeatFromQueue: function()
    {
        if (this.beatsQueue.length > 0)
        {
            beat = this.beatsQueue.shift();
            var osc = audioCtx.createOscillator();
            osc.type = 'sawtooth';
            var freq = 440;
            if (this.beatNumber == 0)
            {
                freq = 640;
            }
            osc.frequency.value = freq;
            osc.connect(this.gainNode);
            osc.start(beat.time);
            osc.stop(beat.time + 50 / freq);
        }
    },
    
    beatsScheduler: function()
    {
        itemThis = metronome;
        if (itemThis.beatsQueue.length > 0)
        {
            var currentAudioTime = audioCtx.currentTime;
            var lastBeatInQueue = itemThis.beatsQueue[itemThis.beatsQueue.length - 1];
            var delay = (240 / itemThis.beatValue) / itemThis.tempo;
            if ((currentAudioTime + delay) >= lastBeatInQueue.time)
            {
                itemThis.beatsQueue.push({
                    time: lastBeatInQueue.time + delay, 
                    number: itemThis.beatNumber
                });
                itemThis.playBeatFromQueue();
                itemThis.beatNumber = (itemThis.beatNumber + 1) % itemThis.beats;
            }
        }
        else
        {
            itemThis.beatsQueue.push({
                time: audioCtx.currentTime, 
                number: itemThis.beatNumber
            })
        }
    },
    
    onPlayBtn: function(event)
    {
        itemThis = event.data.itemThis;
        $(this).hide();
        itemThis.$stopBtn.show();
        beatNumber = 0;
        worker.postMessage('start');
    },
    
    onStopBtn: function(event)
    {
        itemThis = event.data.itemThis;
        itemThis.beatsQueue = [];
        $(this).hide();
        itemThis.$playBtn.show();
        worker.postMessage('stop');
    },
    
    onVolumeChange: function(event)
    {
        itemThis = event.data.itemThis;
        var volume = $(this).val();
        volume = (+volume) / 100;
        itemThis.gainNode.gain.value = volume;
        itemThis.volume = volume;
    },
    
    onTempoChange: function(event)
    {
        itemThis = event.data.itemThis;
        var tempo = $(this).val();
        itemThis.$tempoInput.val(tempo);
        tempo = +tempo;
        itemThis.tempo = tempo;
    },
    
    onTempoInputChange: function(event)
    {
        itemThis = event.data.itemThis;
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
        itemThis.tempo = tempo;
        $(this).val(tempo);
        itemThis.$tempoRange.val(tempo);
    },
    
    onTempoLeftArrow: function(event)
    {
        itemThis = event.data.itemThis;
        var tempo = itemThis.$tempoInput.val()
        if (tempo > MIN_TEMPO)
        {
            tempo--;
            itemThis.tempo = tempo;
            itemThis.$tempoInput.val(tempo);
            itemThis.$tempoRange.val(tempo);
        }
    },
    
    onTempoRightArrow: function(event)
    {
        itemThis = event.data.itemThis;
        var tempo = itemThis.$tempoInput.val()
        if (tempo < MAX_TEMPO)
        {
            tempo++;
            itemThis.tempo = tempo;
            itemThis.$tempoInput.val(tempo);
            itemThis.$tempoRange.val(tempo);
        }
    },
    
    onBeatsChange: function(event)
    {
        itemThis = event.data.itemThis;
        var beats = $(this).val();
        beats = +beats;
        itemThis.beats = beats;
    },
    
    onBeatsLeftArrow: function(event)
    {
        itemThis = event.data.itemThis;
        var beats = itemThis.beats;
        if (!(beats <= MIN_BEATS))
        {
            beats--;
            itemThis.beats = beats;
            itemThis.$beatsSelect.find("[value='" + beats + "']").prop("selected", true);
        }
    },
    
    onBeatsRightArrow: function(event)
    {
        itemThis = event.data.itemThis;
        var beats = itemThis.beats;
        if (!(beats >= MAX_BEATS))
        {
            beats++;
            itemThis.beats = beats;
            itemThis.$beatsSelect.find("[value='" + beats + "']").prop("selected", true);
        }
    },
    
    onBeatValChange: function(event)
    {
        itemThis = event.data.itemThis;
        var beatVal = $(this).val();
        beatVal = +beatVal;
        itemThis.beatValue = beatVal;
    },
    
    onBeatValLeftArrow: function(event)
    {
        itemThis = event.data.itemThis;
        var beatVal = itemThis.beatValue;
        if (!(beatVal <= MIN_BEAT_VAL))
        {
            beatVal /= 2;
            itemThis.beatValue = beatVal;
            itemThis.$beatValSelect.find("[value='" + beatVal + "']").prop("selected", true);
        }
    },
    
    onBeatValRightArrow: function(event)
    {
        itemThis = event.data.itemThis;
        var beatVal = itemThis.beatValue;
        if (!(beatVal >= MAX_BEAT_VAL))
        {
            beatVal *= 2;
            itemThis.beatValue = beatVal;
            itemThis.$beatValSelect.find("[value='" + beatVal + "']").prop("selected", true);
        }
    },
    
    workerTick: function(e)
    {
        var action = e.data;
        var itemThis = metronome;
        if (action == 'tick')
        {
            itemThis.beatsScheduler();
        }
    },
    
    init: function()
    {
        this.$stopBtn.hide();
        this.tempo = +this.$tempoRange.val();
        this.volume = (+this.$volumeRange.val()) / 100;
        this.gainNode.gain.value = this.volume;
        this.gainNode.connect(audioCtx.destination);
        worker.onmessage = this.workerTick;
        this.$tempoInput.val(this.tempo);
        this.$playBtn.click({itemThis: this}, this.onPlayBtn);
        this.$stopBtn.click({itemThis: this}, this.onStopBtn);
        this.$volumeRange.change({itemThis: this}, this.onVolumeChange);
        this.$volumeRange.on("input", {itemThis: this}, this.onVolumeChange);
        this.$tempoRange.change({itemThis: this}, this.onTempoChange);
        this.$tempoRange.on("input", {itemThis: this}, this.onTempoChange);
        this.$tempoInput.change({itemThis: this}, this.onTempoInputChange);
        this.$tempoLeftArrow.click({itemThis: this}, this.onTempoLeftArrow);
        this.$tempoRightArrow.click({itemThis: this}, this.onTempoRightArrow);
        this.$beatsSelect.change({itemThis: this}, this.onBeatsChange);
        this.$beatsLeftArrow.click({itemThis: this}, this.onBeatsLeftArrow);
        this.$beatsRightArrow.click({itemThis: this}, this.onBeatsRightArrow);
        this.$beatValSelect.change({itemThis: this}, this.onBeatValChange);
        this.$beatValLeftArrow.click({itemThis: this}, this.onBeatValLeftArrow);
        this.$beatValRightArrow.click({itemThis: this}, this.onBeatValRightArrow);
    }
}