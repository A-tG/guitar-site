function Fretboard(state, $fretboardBlock)
{
    this.state = state;
    this.$fretboardBlock = $fretboardBlock;
    this.notesBlocks = [];
    this.verFrets = [];

    this.init();
}

Fretboard.prototype.putNote = function(noteName, fretNumber, stringNumber, boxSize)
{
    var $noteBlock = $(this.notesBlocks[stringNumber][fretNumber]);
    $noteBlock.toggleClass(HIDDEN_NOTE_CLASS, false);
    var noteStep = this.state.scale.getNotesNames().indexOf(noteName);
    var isTransparentNote = false;
    var isInBox = (this.state.boxFirstFret == -1) || (fretNumber >= this.state.boxFirstFret) && 
        (fretNumber < (this.state.boxFirstFret + boxSize));
    if (this.state.isTriadMode)
    {
        isTransparentNote = !this.state.triadsNotesShowPattern.get(noteStep);
        $noteBlock.text(noteStep + 1);
    }
    else
    {
        isTransparentNote = !this.state.normalNotesShowPattern.get(noteStep);
        var noteText = noteName;
        if (IS_FLAT_NOTATION)
        {
            noteText = new Note(noteName).normalSharpToFlat();
        }
        $noteBlock.text(noteText);
    }
    if (isTransparentNote || !isInBox)
    {
        $noteBlock.toggleClass(TRANSPARENT_NOTE_CLASS, true);
    }
    var isRoot = (noteName == this.state.scale.getRoot().getName());
    $noteBlock.toggleClass(NORMAL_NOTE_CLASS, !isRoot).toggleClass(HIGHLIGHTED_NOTE_CLASS, isRoot);
}

Fretboard.prototype.putNotesOnString = function(stringNumber)
{
    var boxSize = this.calculateNotesBoxSize(stringNumber, this.state.boxFirstFret);
    var stringTune = this.state.tuning.getStringTuning(stringNumber);
    var semiTonesPattern = this.state.scale.getSemiTonesPatternForString(stringTune);
    var $notesBlocks = $(this.notesBlocks[stringNumber]);
    $notesBlocks.toggleClass(HIDDEN_NOTE_CLASS, true);
    $notesBlocks.toggleClass(TRANSPARENT_NOTE_CLASS, false);
    var stringTuneOffset = semiTonesPattern.shift();
    var note = stringTune.higherST(stringTuneOffset);
    var k = 0;
    for (var fretNumber = stringTuneOffset; fretNumber < $notesBlocks.length;)
    {
        this.putNote(note.getName(), fretNumber, stringNumber, boxSize);
        fretNumber = fretNumber + semiTonesPattern[k];
        note.higherST(semiTonesPattern[k]);
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
    var lowerStringNumber = stringNumber - 1;
    var higherStringNumber = stringNumber + 1;
    if (lowerStringNumber >= 0)
    {
        this.putNotesOnString(lowerStringNumber);
    }
    if (higherStringNumber < this.state.stringsNumber)
    {
        this.putNotesOnString(higherStringNumber);
    }
}

Fretboard.prototype.calculateNotesBoxSize = function(stringNumber, fretNumber)
{
    var boxSize = 0;
    if (stringNumber > 0)
    {
        var higherStringNote = this.state.tuning.getStringTuning(stringNumber - 1);
        var currentStringNote = this.state.tuning.getStringTuning(stringNumber);
        higherStringNote.higherST(fretNumber);
        currentStringNote.higherST(fretNumber);
        if (currentStringNote.getName() == higherStringNote.getName())
        {
            return 1;
        }
        while (currentStringNote.getName() != higherStringNote.getName())
        {
            currentStringNote.higher();
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
    for (var i = this.state.stringsNumber - 1; i >= 0 ; i--)
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
    var stringNumberStyle = Math.min(stringNumber + 1, MAX_STRINGS_STYLE);
    var param = {currentStringNumber: stringNumberStyle};
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
        for (var i = 0; i < boxSize; i++)
        {
            var hoverClass = FRET_HOVER_ACTIVE_CENTER_CLASS;
            if (i == 0)
            {
                hoverClass = FRET_HOVER_ACTIVE_START_CLASS;
            }
            else if (i == boxSize - 1) 
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

Fretboard.prototype.updateNoteNotation = Fretboard.prototype.putNotesOnAllStrings;

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
