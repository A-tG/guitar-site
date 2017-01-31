function Neck(state, $neckBlock, $stringsNumberBlock, $addStringBtn, $delStringBtn, $tuningOptionsBlock)
{
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

    this.putNotesOnString = function(stringNumber)
    {
        this.fretboard.putNotesOnString(stringNumber);
    } 

    this.putNotesOnAllStrings = function()
    {
        this.fretboard.putNotesOnAllStrings();
    }

    this.getStringTune = function(stringNumber)
    {
        return state.stringsTunes[stringNumber % state.stringsTunes.length];
    }
    
    this.moveTuning = function(halfSteps)
    {
        for (var k = 0; k < state.stringsTunes.length; k++)
        {
            state.stringsTunes[k] = nextNoteAfterSemiTones(state.stringsTunes[k], halfSteps);
        }
    }

    this.selectCurrentStringsTunes = function()
    {
        this.stringsTunings.selectCurrentStringsTunes();
    }
    
    this.selectCurrentTuning = function()
    {
        $tuningOptionsBlock.find("." + TUNING_SELECT_CLASS + " [value='" + state.tuning + "']").
            prop("selected", true);
    }
    
    this.onTuningChange = function(event)
    {
        var that = event.data.that;
        var tuningName = $(this).val().toLowerCase();
        if (tuningName == CUSTOM_TUNING_VALUE)
        {
            state.tuning = tuningName;
        }
        else
        {
            if (isCorrectTuning(tuningName))
            {
                state.tuning = tuningName;
                state.stringsTunes = getTuneNotes(tuningName);
                that.moveTuning(state.halfStep);
                that.putNotesOnAllStrings();
                that.selectCurrentStringsTunes();
            }
        }
        state.saveToQuery();
    }
    
    this.selectCurrentHalfStep = function()
    {
        $("." + HALF_STEP_SELECT_CLASS + " [value='" + state.halfStep + "']", $tuningOptionsBlock).
            prop("selected", true);
    }
    
    this.onHalfStepChange = function(event)
    {
        var that = event.data.that;
        var oldValue = state.halfStep;
        var newValue = $(this).val().replace(/[^-0-9]/gim, '');
        newValue = +newValue;
        state.halfStep = newValue;
        var valuesDiff = newValue - oldValue;
        that.moveTuning(valuesDiff);
        that.selectCurrentStringsTunes();
        that.putNotesOnAllStrings();
        state.saveToQuery();
    }
    
    this.onLeftArrowHalfStepClick = function(event)
    {
        var that = event.data.that;
        var halfStep =  state.halfStep;
        if (halfStep != -MAX_HALF_STEP)
        {
            halfStep = prevHalfStep(halfStep);
            state.halfStep = halfStep;
            that.moveTuning(-1);
            that.selectCurrentStringsTunes();
            that.putNotesOnAllStrings();
            that.selectCurrentHalfStep();
            state.saveToQuery();
        }
    }
    
    this.onRightArrowHalfStepCLick = function(event)
    {
        var that = event.data.that;
        var halfStep = state.halfStep;
        if (halfStep != MAX_HALF_STEP)
        {
            halfStep = nextHalfStep(halfStep);
            state.halfStep = halfStep;
            that.moveTuning(1);
            that.selectCurrentStringsTunes();
            that.putNotesOnAllStrings();
            that.selectCurrentHalfStep();
            state.saveToQuery();
        }
    }

    this.onAddStringButton = function(event)
    {
        var that = event.data.that;
        if (state.stringsNumber < MAX_STRINGS_NUMBER) 
        {    
            that.fretboard.addString(state.stringsNumber);
            that.stringsTunings.addStringTuning(that.getStringTune(state.stringsNumber));
            state.stringsNumber++;
            $stringsNumberBlock.text('' + state.stringsNumber);
            state.saveToQuery();
        }
    }

    this.onDelStringButton = function(event)
    {
        var that = event.data.that;
        if (state.stringsNumber > MIN_STRINGS_NUMBER)
        {
            that.fretboard.delLastString();
            that.stringsTunings.delLastString();
            state.stringsNumber--;
            $stringsNumberBlock.text('' + state.stringsNumber);
            state.saveToQuery();
        }
    }

    this.init = function()
    {
        this.fretboard.init();
        this.stringsTunings.init();
        $stringsNumberBlock.text('' + state.stringsNumber);
        this.selectCurrentTuning();
        this.selectCurrentHalfStep();
        this.putNotesOnAllStrings();
        $addStringBtn.click({that: this}, this.onAddStringButton);
        $delStringBtn.click({that: this}, this.onDelStringButton);
        $('.' + TUNING_SELECT_CLASS, $tuningOptionsBlock).change({that: this}, this.onTuningChange);
        $('.' + HALF_STEP_SELECT_CLASS, $tuningOptionsBlock).change({that: this}, this.onHalfStepChange);
        $tuningOptionsBlock.find('.' + HALF_STEP_BLOCK_CLASS).
            find('.' + LEFT_ARROW_CLASS).click({that: this}, this.onLeftArrowHalfStepClick);
        $tuningOptionsBlock.find('.' + HALF_STEP_BLOCK_CLASS).
            find('.' + RIGHT_ARROW_CLASS).click({that: this}, this.onRightArrowHalfStepCLick);
    }
}
