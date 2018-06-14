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
    $('.' + STRING_TUNE_SELECT_CLASS + " :contains('" + stringTune.getName() + "')", $addedStringTuneBlock).
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
        var stringTune = this.state.tuning.getStringTuning(i);
        this.$stringsTuningBlock.find("." + STRING_TUNE_SELECT_CLASS + ":eq(" + i + ")" + 
            " :contains('" + stringTune.getName() + "')").
            prop("selected", true);
    }
}

StringsTuning.prototype.onStringTuneChange = function(event)
{
    var that = event.data.that;
    var stringTune = $(this).val();
    var stringNumber = $('.' + STRING_TUNE_SELECT_CLASS, that.$stringsTuningBlock).index(this);
    that.state.tuning.setStringTuning(stringNumber, new Note(stringTune));
    that.tuneChangeEventAction(stringNumber);
    that.state.saveToQuery();
}

StringsTuning.prototype.onLeftArrowTuneClick = function(event)
{
    var that = event.data.that;
    var stringNumber = $('.' + LEFT_ARROW_CLASS, that.$stringsTuningBlock).index(this);
    var note = that.state.tuning.getStringTuning(stringNumber);
    that.state.tuning.setStringTuning(stringNumber, note.lower());
    $("." + STRING_TUNE_SELECT_CLASS + ":eq(" + stringNumber + ")" + 
        " :contains('" + note.getName() + "')", that.$stringsTuningBlock).
        prop("selected", true);
    that.tuneChangeEventAction(stringNumber);
    that.state.saveToQuery();
}

StringsTuning.prototype.onRightArrowTuneClick = function(event)
{
    var that = event.data.that;
    var stringNumber = $('.' + RIGHT_ARROW_CLASS, that.$stringsTuningBlock).index(this);
    var note = that.state.tuning.getStringTuning(stringNumber);
    that.state.tuning.setStringTuning(stringNumber, note.higher());
    $("." + STRING_TUNE_SELECT_CLASS + ":eq(" + stringNumber + ")" + 
        " :contains('" + note.getName() + "')", that.$stringsTuningBlock).        
        prop("selected", true);
    that.tuneChangeEventAction(stringNumber);
    that.state.saveToQuery();
}

StringsTuning.prototype.init = function()
{
    for (var i = 0; i < this.state.stringsNumber; i++)
    {
        this.addStringTuning(this.state.tuning.getStringTuning(i));
    }
    this.selectCurrentStringsTunes();
}
