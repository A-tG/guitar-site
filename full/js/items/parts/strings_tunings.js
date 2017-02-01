function StringsTuning(state, $stringsTuningBlock, eventAction)
{
    this.state = state;
    this.$stringsTuningBlock = $stringsTuningBlock;
    this.tuneChangeEventAction = eventAction;

    this.init();
}

StringsTuning.prototype.getStringTune = function(stringNumber)
{
    return this.state.stringsTunes[stringNumber % this.state.stringsTunes.length];
}

StringsTuning.prototype.addStringTuning = function(stringTune)
{
    var $stringOptionsBlock = this.$stringsTuningBlock.append(STRING_TUNE_BLOCK_TMPL());
    var $addedStringTuneBlock = $stringOptionsBlock.children().last();
    $('.' + STRING_TUNE_SELECT_CLASS + " :contains('" + stringTune + "')", $addedStringTuneBlock).
        prop("selected", true)
    $('.' + STRING_TUNE_SELECT_CLASS, $addedStringTuneBlock).change({that: this}, this.onStringTuneChange);
    $('.' + LEFT_ARROW_CLASS, $addedStringTuneBlock).click({that: this}, this.onLeftArrowTuneClick);
    $('.' + RIGHT_ARROW_CLASS, $addedStringTuneBlock).click({that: this}, this.onRightArrowTuneClick);
}

StringsTuning.prototype.delLastString = function()
{
    $("." + STRING_TUNE_BLOCK_CLASS, this.$stringsTuningBlock).last().remove();
}

StringsTuning.prototype.selectCurrentStringsTunes = function()
{
    for (var i = 0; i < this.state.stringsNumber; i++)
    {
        this.$stringsTuningBlock.find("." + STRING_TUNE_SELECT_CLASS + ":eq(" + i + ")" + 
            " :contains('" + this.getStringTune(i) + "')").
            prop("selected", true);
    }
}

StringsTuning.prototype.onStringTuneChange = function(event)
{
    var that = event.data.that;
    var stringTune = $(this).val();
    var stringNumber = $('.' + STRING_TUNE_SELECT_CLASS, that.$stringsTuningBlock).index(this);
    that.state.stringsTunes[stringNumber] = stringTune;
    that.state.tuning = getTuningName(that.state.stringsTunes);
    that.tuneChangeEventAction(stringNumber);
    that.state.saveToQuery();
}

StringsTuning.prototype.onLeftArrowTuneClick = function(event)
{
    var that = event.data.that;
    var stringNumber = $('.' + LEFT_ARROW_CLASS, that.$stringsTuningBlock).index(this);
    var note = that.state.stringsTunes[stringNumber];
    note = prevNote(note);
    that.state.stringsTunes[stringNumber] = note;
    $("." + STRING_TUNE_SELECT_CLASS + ":eq(" + stringNumber + ")" + 
        " :contains('" + note + "')", that.$stringsTuningBlock).
        prop("selected", true);
    that.state.tuning = getTuningName(that.state.stringsTunes);;
    that.tuneChangeEventAction(stringNumber);
    that.state.saveToQuery();
}

StringsTuning.prototype.onRightArrowTuneClick = function(event)
{
    var that = event.data.that;
    var stringNumber = $('.' + RIGHT_ARROW_CLASS, that.$stringsTuningBlock).index(this);
    var note = that.state.stringsTunes[stringNumber];
    note = nextNote(note);
    that.state.stringsTunes[stringNumber] = note;
    $("." + STRING_TUNE_SELECT_CLASS + ":eq(" + stringNumber + ")" + 
        " :contains('" + note + "')", that.$stringsTuningBlock).        
        prop("selected", true);
    that.state.tuning = getTuningName(that.state.stringsTunes);;
    that.tuneChangeEventAction(stringNumber);
    that.state.saveToQuery();
}

StringsTuning.prototype.init = function()
{
    for (var i = 0; i < this.state.stringsNumber; i++)
    {
        this.addStringTuning(i);
    }
    this.selectCurrentStringsTunes();
}
