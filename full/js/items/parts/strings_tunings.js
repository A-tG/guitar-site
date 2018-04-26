function StringsTuning(state, $stringsTuningBlock, eventAction)
{
    this.state = state;
    this.$stringsTuningBlock = $stringsTuningBlock;
    this.tuneBlocks = [];
    this.tuneChangeEventAction = eventAction;

    this.init();
}

StringsTuning.prototype.addStringTuning = function(stringTune)
{
    var $addedStringTuneBlock = $(STRING_TUNE_BLOCK_TMPL()).appendTo(this.$stringsTuningBlock);
    $('.' + STRING_TUNE_SELECT_CLASS + " :contains('" + stringTune + "')", $addedStringTuneBlock).
        prop("selected", true);
    $('.' + STRING_TUNE_SELECT_CLASS, $addedStringTuneBlock).change({that: this}, this.onStringTuneChange);
    $('.' + LEFT_ARROW_CLASS, $addedStringTuneBlock).click({that: this}, this.onLeftArrowTuneClick);
    $('.' + RIGHT_ARROW_CLASS, $addedStringTuneBlock).click({that: this}, this.onRightArrowTuneClick);
    this.tuneBlocks.push($addedStringTuneBlock);
}

StringsTuning.prototype.delLastString = function()
{
    this.tuneBlocks.pop().remove();
}

StringsTuning.prototype.selectCurrentStringsTunes = function()
{
    for (var i = 0; i < this.state.stringsNumber; i++)
    {
        var stringTune = Tuning.getStringTune(this.state.stringsTunes, i);
        this.$stringsTuningBlock.find("." + STRING_TUNE_SELECT_CLASS + ":eq(" + i + ")" + 
            " :contains('" + stringTune + "')").
            prop("selected", true);
    }
}

StringsTuning.prototype.onStringTuneChange = function(event)
{
    var that = event.data.that;
    var stringTune = $(this).val();
    var stringNumber = $('.' + STRING_TUNE_SELECT_CLASS, that.$stringsTuningBlock).index(this);
    that.state.stringsTunes[stringNumber] = stringTune;
    that.state.tuning = Tuning.getTuningName(that.state.stringsTunes);
    that.tuneChangeEventAction(stringNumber);
    that.state.saveToQuery();
}

StringsTuning.prototype.onLeftArrowTuneClick = function(event)
{
    var that = event.data.that;
    var stringNumber = $('.' + LEFT_ARROW_CLASS, that.$stringsTuningBlock).index(this);
    var note = that.state.stringsTunes[stringNumber];
    note = Note.prev(note);
    that.state.stringsTunes[stringNumber] = note;
    $("." + STRING_TUNE_SELECT_CLASS + ":eq(" + stringNumber + ")" + 
        " :contains('" + note + "')", that.$stringsTuningBlock).
        prop("selected", true);
    that.state.tuning = Tuning.getTuningName(that.state.stringsTunes);;
    that.tuneChangeEventAction(stringNumber);
    that.state.saveToQuery();
}

StringsTuning.prototype.onRightArrowTuneClick = function(event)
{
    var that = event.data.that;
    var stringNumber = $('.' + RIGHT_ARROW_CLASS, that.$stringsTuningBlock).index(this);
    var note = that.state.stringsTunes[stringNumber];
    note = Note.next(note);
    that.state.stringsTunes[stringNumber] = note;
    $("." + STRING_TUNE_SELECT_CLASS + ":eq(" + stringNumber + ")" + 
        " :contains('" + note + "')", that.$stringsTuningBlock).        
        prop("selected", true);
    that.state.tuning = Tuning.getTuningName(that.state.stringsTunes);;
    that.tuneChangeEventAction(stringNumber);
    that.state.saveToQuery();
}

StringsTuning.prototype.init = function()
{
    for (var i = 0; i < this.state.stringsNumber; i++)
    {
        var stringTunes = this.state.stringsTunes;
        this.addStringTuning(Tuning.getStringTune(stringTunes, i));
    }
}
