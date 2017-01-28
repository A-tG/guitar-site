function Fretboard(state, $fretboardBlock)
{
    this.$fretboardBlock = $fretboardBlock;
    this.notesBlocks = [];
    
    this.putNotesOnString = function(stringNumber)
    {
        var boxSize = this.calculateNotesBoxSize(stringNumber);
        var stringTune = this.getStringTune(stringNumber);
        var semiTonesPattern = getSemiTonesPatternForString(state.scaleNotes, state.semiTones, stringTune);
        var $notesBlocks = $(this.notesBlocks[stringNumber]);
        $notesBlocks.toggleClass(HIDDEN_NOTE_CLASS, true);
        $notesBlocks.toggleClass(TRANSPARENT_NOTE_CLASS, false);
        var stringTuneOffset = semiTonesPattern.shift();
        var note = nextNoteAfterSemiTones(stringTune, stringTuneOffset);
        var k = 0;
        for (var i = stringTuneOffset; i < $notesBlocks.length;)
        {
            var $noteBlock = $(this.notesBlocks[stringNumber][i]);
            $noteBlock.toggleClass(HIDDEN_NOTE_CLASS, false);
            var noteStep = state.scaleNotes.indexOf(note);
            var isTransparentNote = false;
            var isInBox = (i >= state.boxFirstFret) && (i <= (state.boxFirstFret + boxSize)) || (state.boxFirstFret == -1);
            if (state.isTriadMode)
            {
                isTransparentNote = !state.triadsNotesShowPattern[noteStep];
                $noteBlock.text(noteStep + 1);
            }
            else
            {
                isTransparentNote = !state.normalNotesShowPattern[noteStep];
                $noteBlock.text(note);
            }
            if (isTransparentNote || !isInBox)
            {
                $noteBlock.toggleClass(TRANSPARENT_NOTE_CLASS, true);
            }
            var isRoot = (note == state.root);
            $noteBlock.toggleClass(NORMAL_NOTE_CLASS, !isRoot).toggleClass(HIGHLIGHTED_NOTE_CLASS, isRoot);
            i = i + semiTonesPattern[k];
            note = nextNoteAfterSemiTones(note, semiTonesPattern[k]);
            k = ++k % semiTonesPattern.length;
        }
    }

    this.putNotesOnAllStrings = function()
    {
        for (var i = 0; i < state.stringsNumber; i++)
        {
            this.putNotesOnString(i);
        }
    }

    this.putNotesOnNearStrings = function(stringNumber)
    {
        if (stringNumber == 0)
        {
            this.putNotesOnString(1);
        }
        else if (stringNumber == state.stringsNumber)
        {
            this.putNotesOnString(stringNumber - 1);
        }
        else
        {
            this.putNotesOnString(stringNumber - 1);
            this.putNotesOnString(stringNumber + 1);
        }
    }

    this.getStringTune = function(stringNumber)
    {
        return state.stringsTunes[stringNumber % state.stringsTunes.length];
    }
    
    this.calculateNotesBoxSize = function(stringNumber, fretNumber)
    {
        if (arguments.length > 1)
        {
            var fretNumber = state.boxFirstFret;
        }
        var boxSize = 0;
        if (stringNumber > 0)
        {
            var higherStringNote = this.getStringTune(stringNumber - 1);
            var currentStringNote = this.getStringTune(stringNumber);
            higherStringNote = nextNoteAfterSemiTones(higherStringNote, fretNumber);
            currentStringNote = nextNoteAfterSemiTones(currentStringNote, fretNumber);
            while (currentStringNote != higherStringNote)
            {
                currentStringNote = nextNote(currentStringNote);
                if (currentStringNote != higherStringNote)
                {
                    boxSize++;
                }
            }
        }
        else
        {
            boxSize = 4;
        }
        return boxSize;
    }

    this.calculateNotesBoxSizeForAllStrings = function(fretNumber)
    {
        var maxBoxSize = 0;
        for (var i = 0; i < state.stringsNumber; i++)
        {
            var boxSize = this.calculateNotesBoxSize(i, fretNumber);
            if (boxSize > maxBoxSize)
            {
                maxBoxSize = boxSize;
            }
        }
        return maxBoxSize;
    }

    this.isBoxFit = function(fretNumber, boxSize)
    {
        return (fretNumber + boxSize) <= FRETS_NUMBER;
    }
    
    this.addString = function(stringNumber)
    {
        var param = {currentStringNumber: stringNumber + 1}
        var verFrets = $('.' + NULL_VER_FRET_CLASS + ', .' + VER_FRET_INNER_CLASS, this.$fretboardBlock);
        var isFretWithMarker = false;
        var isFretWithDoubleMarker = false;
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
                isFretWithMarker = (i == 1) || (i == 3) || (i == 5) || (i == 7) || 
                    (i == 9) || (i == 15) || (i == 17) || (i == 19) || (i == 21);
                isFretWithDoubleMarker = (i == 12) || (i == 24);
                if (isFretWithMarker)
                {
                    $(verFrets[i]).append(STRING_FRET_MARK_TMPL());
                    $(FRET_DOT_TMPL()).insertAfter(verFrets[i]);
                }
                else if(isFretWithDoubleMarker)
                {
                    $(verFrets[i]).append(STRING_DOUBLE_FRET_MARK_TMPL());
                    $(FRET_DOUBLE_DOT_TMPL()).insertAfter(verFrets[i]);
                }
            }
        }
        this.putNotesOnString(stringNumber);
    }
    
    this.delLastString = function()
    {
        var verFrets = $('.' + NULL_VER_FRET_CLASS + ', .' + VER_FRET_CLASS, this.$fretboardBlock);
        for (var i = 0; i < verFrets.length; i++)
        {
            $('.' + HOR_FRET_CLASS, $(verFrets[i])).last().remove();
        }
    }

    this.onFretClick = function(event)
    {
        var that = event.data.that;
        var fretNumber = that.$fretboardBlock.
            find('.' + NULL_VER_FRET_CLASS + ', .' + VER_FRET_INNER_CLASS).index(this);
        if (state.boxFirstFret == fretNumber)
        {
            state.boxFirstFret = -1;
        }
        else
        {
            var boxSize = that.calculateNotesBoxSizeForAllStrings(fretNumber);
            if (that.isBoxFit(fretNumber, boxSize))
            {
                state.boxFirstFret = fretNumber;
            }
        }
        that.putNotesOnAllStrings();
        state.updateSerializedData();
    }

    this.onFretHoverIn = function(event)
    {
        var that = event.data.that;
        var fretNumber = that.$fretboardBlock.
            find('.' + NULL_VER_FRET_CLASS + ', .' + VER_FRET_INNER_CLASS).index(this);
        var boxSize = that.calculateNotesBoxSizeForAllStrings(fretNumber);
        if (that.isBoxFit(fretNumber, boxSize))
        {
            var $fretsHovers = $('.' + FRET_HOVER_CLASS, that.$fretboardBlock);
            for (var i = 0; i <= boxSize; i++)
            {
                var hoverClass = FRET_HOVER_ACTIVE_CENTER_CLASS;
                if (i == 0)
                {
                    hoverClass = FRET_HOVER_ACTIVE_START_CLASS;
                }
                else if (i == boxSize) 
                {
                    hoverClass = FRET_HOVER_ACTIVE_END_CLASS;
                }
                $($fretsHovers[fretNumber + i]).toggleClass(hoverClass, true);
            }
        }
    }

    this.onFretHoverOut = function(event)
    {
        var that = event.data.that;
        that.$fretboardBlock.find('.' + FRET_HOVER_CLASS).
            toggleClass(FRET_HOVER_ACTIVE_START_CLASS, false).
            toggleClass(FRET_HOVER_ACTIVE_CENTER_CLASS, false).
            toggleClass(FRET_HOVER_ACTIVE_END_CLASS, false);
    }

    this.init = function()
    {
        for (var i = 0; i < FRETS_NUMBER; i++)
        {
            this.$fretboardBlock.children().last().before(STRING_VER_FRET_TMPL());
        }
        for (var i = 0; i < state.stringsNumber; i++)
        {
            this.addString(i);
        }
        this.$fretboardBlock.on("click", '.' + NULL_VER_FRET_CLASS + ', .' + VER_FRET_INNER_CLASS, {that: this}, this.onFretClick);
        this.$fretboardBlock.on("mouseenter", '.' + NULL_VER_FRET_CLASS + ', .' + VER_FRET_INNER_CLASS, {that: this}, this.onFretHoverIn);
        this.$fretboardBlock.on("mouseleave", '.' + NULL_VER_FRET_CLASS + ', .' + VER_FRET_INNER_CLASS, {that: this}, this.onFretHoverOut);
    }
}
