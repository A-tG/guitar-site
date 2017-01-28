var defaultScaleItemOptions = {
    scale: "major",
    root: "C",
    tuning: "standart_e",
    halfStep: 0,
    stringsTunes: DEFAULT_STRING_TUNES,
    stringsNumber: 6,
    isTriadMode: false,
    normalNotesShowPattern: DEFAULT_NOTES_SHOW_PATTERN,
    triadsNotesShowPattern: DEFAULT_TRIADS_SHOW_PATTERN,
    boxFirstFret: -1
}

function getDefaultScaleOptionsFromCookie()
{
    if (Cookies.getJSON("defaultScaleOptions") !== undefined)
    {
        var options = Cookies.getJSON("defaultScaleOptions");
        if ((options.scale !== undefined) && isCorrectScale(options.scale))
        {
            defaultScaleItemOptions.scale = options.scale;
        }
        if ((options.root !== undefined) && isCorrectNote(options.root))
        {
            defaultScaleItemOptions.root = options.root;
        }
        if ((options.tuning !== undefined) && isCorrectTuning(options.tuning))
        {
            defaultScaleItemOptions.tuning = options.tuning;
        }
        if ((options.halfStep !== undefined) && isCorrectHalfStep(options.halfStep))
        {
            defaultScaleItemOptions.halfStep = +options.halfStep;
        }
        if ((options.stringsTunes !== undefined) && isCorrectTuningNotes(options.stringsTunes))
        {
            defaultScaleItemOptions.stringsTunes = options.stringsTunes;
        }
        if ((options.stringsNumber !== undefined) && isCorrectStringsNumber(options.stringsNumber))
        {
            defaultScaleItemOptions.stringsNumber = +options.stringsNumber;
        }
        if ((options.isTriadMode !== undefined) && (typeof options.isTriadMode === 'boolean'))
        {
            defaultScaleItemOptions.isTriadMode = options.isTriadMode;
        }
        if ((options.normalNotesShowPattern !== undefined) && 
                isCorrectNotesShowPattern(options.normalNotesShowPattern))
        {
            defaultScaleItemOptions.normalNotesShowPattern = options.normalNotesShowPattern;
        }
        if ((options.triadsNotesShowPattern !== undefined) && 
                isCorrectNotesShowPattern(options.triadsNotesShowPattern))
        {
            defaultScaleItemOptions.triadsNotesShowPattern = options.triadsNotesShowPattern;
        }
        if ((options.boxFirstFret !== undefined) && isCorrectBoxFret(options.boxFirstFret))
        {
            defaultScaleItemOptions.boxFirstFret = options.boxFirstFret;
        }
    }
}

function ScalesItem(id, JSONstring)
{
    this.state = {
        id: id,
        type: "scales",
        scale: "major",
        root: "C",
        scaleNotes: DEFAULT_SCALE_NOTES,
        semiTones: DEFAULT_SCALE_SEMITONES,
        tuning: "standart_e",
        stringsNumber: 0,
        stringsTunes: DEFAULT_STRING_TUNES,
        halfStep: 0,
        isTriadMode: false,
        boxFirstFret: -1,
        normalNotesShowPattern: DEFAULT_NOTES_SHOW_PATTERN,
        triadsNotesShowPattern: DEFAULT_TRIADS_SHOW_PATTERN,

        isCorrectSerializationData: function(JSONstring)
        {
            var isCorrect = false;
            var isParsable = true;
            var parsedArr = [];
            try
            {
                parsedArr = JSON.parse(JSONstring, semiTonesPatternIntToBool); 
            }
            catch (err)
            {
                isParsable = false;
            }
            if (isParsable)
            {
                isCorrect = (parsedArr.length == 11) && 
                    (parsedArr[0] == "scales") && isCorrectScale(parsedArr[1]) && 
                    isCorrectNote(parsedArr[2]) && isCorrectTuning(parsedArr[3]) && 
                    isCorrectHalfStep(parsedArr[4]) && isCorrectStringsNumber(parsedArr[5]) && 
                    isCorrectTuningNotes(parsedArr[6]) && (typeof (parsedArr[7] === 'boolean')) && 
                    isCorrectNotesShowPattern(parsedArr[8]) && isCorrectNotesShowPattern(parsedArr[9]) &&
                    isCorrectBoxFret(parsedArr[10]); 
            }
            return isCorrect;
        },

        updateSerializedData: function()
        {
            var index = $('.' + ITEM_CLASS).index($('#' + this.id));
            updateItemSerializedData(index, this.serialize());
            updateItemsQueryParams();
        },

        serialize: function()
        {
            var fieldsToSave =
            [
                this.type,
                this.scale,
                this.root,
                this.tuning,
                this.halfStep,
                this.stringsNumber,
                this.stringsTunes,
                this.isTriadMode,
                this.normalNotesShowPattern.slice(),
                this.triadsNotesShowPattern.slice(),
                this.boxFirstFret
            ];
            var JSONstring = JSON.stringify(fieldsToSave, semiTonesPatternBoolToInt);
            return JSONstring;
        },
        
        deserialize: function(JSONstring)
        {
            if (this.isCorrectSerializationData(JSONstring))
            {
                var parsedArr = JSON.parse(JSONstring, semiTonesPatternIntToBool);
                this.type = parsedArr[0];
                this.scale = parsedArr[1];
                this.root = parsedArr[2];
                this.tuning = parsedArr[3];
                this.halfStep = parsedArr[4];
                this.stringsNumber = parsedArr[5];
                this.stringsTunes = parsedArr[6];
                this.isTriadMode = parsedArr[7];
                this.normalNotesShowPattern = parsedArr[8];
                this.triadsNotesShowPattern = parsedArr[9];
                this.semiTones = getScaleSemitones(this.scale);
                this.scaleNotes = getNotesFromSemiTones(this.root, this.semiTones);
                this.boxFirstFret = parsedArr[10];
            }
            else
            {
                this.readDefaultScaleItemOptions();
                this.updateSerializedData();
            }
        },

        saveToDefaultOptions: function()
        {
            defaultScaleItemOptions.scale = this.scale;
            defaultScaleItemOptions.root = this.root;
            defaultScaleItemOptions.semiTones = this.semiTones;
            defaultScaleItemOptions.tuning = this.tuning;
            defaultScaleItemOptions.halfStep = this.halfStep;
            defaultScaleItemOptions.stringsTunes = this.stringsTunes;
            defaultScaleItemOptions.stringsNumber = this.stringsNumber;
            defaultScaleItemOptions.isTriadMode = this.isTriadMode;
            defaultScaleItemOptions.boxFirstFret = this.boxFirstFret;
            Cookies.set("defaultScaleOptions", defaultScaleItemOptions, 
                {expires: DEFAULT_SCALE_OPTIONS_EXPIRE_DAYS});
        },

        readFromDefaultOptions: function()
        {
            this.scale = defaultScaleItemOptions.scale;
            this.root = defaultScaleItemOptions.root;
            this.semiTones = getScaleSemitones(this.scale);
            this.scaleNotes =  getNotesFromSemiTones(this.root, this.semiTones);
            this.tuning = defaultScaleItemOptions.tuning;
            this.halfStep = defaultScaleItemOptions.halfStep;
            this.stringsTunes = defaultScaleItemOptions.stringsTunes;
            this.stringsNumber = defaultScaleItemOptions.stringsNumber;
            this.isTriadMode = defaultScaleItemOptions.isTriadMode;
            this.normalNotesShowPattern = defaultScaleItemOptions.normalNotesShowPattern;
            this.triadsNotesShowPattern = defaultScaleItemOptions.triadsNotesShowPattern;
            this.boxFirstFret = defaultScaleItemOptions.boxFirstFret;
        } 
    }

    this.putNotesOnAllStrings = function()
    {
        this.neck.putNotesOnAllStrings();
    }

    this.selectCurrentStringsTunes = function()
    {
        this.neck.selectCurrentStringsTunes();
    }
    
    this.selectCurrentScale = function()
    {
        $("." + SCALE_SELECT_CLASS + " [value='" + this.state.scale + "']", this.$itemBlock).
            prop("selected", true);
    }
    
    this.changeScaleNotesBlock = function()
    {
        $('.' + SCALE_NOTES_CLASS, this.$itemBlock).remove();
        var notes = this.state.scaleNotes.slice();
        notes.push(this.state.root);
        var param = {
            root: this.state.root, 
            semiTones: this.state.semiTones, 
            notes: notes
        }
        $('.' + SCALE_NOTES_BLOCK_CLASS, this.$itemBlock).append(SCALE_NOTES_TMPL(param));
        var $scaleNotesBlocks = $('.' + SCALE_NOTES_CLASS, this.$itemBlock).
            find('.' + SCALE_NOTE_TEXT_CLASS);
        var scaleNotesNumber = $scaleNotesBlocks.length - 1;
        for (var i = 0; i < scaleNotesNumber; i++)
        {
            var isTransparentNote = !(this.state.isTriadMode ? this.state.triadsNotesShowPattern[i] : this.state.normalNotesShowPattern[i]);
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
        $('.' + SCALE_NOTES_CLASS, this.$itemBlock)
            .on("click", '.' + SCALE_NOTE_CLASS, {that: this}, this.onScaleNoteClick);
    }
    
    this.selectCurrentRootNote = function()
    {
        $('.' + ROOT_NOTE_CLASS + '.' + SELECTED_TEXT_CLASS, this.$itemBlock).
            toggleClass(SELECTED_TEXT_CLASS, false);
        var $rootNoteToSelect = $('.' + ROOT_NOTE_CLASS + ":contains('" + this.state.root + "')", 
            this.$itemBlock).first();
        $rootNoteToSelect.toggleClass(SELECTED_TEXT_CLASS, true);
    }
    
    this.onScaleChange = function(event)
    {
        var that = event.data.that;
        var scaleName = $(this).val().toLowerCase();
        if (isCorrectScale(scaleName))
        {
            that.state.scale = scaleName;
            that.state.semiTones = getScaleSemitones(scaleName);
            that.state.scaleNotes = getNotesFromSemiTones(that.state.root, that.state.semiTones);
            that.putNotesOnAllStrings();
            that.changeScaleNotesBlock();
            that.state.updateSerializedData();
        }
    }
    
    this.onRootNoteChange = function(event)
    {
        var that = event.data.that;
        var note = $(this).text();
        if (isCorrectNote(note))
        {
            that.state.root = note.toUpperCase();
            that.selectCurrentRootNote();
            that.state.scaleNotes = getNotesFromSemiTones(that.state.root, that.state.semiTones);
            that.changeScaleNotesBlock();
            that.putNotesOnAllStrings();
            that.state.updateSerializedData();
        }
    }
    
    this.onScaleNoteClick = function(event)
    {
        var that = event.data.that;
        var scaleNoteNumber = $('.' + SCALE_NOTE_CLASS, that.$itemBlock).index(this);
        scaleNoteNumber = scaleNoteNumber % that.state.scaleNotes.length;
        var isShowNote = false;
        if (that.state.isTriadMode)
        {
            isShowNote = !that.state.triadsNotesShowPattern[scaleNoteNumber];
            that.state.triadsNotesShowPattern[scaleNoteNumber] = isShowNote;
        }
        else
        {
            isShowNote = !that.state.normalNotesShowPattern[scaleNoteNumber];
            that.state.normalNotesShowPattern[scaleNoteNumber] = isShowNote;
        }
        var isRootNote = (scaleNoteNumber == 0);
        if (isRootNote)
        {
            var $noteBlock = $('.' + SCALE_NOTE_CLASS, that.$itemBlock).last().
                find('.' + SCALE_NOTE_TEXT_CLASS);
            $noteBlock.toggleClass(TRANSPARENT_NOTE_CLASS, !isShowNote);
            $noteBlock = $('.' + SCALE_NOTE_CLASS, that.$itemBlock).first().
                find('.' + SCALE_NOTE_TEXT_CLASS);
            $noteBlock.toggleClass(TRANSPARENT_NOTE_CLASS, !isShowNote);
        }
        else
        {
            var $noteBlock = $(this).find('.' + SCALE_NOTE_TEXT_CLASS);
            $noteBlock.toggleClass(TRANSPARENT_NOTE_CLASS, !isShowNote);
        }
        that.putNotesOnAllStrings();
        that.state.updateSerializedData();
    }
    
    this.onCloseButton = function(event)
    {
        var that = event.data.that;
        that.$itemBlock.hide(200, function() {$(this).remove();});
        deleteItem(that.id);
    }
    
    this.onSetDefaultButton = function(event)
    {
        var that = event.data.that;
        that.state.saveToDefaultOptions();
    }
    
    this.onTriadsCheckboxClick = function(event)
    {
        var that = event.data.that;
        if (that.state.isTriadMode)
        {
            that.state.isTriadMode = false;
            that.$triadsCheckbox.hide(0);
            that.$triadsCheckboxEmpty.show(0);
        }
        else
        {
            that.state.isTriadMode = true;
            that.$triadsCheckboxEmpty.hide(0);
            that.$triadsCheckbox.show(0);
        }
        that.changeScaleNotesBlock();
        that.putNotesOnAllStrings();
        that.state.updateSerializedData();
    }
    
    this.readDefaultScaleItemOptions = function()
    {
        this.state.readFromDefaultOptions();
    }    
    
    this.initTriadsCheckbox = function()
    {
        this.$triadsCheckbox = $('.' + TRIADS_CHECKBOX_CLASS, this.$itemBlock);
        this.$triadsCheckboxEmpty = $('.' + TRIADS_CHECKBOX_EMPTY_CLASS, this.$itemBlock);
        if (this.state.isTriadMode)
        {
            this.$triadsCheckboxEmpty.hide(0);
        }
        else
        {
            this.$triadsCheckbox.hide(0);
        }
        this.$triadsCheckbox.click({that: this}, this.onTriadsCheckboxClick);
        this.$triadsCheckboxEmpty.click({that: this}, this.onTriadsCheckboxClick);
    }
    
    this.initAnimation = function()
    {
        this.$itemBlock.hide(0);
        this.$itemBlock.show(200);
    }
    
    this.init = function()
    {
        $addNewItemBtn.before(SCALES_ITEM_BLOCK_TMPL({id: id}));
        this.$itemBlock = $('#' + id);
        this.initAnimation();
        this.neck = new Neck(this.state, $('.' + NECK_BLOCK_CLASS, this.$itemBlock), 
            $('.' + STRING_NUMBER_CLASS, this.$itemBlock), 
            $('.' + ADD_STRING_BTN_CLASS, this.$itemBlock),
            $('.' + DEL_STRING_BTN_CLASS, this.$itemBlock),
            $('.' + TUNING_OPTIONS_CLASS, this.$itemBlock));
        if (JSONstring)
        {
            this.state.deserialize(JSONstring)
        }
        else
        {
            this.state.readFromDefaultOptions();
        }
        this.neck.init();
        this.initTriadsCheckbox();
        this.changeScaleNotesBlock();
        this.selectCurrentScale();
        this.selectCurrentRootNote();
        $('.' + SCALE_SELECT_CLASS, this.$itemBlock).change({that: this}, this.onScaleChange);
        $('.' + SCALE_NOTES_BLOCK_CLASS, this.$itemBlock)
            .on("click", '.' + ROOT_NOTE_CLASS, {that: this}, this.onRootNoteChange);
        $('.' + CLOSE_BTN_CLASS, this.$itemBlock).click({that: this}, this.onCloseButton);
        $('.' + SET_DEFAULT_BTN_CLASS, this.$itemBlock).click({that: this}, this.onSetDefaultButton);
    }
    
    this.init();
}
