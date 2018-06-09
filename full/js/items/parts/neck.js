function Neck(state, $neckBlock, $stringsNumberBlock, $addStringBtn, $delStringBtn, $tuningOptionsBlock, $lhToggleBlock)
{
    this.state = state;
    this.$neckBlock = $neckBlock;
    this.$stringsNumberBlock = $stringsNumberBlock;
    this.$addStringBtn = $addStringBtn;
    this.$delStringBtn = $delStringBtn;
    this.$tuningOptionsBlock = $tuningOptionsBlock;
    this.$lhToggleBlock = $lhToggleBlock;

    var that = this;

    var tuningStringChangeEventAction = function(stringNumber)
    {
        that.putNotesOnString(stringNumber);
        that.fretboard.putNotesOnNearStrings(stringNumber);
        that.selectCurrentTuning();
    }

    this.fretboard = new Fretboard(state, $('.' + FRETBOARD_CLASS, $neckBlock));
    this.stringsTunings = new StringsTuning(state, $('.' + 
        STRINGS_OPTIONS_BLOCK_CLASS, $neckBlock),
        tuningStringChangeEventAction);

    this.init();
}

Neck.prototype.putNotesOnString = function(stringNumber)
{
    this.fretboard.putNotesOnString(stringNumber);
} 

Neck.prototype.putNotesOnAllStrings = function()
{
    this.fretboard.putNotesOnAllStrings();
}

Neck.prototype.selectCurrentStringsTunes = function()
{
    this.stringsTunings.selectCurrentStringsTunes();
}

Neck.prototype.selectCurrentTuning = function()
{
    this.$tuningOptionsBlock.find('.' + TUNING_SELECT_CLASS + " [value='" + this.state.tuning.getName() + "']").
        prop("selected", true);
}

Neck.prototype.switchLH = function()
{
    this.$lhToggleBlock.find('.' + TOGGLE_SLIDER_CLASS).
        toggleClass(SLIDER_LH_CLASS, this.state.isLH).toggleClass(SLIDER_RH_CLASS, !this.state.isLH);
    this.$neckBlock.toggleClass(LH_CLASS, this.state.isLH);
}

Neck.prototype.switchLHevent = function()
{
    this.state.isLH = !this.state.isLH;
    this.switchLH();
    this.state.saveToQuery();
}

Neck.prototype.onTuningChange = function(event)
{
    var that = event.data.that;
    var tuningName = $(this).val().toLowerCase();
    that.state.tuning.setName(tuningName);
    that.putNotesOnAllStrings();
    that.selectCurrentStringsTunes();
    that.state.saveToQuery();
}

Neck.prototype.selectCurrentHalfStep = function()
{
    $('.' + HALF_STEP_SELECT_CLASS + " [value='" + this.state.tuning.getHS() + "']", this.$tuningOptionsBlock).
        prop("selected", true);
}

Neck.prototype.onHalfStepChange = function(event)
{
    var that = event.data.that;
    newValue = +($(this).val());
    that.state.tuning.setHS(newValue);
    that.selectCurrentStringsTunes();
    that.putNotesOnAllStrings();
    that.state.saveToQuery();
}

Neck.prototype.onLeftArrowHalfStepClick = function(event)
{
    var that = event.data.that;
    that.state.tuning.decHS();
    that.selectCurrentStringsTunes();
    that.putNotesOnAllStrings();
    that.selectCurrentHalfStep();
    that.state.saveToQuery();
}

Neck.prototype.onRightArrowHalfStepCLick = function(event)
{
    var that = event.data.that;
    that.state.tuning.incHS();
    that.selectCurrentStringsTunes();
    that.putNotesOnAllStrings();
    that.selectCurrentHalfStep();
    that.state.saveToQuery();
}

Neck.prototype.onAddStringButton = function(event)
{
    var that = event.data.that;
    if (that.state.stringsNumber < MAX_STRINGS_NUMBER) 
    {    
        that.fretboard.addString(that.state.stringsNumber);
        var stringTune = that.state.tuning.getStringTuning(that.state.stringsNumber);
        that.stringsTunings.addStringTuning(stringTune);
        that.state.stringsNumber++;
        that.$stringsNumberBlock.text('' + that.state.stringsNumber);
        that.state.saveToQuery();
    }
}

Neck.prototype.onDelStringButton = function(event)
{
    var that = event.data.that;
    if (that.state.stringsNumber > MIN_STRINGS_NUMBER)
    {
        that.fretboard.delLastString();
        that.stringsTunings.delLastString();
        that.state.stringsNumber--;
        that.$stringsNumberBlock.text('' + that.state.stringsNumber);
        that.state.saveToQuery();
    }
}

Neck.prototype.onLhToggleSlider = function(event)
{
    var that = event.data.that;
    that.switchLHevent();
}

Neck.prototype.onLhToggleClick = function(event)
{
    var that = event.data.that;
    if (!that.state.isLH)
    {
        that.switchLHevent();
    }
}

Neck.prototype.onRhToggleClick =function(event)
{
    var that = event.data.that;
    if (that.state.isLH)
    {
        that.switchLHevent();
    }
}

Neck.prototype.init = function()
{
    this.$stringsNumberBlock.text('' + this.state.stringsNumber);
    this.selectCurrentTuning();
    this.selectCurrentHalfStep();
    this.putNotesOnAllStrings();
    this.switchLH();
    this.$addStringBtn.click({that: this}, this.onAddStringButton);
    this.$delStringBtn.click({that: this}, this.onDelStringButton);
    $('.' + TUNING_SELECT_CLASS, this.$tuningOptionsBlock).change({that: this}, this.onTuningChange);
    $('.' + HALF_STEP_SELECT_CLASS, this.$tuningOptionsBlock).change({that: this}, this.onHalfStepChange);
    this.$tuningOptionsBlock.find('.' + HALF_STEP_BLOCK_CLASS).
        find('.' + LEFT_ARROW_CLASS).click({that: this}, this.onLeftArrowHalfStepClick);
    this.$tuningOptionsBlock.find('.' + HALF_STEP_BLOCK_CLASS).
        find('.' + RIGHT_ARROW_CLASS).click({that: this}, this.onRightArrowHalfStepCLick);
    this.$lhToggleBlock.find('.' + TOGGLE_CHECKBOX_CLASS).click({that: this}, this.onLhToggleSlider);
    this.$lhToggleBlock.find('.' + LH_TOGGLE_CLASS).click({that: this}, this.onLhToggleClick);
    this.$lhToggleBlock.find('.' + RH_TOGGLE_CLASS).click({that: this}, this.onRhToggleClick);
}
