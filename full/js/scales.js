var defaultScaleItemOptions = {
    scale: "major",
    root: "C",
    tuning: "standart_e",
    halfStep: 0,
    stringsTunes: DEFAULT_STRING_TUNES,
    stringsNumber: 6,
    isTriadMode: false,
    normalNotesShowPattern: DEFAULT_NOTES_SHOW_PATTERN,
    triadsNotesShowPattern: DEFAULT_TRIADS_SHOW_PATTERN
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
        if ((options.normalNotesShowPattern !== undefined) && isCorrectNotesShowPattern(options.normalNotesShowPattern))
        {
            defaultScaleItemOptions.normalNotesShowPattern = options.normalNotesShowPattern;
        }
        if ((options.triadsNotesShowPattern !== undefined) && isCorrectNotesShowPattern(options.triadsNotesShowPattern))
        {
            defaultScaleItemOptions.triadsNotesShowPattern = options.triadsNotesShowPattern;
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
    this.normalNotesShowPattern = DEFAULT_NOTES_SHOW_PATTERN;
    this.triadsNotesShowPattern = DEFAULT_TRIADS_SHOW_PATTERN;
    this.notesBlocks = [];
    
    this.putNotesOnString = function(currentStringNumber)
    {
        var stringTune = this.getTuneForString(currentStringNumber);
        var semiTonesPattern = getSemiTonesPatternForString(this.scaleNotes, this.semiTones, stringTune);
        var $notesBlocks = $(this.notesBlocks[currentStringNumber]);
        $notesBlocks.toggleClass(HIDDEN_NOTE_CLASS, true);
        $notesBlocks.toggleClass(TRANSPARENT_NOTE_CLASS, false);
        var stringTuneOffset = semiTonesPattern.shift();
        var note = nextNoteAfterSemiTones(stringTune, stringTuneOffset);
        var k = 0;
        for (var i = stringTuneOffset; i < $notesBlocks.length;)
        {
            var $noteBlock = $(this.notesBlocks[currentStringNumber][i]);
            $noteBlock.toggleClass(HIDDEN_NOTE_CLASS, false);
            var noteStep = this.scaleNotes.indexOf(note);
            var isTransparentNote = false;
            if (this.isTriadMode)
            {
                isTransparentNote = !this.triadsNotesShowPattern[noteStep];
                $noteBlock.text(noteStep + 1);
            }
            else
            {
                isTransparentNote = !this.normalNotesShowPattern[noteStep];
                $noteBlock.text(note);
            }
            if (isTransparentNote)
            {
                $noteBlock.toggleClass(TRANSPARENT_NOTE_CLASS, true);
            }
            var isRoot = (note == this.root);
            $noteBlock.toggleClass(NORMAL_NOTE_CLASS, !isRoot).toggleClass(HIGHLIGHTED_NOTE_CLASS, isRoot);
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
            var $fret = $(STRING_FRET_TMPL(param)).appendTo(verFrets[i]);
            var noteBlock = $('.' + NOTE_CLASS, $fret)[0];
            if (this.notesBlocks[stringNumber] === undefined)
            {
                this.notesBlocks[stringNumber] = [];
            }
            this.notesBlocks[stringNumber][i] = noteBlock;
            if (stringNumber == 0)
            {
                fretNumberInPattern = i % 12;
                isFretWithMarker = (fretNumberInPattern == 3) || (fretNumberInPattern == 5) || (fretNumberInPattern == 7) || (fretNumberInPattern == 9);
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
        var notes = this.scaleNotes.slice();
        notes.push(this.root);
        var param = {
            root: this.root, 
            semiTones: this.semiTones, 
            notes: notes
        }
        $('.' + SCALE_NOTES_BLOCK_CLASS, this.$itemBlock).append(SCALE_NOTES_TMPL(param));
        var $scaleNotesBlocks = $('.' + SCALE_NOTES_CLASS, this.$itemBlock).find('.' + SCALE_NOTE_TEXT_CLASS);
        var scaleNotesNumber = $scaleNotesBlocks.length - 1;
        for (var i = 0; i < scaleNotesNumber; i++)
        {
            var isTransparentNote = !(this.isTriadMode ? this.triadsNotesShowPattern[i] : this.normalNotesShowPattern[i]);
            if (isTransparentNote)
            {
                var $noteBlock = $($scaleNotesBlocks[i]);
                $noteBlock.toggleClass(TRANSPARENT_NOTE_CLASS, true);
                if (i == 0)
                {
                    $noteBlock = $($scaleNotesBlocks[scaleNotesNumber]);
                    $noteBlock.toggleClass(TRANSPARENT_NOTE_CLASS, true);
                }
            }
        }
        $('.' + SCALE_NOTES_CLASS, this.$itemBlock).on("click", '.' + SCALE_NOTE_CLASS, {itemThis: this}, this.onScaleNoteClick);
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
    
    this.onScaleNoteClick = function(event)
    {
        var itemThis = event.data.itemThis;
        var scaleNoteNumber = $('.' + SCALE_NOTE_CLASS, itemThis.$itemBlock).index(this);
        scaleNoteNumber = scaleNoteNumber % itemThis.scaleNotes.length;
        var isShowNote = false;
        if (itemThis.isTriadMode)
        {
            isShowNote = !itemThis.triadsNotesShowPattern[scaleNoteNumber];
            itemThis.triadsNotesShowPattern[scaleNoteNumber] = isShowNote;
        }
        else
        {
            isShowNote = !itemThis.normalNotesShowPattern[scaleNoteNumber];
            itemThis.normalNotesShowPattern[scaleNoteNumber] = isShowNote;
        }
        var isRootNote = (scaleNoteNumber == 0);
        if (isRootNote)
        {
            var $noteBlock = $('.' + SCALE_NOTE_CLASS, itemThis.$itemBlock).last().find('.' + SCALE_NOTE_TEXT_CLASS);
            $noteBlock.toggleClass(TRANSPARENT_NOTE_CLASS, !isShowNote);
            $noteBlock = $('.' + SCALE_NOTE_CLASS, itemThis.$itemBlock).first().find('.' + SCALE_NOTE_TEXT_CLASS);
            $noteBlock.toggleClass(TRANSPARENT_NOTE_CLASS, !isShowNote);
        }
        else
        {
            var $noteBlock = $(this).find('.' + SCALE_NOTE_TEXT_CLASS);
            $noteBlock.toggleClass(TRANSPARENT_NOTE_CLASS, !isShowNote);
        }
        itemThis.putNotesOnAllStrings();
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
            itemThis.notesBlocks.pop();
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
        itemThis.changeScaleNotesBlock();
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
        this.normalNotesShowPattern = defaultScaleItemOptions.normalNotesShowPattern;
        this.triadsNotesShowPattern = defaultScaleItemOptions.triadsNotesShowPattern;
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
