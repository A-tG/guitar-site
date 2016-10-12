var defaultScaleItemOptions = {
    scale: "major",
    root: "C",
    tuning: "standart_e",
    halfStep: 0,
    stringsTunes: DEFAULT_STRING_TUNES,
    stringsNumber: 6,
    isTriadMode: false
}

function getDefaultScaleOptionsFromCookie()
{
    if (Cookies.getJSON("defaultScaleOptions") !== undefined)
    {
        var options = Cookies.getJSON("defaultScaleOptions");
        if ((options.scale !== undefined) && (isCorrectScale(options.scale)))
        {
            defaultScaleItemOptions.scale = options.scale;
        }
        if ((options.root !== undefined) && (isCorrectNote(options.root)))
        {
            defaultScaleItemOptions.root = options.root;
        }
        if ((options.tuning !== undefined) && (isCorrectTuning(options.tuning)))
        {
            defaultScaleItemOptions.tuning = options.tuning;
        }
        if ((options.halfStep !== undefined) && (isCorrectHalfStep(options.halfStep)))
        {
            defaultScaleItemOptions.halfStep = +options.halfStep;
        }
        if ((options.stringsTunes !== undefined) && (isCorrectTuningNotes(options.stringsTunes)))
        {
            defaultScaleItemOptions.stringsTunes = options.stringsTunes;
        }
        if ((options.stringsNumber !== undefined) && (isCorrectStringsNumber(options.stringsNumber)))
        {
            defaultScaleItemOptions.stringsNumber = +options.stringsNumber;
        }
        if ((options.isTriadMode !== undefined) && (typeof options.isTriadMode === 'boolean'))
        {
            defaultScaleItemOptions.isTriadMode = options.isTriadMode;
        }
    }
}

function ScalesItem(id)
{
    this.id = id;
    this.scale = "major";
    this.root = "C";
    this.semiTones = DEFAULT_SCALE_SEMITONES;
    this.scaleNotes = DEFAULT_SCALE_NOTES;
    this.tuning = "standart_e";
    this.halfStep = 0;
    this.stringsNumber = 3;
    this.stringsTunes = DEFAULT_STRING_TUNES;
    this.isTriadMode = false;
    
    this.putNotesOnString = function(currentStringNumber)
    {
        var stringTune = this.getTuneForString(currentStringNumber);
        var horFretSelector = '.' + HOR_FRET_CLASS + ':eq(' + currentStringNumber + ')';
        var $horFrets = $(horFretSelector, $('.' + NULL_VER_FRET_CLASS + ', .' + VER_FRET_CLASS, this.$fretboardBlock), this.$fretboardBlock);
        var semiTonesPattern = getSemiTonesPatternForString(this.scaleNotes, this.semiTones, stringTune);
        var $notesBlocks = $('.' + NOTE_CLASS, $horFrets);
        $notesBlocks.css("display", "none");
        $notesBlocks.toggleClass(TRANSPARENT_NOTE_CLASS, false);
        var stringTuneOffset = semiTonesPattern.shift();
        var note = nextNoteAfterSemiTones(stringTune, stringTuneOffset);
        var k = 0;
        for (var i = stringTuneOffset; i < $notesBlocks.length;)
        {
            var $noteBlock = $($notesBlocks[i]);
            $noteBlock.css("display", "inline");
            if (this.isTriadMode)
            {
                var noteStep = this.scaleNotes.indexOf(note) + 1;
                if ((noteStep != 1) && (noteStep != 3) && (noteStep != 5))
                {
                    $noteBlock.toggleClass(TRANSPARENT_NOTE_CLASS, true);
                }
                $noteBlock.text(noteStep);
            }
            else
            { 
                $noteBlock.text(note);
            }
            if (note == this.root)
            {
                $noteBlock.toggleClass(NORMAL_NOTE_CLASS, false).toggleClass(HIGHLIGHTED_NOTE_CLASS, true);
            }
            else
            {
                $noteBlock.toggleClass(NORMAL_NOTE_CLASS, true).toggleClass(HIGHLIGHTED_NOTE_CLASS, false);
            }
            i = i + semiTonesPattern[k];
            note = nextNoteAfterSemiTones(note, semiTonesPattern[k]);
            k = ++k % semiTonesPattern.length;
        }
    }
    
    this.putNotesOnAllStrings = function()
    {
        for (var i = 0; i < this.stringsNumber; i++)
        {
            this.putNotesOnString(i);
        }
    }
    
    this.incStringsNumber = function()
    {
        this.stringsNumber++;
        this.$stringsNumberBlock.text('' + this.stringsNumber);
    }
    
    this.decStringsNumber = function()
    {
        this.stringsNumber--;
        this.$stringsNumberBlock.text('' + this.stringsNumber);
    }
    
    this.getTuneForString = function(stringNumber)
    {
        return this.stringsTunes[stringNumber % this.stringsTunes.length];
    }
    
    this.addString = function(stringNumber)
    {
        var stringTune = this.getTuneForString(stringNumber);
        var $stringOptionsBlock = $("." + STRINGS_OPTIONS_BLOCK_CLASS, this.$itemBlock).append(STRING_TUNE_BLOCK_TMPL());
        var $addedStringTuneBlock = $stringOptionsBlock.children().last();
        $('.' + STRING_TUNE_SELECT_CLASS + " :contains('" + stringTune + "')", $addedStringTuneBlock).prop("selected", true)
        var param = {currentStringNumber: stringNumber + 1}
        var verFrets = $('.' + NULL_VER_FRET_CLASS + ', .' + VER_FRET_CLASS, this.$fretboardBlock);
        var isFretWithMarker = false;
        var isFretWithDoubleMarker = false;
        var fretNumberInPattern = 0;
        for (var i = 0; i < verFrets.length; i++)
        {
            $(verFrets[i]).append(STRING_FRET_TMPL(param));
            if (stringNumber == 0)
            {
                fretNumberInPattern = i % 12;
                isFretWithMarker = (fretNumberInPattern == 3) || (fretNumberInPattern == 5) || (fretNumberInPattern == 7) || (fretNumberInPattern == 10);
                isFretWithDoubleMarker = (i != 0) && (fretNumberInPattern == 0);
                if (isFretWithMarker)
                {
                    $(verFrets[i]).append(STRING_FRET_MARK_TMPL());
                }
                else if(isFretWithDoubleMarker)
                {
                    $(verFrets[i]).append(STRING_DOUBLE_FRET_MARK_TMPL());
                }
            }
        }
        this.putNotesOnString(stringNumber);
        $('.' + STRING_TUNE_SELECT_CLASS, $addedStringTuneBlock).change({itemThis: this}, this.onStringTuneChange);
        $('.' + LEFT_ARROW_CLASS, $addedStringTuneBlock).click({itemThis: this}, this.onLeftArrowTuneClick);
        $('.' + RIGHT_ARROW_CLASS, $addedStringTuneBlock).click({itemThis: this}, this.onRightArrowTuneClick);
    }
    
    this.delLastString = function()
    {
        $("." + STRING_TUNE_BLOCK_CLASS, this.$itemBlock).last().remove();
        var verFrets = $('.' + NULL_VER_FRET_CLASS + ', .' + VER_FRET_CLASS, this.$fretboardBlock);
        for (var i = 0; i < verFrets.length; i++)
        {
            $('.' + HOR_FRET_CLASS, $(verFrets[i])).last().remove();
        }
    }
    
    this.selectCurrentStringsTunes = function()
    {
        var $outterSelector = $('.' + STRINGS_OPTIONS_BLOCK_CLASS, this.$itemBlock);
        for (var i = 0; i < this.stringsNumber; i++)
        {
            $outterSelector.find("." + STRING_TUNE_SELECT_CLASS + ":eq(" + i + ")" + " :contains('" + this.getTuneForString(i) + "')").prop("selected", true);
        }
    }
    
    this.selectCurrentTuning = function()
    {
        this.$itemBlock.find("." + TUNING_SELECT_CLASS + " [value='" + this.tuning + "']").prop("selected", true);
    }
    
    this.selectCurrentScale = function()
    {
        $("." + SCALE_SELECT_CLASS + " [value='" + this.scale + "']", this.$itemBlock).prop("selected", true);
    }
    
    this.selectCurrentHalfStep = function()
    {
        $("." + HALF_STEP_SELECT_CLASS + " [value='" + this.halfStep + "']", this.$itemBlock).prop("selected", true);
    }
    
    this.moveTuning = function(halfSteps)
    {
        for (var k = 0; k < this.stringsTunes.length; k++)
        {
            this.stringsTunes[k] = nextNoteAfterSemiTones(this.stringsTunes[k], halfSteps);
        }
    }
    
    this.changeScaleNotesBlock = function()
    {
        $('.' + SCALE_NOTES_CLASS, this.$itemBlock).remove();
        var notes = this.scaleNotes;
        notes.push(this.root);
        var param = {
            root: this.root, 
            semiTones: this.semiTones, 
            notes: notes
        }
        $('.' + SCALE_NOTES_BLOCK_CLASS, this.$itemBlock).append(SCALE_NOTES_TMPL(param));
    }
    
    this.onScaleChange = function(event)
    {
        var itemThis = event.data.itemThis;
        var scaleName = $(this).val().toLowerCase();
        if (isCorrectScale(scaleName))
        {
            itemThis.scale = scaleName;
            itemThis.semiTones = getScaleSemitones(scaleName);
            itemThis.scaleNotes = getNotesFromSemiTones(itemThis.root, itemThis.semiTones);
            itemThis.putNotesOnAllStrings();
            itemThis.changeScaleNotesBlock();
        }
    }
    
    this.onStringTuneChange = function(event)
    {
        var itemThis = event.data.itemThis;
        var $outterSelector = $('.' + STRINGS_OPTIONS_BLOCK_CLASS, event.data.itemThis.$itemBlock);
        var stringTune = $(this).val();
        var currentStringTuneNumber = $('.' + STRING_TUNE_SELECT_CLASS, $outterSelector).index(this);
        itemThis.stringsTunes[currentStringTuneNumber] = stringTune;
        itemThis.putNotesOnString(currentStringTuneNumber);
        itemThis.tuning = CUSTOM_TUNING_VALUE;
        itemThis.selectCurrentTuning();
    }
    
    this.onLeftArrowTuneClick = function(event)
    {
        var itemThis = event.data.itemThis;
        var $outterSelector = $('.' + STRINGS_OPTIONS_BLOCK_CLASS, event.data.itemThis.$itemBlock);
        var currentStringTuneNumber = $('.' + LEFT_ARROW_CLASS, $outterSelector).index(this);
        var note = itemThis.stringsTunes[currentStringTuneNumber];
        note = prevNote(note);
        itemThis.stringsTunes[currentStringTuneNumber] = note;
        $("." + STRING_TUNE_SELECT_CLASS + ":eq(" + currentStringTuneNumber + ")" + " :contains('" + note + "')", $outterSelector).prop("selected", true);
        itemThis.putNotesOnString(currentStringTuneNumber);
        itemThis.tuning = CUSTOM_TUNING_VALUE;
        itemThis.selectCurrentTuning();
    }
    
    this.onRightArrowTuneClick = function(event)
    {
        var itemThis = event.data.itemThis;
        var $outterSelector = $('.' + STRINGS_OPTIONS_BLOCK_CLASS, event.data.itemThis.$itemBlock);
        var currentStringTuneNumber = $('.' + RIGHT_ARROW_CLASS, $outterSelector).index(this);
        var note = itemThis.stringsTunes[currentStringTuneNumber];
        note = nextNote(note);
        itemThis.stringsTunes[currentStringTuneNumber] = note;
        $("." + STRING_TUNE_SELECT_CLASS + ":eq(" + currentStringTuneNumber + ")" + " :contains('" + note + "')", $outterSelector).prop("selected", true);
        itemThis.putNotesOnString(currentStringTuneNumber);
        itemThis.tuning = CUSTOM_TUNING_VALUE;
        itemThis.selectCurrentTuning();
    }
    
    this.onTuningChange = function(event)
    {
        var itemThis = event.data.itemThis;
        var tuningName = $(this).val().toLowerCase();
        if (tuningName == CUSTOM_TUNING_VALUE)
        {
            itemThis.tuning = tuningName;
        }
        else
        {
            if (isCorrectTuning(tuningName))
            {
                itemThis.tuning = tuningName;
                itemThis.stringsTunes = getTuneNotes(tuningName);
                itemThis.moveTuning(itemThis.halfStep);
                itemThis.putNotesOnAllStrings();
                itemThis.selectCurrentStringsTunes();
            }
        }
    }
    
    this.onHalfStepChange = function(event)
    {
        var itemThis = event.data.itemThis;
        var oldValue = itemThis.halfStep;
        var newValue = $(this).val().replace(/[^-0-9]/gim, '');
        newValue = +newValue;
        itemThis.halfStep = newValue;
        var valuesDiff = newValue - oldValue;
        itemThis.moveTuning(valuesDiff);
        itemThis.selectCurrentStringsTunes();
        itemThis.putNotesOnAllStrings();
    }
    
    this.onLeftArrowHalfStepClick = function(event)
    {
        var itemThis = event.data.itemThis;
        var halfStep =  itemThis.halfStep;
        if (halfStep != -MAX_HALF_STEP)
        {
            halfStep = prevHalfStep(halfStep);
            itemThis.halfStep = halfStep;
            itemThis.moveTuning(-1);
            itemThis.selectCurrentStringsTunes();
            itemThis.putNotesOnAllStrings();
            itemThis.selectCurrentHalfStep();
        }
    }
    
    this.onRightArrowHalfStepCLick = function(event)
    {
        var itemThis = event.data.itemThis;
        var halfStep = itemThis.halfStep;
        if (halfStep != MAX_HALF_STEP)
        {
            halfStep = nextHalfStep(halfStep);
            itemThis.halfStep = halfStep;
            itemThis.moveTuning(1);
            itemThis.selectCurrentStringsTunes();
            itemThis.putNotesOnAllStrings();
            itemThis.selectCurrentHalfStep();
        }
    }
    
    this.onRootNoteChange = function(event)
    {
        var itemThis = event.data.itemThis;
        var note = $(this).text();
        if (isCorrectNote(note))
        {
            itemThis.root = note.toUpperCase();
            $(' .' + ROOT_NOTE_CLASS + '.' + SELECTED_TEXT_CLASS, itemThis.$itemBlock).toggleClass(SELECTED_TEXT_CLASS, false);
            $(this).toggleClass(SELECTED_TEXT_CLASS, true);
            itemThis.scaleNotes = getNotesFromSemiTones(itemThis.root, itemThis.semiTones);
            itemThis.changeScaleNotesBlock();
            itemThis.putNotesOnAllStrings();
        }
    }
    
    this.onAddStringButton = function(event)
    {
        var itemThis = event.data.itemThis;
        var stringNumber = itemThis.stringsNumber
        if (stringNumber < MAX_STRINGS_NUMBER)
        {
            itemThis.addString(stringNumber);
            itemThis.incStringsNumber();
        }
    }
    
    this.onDelStringButton = function(event)
    {
        var itemThis = event.data.itemThis;
        var stringNumber = itemThis.stringsNumber
        if (stringNumber > MIN_STRINGS_NUMBER)
        {
            itemThis.delLastString();
            itemThis.decStringsNumber();
        }
    }
    
    this.onCloseButton = function(event)
    {
        var itemThis = event.data.itemThis;
        itemThis.$itemBlock.hide(200, function() {$(this).remove();});
        deleteItem(itemThis.id);
    }
    
    this.onSetDefaultButton = function(event)
    {
        var itemThis = event.data.itemThis;
        defaultScaleItemOptions.scale = itemThis.scale;
        defaultScaleItemOptions.root = itemThis.root;
        defaultScaleItemOptions.semiTones = itemThis.semiTones;
        defaultScaleItemOptions.tuning = itemThis.tuning;
        defaultScaleItemOptions.halfStep = itemThis.halfStep;
        defaultScaleItemOptions.stringsTunes = itemThis.stringsTunes;
        defaultScaleItemOptions.stringsNumber = itemThis.stringsNumber;
        defaultScaleItemOptions.isTriadMode = itemThis.isTriadMode;
        Cookies.set("defaultScaleOptions", defaultScaleItemOptions, {expires: DEFAULT_SCALE_OPTIONS_EXPIRE_DAYS});
    }
    
    this.onTriadsCheckboxClick = function(event)
    {
        var itemThis = event.data.itemThis;
        if (itemThis.isTriadMode)
        {
            itemThis.isTriadMode = false;
            itemThis.$triadsCheckbox.hide(0);
            itemThis.$triadsCheckboxEmpty.show(0);
        }
        else
        {
            itemThis.isTriadMode = true;
            itemThis.$triadsCheckboxEmpty.hide(0);
            itemThis.$triadsCheckbox.show(0);
        }
        itemThis.putNotesOnAllStrings();
    }
    
    this.initStrings = function()
    {
        for (var i = 0; i < FRETS_NUMBER; i++)
        {
            this.$fretboardBlock.children().last().before(STRING_VER_FRET_TMPL());
        }
        for (var i = 0; i < this.stringsNumber; i++)
        {
            this.addString(i);
            this.$stringsNumberBlock.text('' + this.stringsNumber);
        }
        this.selectCurrentStringsTunes();
    }
    
    this.readDefaultScaleItemOptions = function()
    {
        this.scale = defaultScaleItemOptions.scale;
        this.root = defaultScaleItemOptions.root;
        this.semiTones = getScaleSemitones(this.scale);
        this.scaleNotes =  getNotesFromSemiTones(this.root, this.semiTones);
        this.tuning = defaultScaleItemOptions.tuning;
        this.halfStep = defaultScaleItemOptions.halfStep;
        this.stringsTunes = defaultScaleItemOptions.stringsTunes;
        var stringsNumber = defaultScaleItemOptions.stringsNumber;
        if (stringsNumber < MIN_STRINGS_NUMBER)
        {
            stringsNumber = MIN_STRINGS_NUMBER;
        }
        this.stringsNumber = stringsNumber;
        this.isTriadMode = defaultScaleItemOptions.isTriadMode;
    }
    
    this.initTriadsCheckbox = function()
    {
        this.$triadsCheckbox = $('.' + TRIADS_CHECKBOX_CLASS, this.$itemBlock);
        this.$triadsCheckboxEmpty = $('.' + TRIADS_CHECKBOX_EMPTY_CLASS, this.$itemBlock);
        if (this.isTriadMode)
        {
            this.$triadsCheckboxEmpty.hide(0);
        }
        else
        {
            this.$triadsCheckbox.hide(0);
        }
        this.$triadsCheckbox.click({itemThis: this}, this.onTriadsCheckboxClick);
        this.$triadsCheckboxEmpty.click({itemThis: this}, this.onTriadsCheckboxClick);
    }
    
    this.initAnimation = function()
    {
        this.$itemBlock.hide(0);
        this.$itemBlock.show(200);
    }
    
    this.init = function()
    {
        $addNewItemBtn.before(SCALES_ITEM_BLOCK_TMPL({id: this.id}));
        this.$itemBlock = $('#' + this.id);
        this.$stringsNumberBlock = $('.' + STRING_NUMBER_CLASS, this.$itemBlock);
        this.$fretboardBlock = $('.' + FRETBOARD_CLASS, this.$itemBlock);
        this.initAnimation();
        this.readDefaultScaleItemOptions();
        this.initStrings();
        this.initTriadsCheckbox();
        this.changeScaleNotesBlock();
        this.selectCurrentTuning();
        this.selectCurrentScale();
        this.selectCurrentHalfStep();
        this.putNotesOnAllStrings();
        $('.' + SCALE_SELECT_CLASS, this.$itemBlock).change({itemThis: this}, this.onScaleChange);
        $('.' + TUNING_SELECT_CLASS, this.$itemBlock).change({itemThis: this}, this.onTuningChange);
        $('.' + HALF_STEP_SELECT_CLASS, this.$itemBlock).change({itemThis: this}, this.onHalfStepChange);
        this.$itemBlock.find('.' + HALF_STEP_BLOCK_CLASS).find('.' + LEFT_ARROW_CLASS).click({itemThis: this}, this.onLeftArrowHalfStepClick);
        this.$itemBlock.find('.' + HALF_STEP_BLOCK_CLASS).find('.' + RIGHT_ARROW_CLASS).click({itemThis: this}, this.onRightArrowHalfStepCLick);
        $('.' + SCALE_NOTES_BLOCK_CLASS, this.$itemBlock).on("click", '.' + ROOT_NOTE_CLASS, {itemThis: this}, this.onRootNoteChange);
        $('.' + ADD_STRING_BTN_CLASS, this.$itemBlock).click({itemThis: this}, this.onAddStringButton);
        $('.' + DEL_STRING_BTN_CLASS, this.$itemBlock).click({itemThis: this}, this.onDelStringButton);
        $('.' + CLOSE_BTN_CLASS, this.$itemBlock).click({itemThis: this}, this.onCloseButton);
        $('.' + SET_DEFAULT_BTN_CLASS, this.$itemBlock).click({itemThis: this}, this.onSetDefaultButton);
    }
    
    this.init();
}
