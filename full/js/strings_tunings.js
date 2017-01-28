function StringsTuning(state, $stringsTuningBlock, eventAction)
{
    this.getStringTune = function(stringNumber)
    {
        return state.stringsTunes[stringNumber % state.stringsTunes.length];
    }

    this.addStringTuning = function(stringTune)
    {
        var $stringOptionsBlock = $stringsTuningBlock.append(STRING_TUNE_BLOCK_TMPL());
        var $addedStringTuneBlock = $stringOptionsBlock.children().last();
        $('.' + STRING_TUNE_SELECT_CLASS + " :contains('" + stringTune + "')", $addedStringTuneBlock)
            .prop("selected", true)
        $('.' + STRING_TUNE_SELECT_CLASS, $addedStringTuneBlock).change({that: this}, this.onStringTuneChange);
        $('.' + LEFT_ARROW_CLASS, $addedStringTuneBlock).click({that: this}, this.onLeftArrowTuneClick);
        $('.' + RIGHT_ARROW_CLASS, $addedStringTuneBlock).click({that: this}, this.onRightArrowTuneClick);
    }

    this.delLastString = function()
    {
        $("." + STRING_TUNE_BLOCK_CLASS, $stringsTuningBlock).last().remove();
    }
    
    this.selectCurrentStringsTunes = function()
    {
        for (var i = 0; i < state.stringsNumber; i++)
        {
            $stringsTuningBlock.find("." + STRING_TUNE_SELECT_CLASS + ":eq(" + i + ")" + 
                " :contains('" + this.getStringTune(i) + "')")
                .prop("selected", true);
        }
    }
    
    this.onStringTuneChange = function(event)
    {
        var that = event.data.that;
        var stringTune = $(this).val();
        var stringNumber = $('.' + STRING_TUNE_SELECT_CLASS, $stringsTuningBlock).index(this);
        state.stringsTunes[stringNumber] = stringTune;
        state.tuning = CUSTOM_TUNING_VALUE;
        eventAction(stringNumber);
        state.updateSerializedData();
    }
    
    this.onLeftArrowTuneClick = function(event)
    {
        var that = event.data.that;
        var stringNumber = $('.' + LEFT_ARROW_CLASS, $stringsTuningBlock).index(this);
        var note = state.stringsTunes[stringNumber];
        note = prevNote(note);
        state.stringsTunes[stringNumber] = note;
        $("." + STRING_TUNE_SELECT_CLASS + ":eq(" + stringNumber + ")" + 
            " :contains('" + note + "')", $stringsTuningBlock)
            .prop("selected", true);
        state.tuning = CUSTOM_TUNING_VALUE;
        eventAction(stringNumber);
        state.updateSerializedData();
    }
    
    this.onRightArrowTuneClick = function(event)
    {
        var that = event.data.that;
        var stringNumber = $('.' + RIGHT_ARROW_CLASS, $stringsTuningBlock).index(this);
        var note = state.stringsTunes[stringNumber];
        note = nextNote(note);
        state.stringsTunes[stringNumber] = note;
        $("." + STRING_TUNE_SELECT_CLASS + ":eq(" + stringNumber + ")" + 
            " :contains('" + note + "')", $stringsTuningBlock)
            .prop("selected", true);
        state.tuning = CUSTOM_TUNING_VALUE;
        eventAction(stringNumber);
        state.updateSerializedData();
    }

    this.init = function()
    {
        for (var i = 0; i < state.stringsNumber; i++)
        {
            this.addStringTuning(i);
        }
        this.selectCurrentStringsTunes();
    }
}
