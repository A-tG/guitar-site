function Fretboard(state, $fretboardBlock)
{
    this.state = state;
    this.$fretboardBlock = $fretboardBlock;
    this.notesBlocks = [];
    this.verFrets = [];

    this.init();
}

Fretboard.prototype.putNote = function(note, fretNumber, stringNumber, boxSize)
{
    var $noteBlock = $(this.notesBlocks[stringNumber][fretNumber]);
    $noteBlock.toggleClass(HIDDEN_NOTE_CLASS, false);
    var noteStep = this.state.scaleNotes.indexOf(note);
    var isTransparentNote = false;
    var isInBox = (fretNumber >= this.state.boxFirstFret) && 
        (fretNumber <= (this.state.boxFirstFret + boxSize)) || 
        (this.state.boxFirstFret == -1);
    if (this.state.isTriadMode)
    {
        isTransparentNote = !this.state.triadsNotesShowPattern[noteStep];
        $noteBlock.text(noteStep + 1);
    }
    else
    {
        isTransparentNote = !this.state.normalNotesShowPattern[noteStep];
        $noteBlock.text(note);
    }
    if (isTransparentNote || !isInBox)
    {
        $noteBlock.toggleClass(TRANSPARENT_NOTE_CLASS, true);
    }
    var isRoot = (note == this.state.root);
    $noteBlock.toggleClass(NORMAL_NOTE_CLASS, !isRoot).toggleClass(HIGHLIGHTED_NOTE_CLASS, isRoot);
}

Fretboard.prototype.putNotesOnString = function(stringNumber)
{
    var boxSize = this.calculateNotesBoxSize(stringNumber);
    var stringTune = Tuning.getStringTune(this.state.stringsTunes, stringNumber);
    var semiTonesPattern = getSemiTonesPatternForString(this.state.scaleNotes, 
        this.state.semiTones, stringTune);
    var $notesBlocks = $(this.notesBlocks[stringNumber]);
    $notesBlocks.toggleClass(HIDDEN_NOTE_CLASS, true);
    $notesBlocks.toggleClass(TRANSPARENT_NOTE_CLASS, false);
    var stringTuneOffset = semiTonesPattern.shift();
    var note = Note.nextSemiTones(stringTune, stringTuneOffset);
    var k = 0;
    for (var fretNumber = stringTuneOffset; fretNumber < $notesBlocks.length;)
    {
        this.putNote(note, fretNumber, stringNumber, boxSize);
        fretNumber = fretNumber + semiTonesPattern[k];
        note = Note.nextSemiTones(note, semiTonesPattern[k]);
        k = ++k % semiTonesPattern.length;
    }
}

Fretboard.prototype.putNotesOnAllStrings = function()
{
    for (var i = 0; i < this.state.stringsNumber; i++)
    {
        this.putNotesOnString(i);
    }
}

Fretboard.prototype.putNotesOnNearStrings = function(stringNumber)
{
    if (stringNumber == 0)
    {
        this.putNotesOnString(1);
    }
    else if (stringNumber == this.state.stringsNumber)
    {
        this.putNotesOnString(stringNumber - 1);
    }
    else
    {
        this.putNotesOnString(stringNumber - 1);
        this.putNotesOnString(stringNumber + 1);
    }
}

Fretboard.prototype.calculateNotesBoxSize = function(stringNumber, fretNumber)
{
    if (arguments.length > 1)
    {
        var fretNumber = this.state.boxFirstFret;
    }
    var boxSize = 0;
    if (stringNumber > 0)
    {
        var higherStringNote = Tuning.getStringTune(this.state.stringsTunes, stringNumber - 1);
        var currentStringNote = Tuning.getStringTune(this.state.stringsTunes, stringNumber);
        higherStringNote = Note.nextSemiTones(higherStringNote, fretNumber);
        currentStringNote = Note.nextSemiTones(currentStringNote, fretNumber);
        while (currentStringNote != higherStringNote)
        {
            currentStringNote = Note.next(currentStringNote);
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

Fretboard.prototype.calculateNotesBoxSizeForAllStrings = function(fretNumber)
{
    var maxBoxSize = 0;
    for (var i = 0; i < this.state.stringsNumber; i++)
    {
        var boxSize = this.calculateNotesBoxSize(i, fretNumber);
        if (boxSize > maxBoxSize)
        {
            maxBoxSize = boxSize;
        }
    }
    return maxBoxSize;
}

Fretboard.prototype.isBoxFit = function(fretNumber, boxSize)
{
    return (fretNumber + boxSize) <= FRETS_NUMBER;
}

Fretboard.prototype.addString = function(stringNumber)
{
    var param = {currentStringNumber: stringNumber + 1}
    var verFrets = this.verFrets;
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

Fretboard.prototype.delLastString = function()
{
    for (var i = 0; i < this.verFrets.length; i++)
    {
        $('.' + HOR_FRET_CLASS, $(this.verFrets[i])).last().remove();
    }
}

Fretboard.prototype.onFretClick = function(event)
{
    var that = event.data.that;
    var fretNumber = that.$fretboardBlock.
        find('.' + NULL_VER_FRET_CLASS + ', .' + VER_FRET_INNER_CLASS).index(this);
    if (that.state.boxFirstFret == fretNumber)
    {
        that.state.boxFirstFret = -1;
    }
    else
    {
        var boxSize = that.calculateNotesBoxSizeForAllStrings(fretNumber);
        if (that.isBoxFit(fretNumber, boxSize))
        {
            that.state.boxFirstFret = fretNumber;
        }
    }
    that.putNotesOnAllStrings();
    that.state.saveToQuery();
}

Fretboard.prototype.onFretHoverIn = function(event)
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

Fretboard.prototype.onFretHoverOut = function(event)
{
    var that = event.data.that;
    that.$fretboardBlock.find('.' + FRET_HOVER_CLASS).
        toggleClass(FRET_HOVER_ACTIVE_START_CLASS, false).
        toggleClass(FRET_HOVER_ACTIVE_CENTER_CLASS, false).
        toggleClass(FRET_HOVER_ACTIVE_END_CLASS, false);
}

Fretboard.prototype.init = function()
{
    for (var i = 0; i < FRETS_NUMBER; i++)
    {
        this.$fretboardBlock.children().last().before(STRING_VER_FRET_TMPL());
    }
    this.verFrets = $('.' + NULL_VER_FRET_CLASS + ', .' + VER_FRET_INNER_CLASS, this.$fretboardBlock);
    for (var i = 0; i < this.state.stringsNumber; i++)
    {
        this.addString(i);
    }
    this.$fretboardBlock.on("click", '.' + NULL_VER_FRET_CLASS + ', .' + VER_FRET_INNER_CLASS, 
        {that: this}, this.onFretClick);
    this.$fretboardBlock.on("mouseenter", '.' + NULL_VER_FRET_CLASS + ', .' + VER_FRET_INNER_CLASS, 
        {that: this}, this.onFretHoverIn);
    this.$fretboardBlock.on("mouseleave", '.' + NULL_VER_FRET_CLASS + ', .' + VER_FRET_INNER_CLASS, 
        {that: this}, this.onFretHoverOut);
}
