function ScalesItem(id, JSONstring)
{
    this.state = new ScalesItemState(id, JSONstring);
    this.$itemBlock = $('#' + id);;

    this.init();
}

ScalesItem.prototype.putNotesOnAllStrings = function()
{
    this.neck.putNotesOnAllStrings();
}

ScalesItem.prototype.selectCurrentStringsTunes = function()
{
    this.neck.selectCurrentStringsTunes();
}

ScalesItem.prototype.selectCurrentScale = function()
{
    $('.' + SCALE_SELECT_CLASS + " [value='" + this.state.scale + "']", this.$itemBlock).
        prop("selected", true);
}

ScalesItem.prototype.updateScaleNotesBlock = function()
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
    var notesShowPattern = this.state.normalNotesShowPattern;
    if (this.state.isTriadMode)
    {
        notesShowPattern = this.state.triadsNotesShowPattern;
    }
    for (var i = 0; i < scaleNotesNumber; i++)
    {
        var isTransparentNote = !(notesShowPattern[i]);
        if (isTransparentNote)
        {
            var $noteBlock = $($scaleNotesBlocks[i]);
            $noteBlock.toggleClass(TRANSPARENT_BLOCK_CLASS, true);
            if (i == 0)
            {
                $noteBlock = $($scaleNotesBlocks[scaleNotesNumber]);
                $noteBlock.toggleClass(TRANSPARENT_BLOCK_CLASS, true);
            }
        }
    }
    $('.' + SCALE_NOTES_CLASS, this.$itemBlock)
        .on("click", '.' + SCALE_NOTE_CLASS, {that: this}, this.onScaleNoteClick);
}

ScalesItem.prototype.selectCurrentRootNote = function()
{
    $('.' + ROOT_NOTE_CLASS + '.' + SELECTED_TEXT_CLASS, this.$itemBlock).
        toggleClass(SELECTED_TEXT_CLASS, false);
    var $rootNoteToSelect = $('.' + ROOT_NOTE_CLASS + ":contains('" + this.state.root + "')", 
        this.$itemBlock).first();
    $rootNoteToSelect.toggleClass(SELECTED_TEXT_CLASS, true);
}

ScalesItem.prototype.onScaleChange = function(event)
{
    var that = event.data.that;
    var scaleName = $(this).val().toLowerCase();
    if (Scale.isCorrect(scaleName))
    {
        that.state.scale = scaleName;
        that.state.semiTones = Scale.getSemitones(scaleName);
        that.state.scaleNotes = Note.getNotesFromSemiTones(that.state.root, that.state.semiTones);
        that.putNotesOnAllStrings();
        that.updateScaleNotesBlock();
        that.state.saveToQuery();
    }
}

ScalesItem.prototype.onRootNoteChange = function(event)
{
    var that = event.data.that;
    var note = $(this).text();
    if (Note.isCorrect(note))
    {
        that.state.root = note.toUpperCase();
        that.selectCurrentRootNote();
        that.state.scaleNotes = Note.getNotesFromSemiTones(that.state.root, that.state.semiTones);
        that.updateScaleNotesBlock();
        that.putNotesOnAllStrings();
        that.state.saveToQuery();
    }
}

ScalesItem.prototype.onScaleNoteClick = function(event)
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
        $noteBlock.toggleClass(TRANSPARENT_BLOCK_CLASS, !isShowNote);
        $noteBlock = $('.' + SCALE_NOTE_CLASS, that.$itemBlock).first().
            find('.' + SCALE_NOTE_TEXT_CLASS);
        $noteBlock.toggleClass(TRANSPARENT_BLOCK_CLASS, !isShowNote);
    }
    else
    {
        var $noteBlock = $(this).find('.' + SCALE_NOTE_TEXT_CLASS);
        $noteBlock.toggleClass(TRANSPARENT_BLOCK_CLASS, !isShowNote);
    }
    that.putNotesOnAllStrings();
    that.state.saveToQuery();
}

ScalesItem.prototype.onTriadsCheckboxClick = function(event)
{
    var that = event.data.that;
    if (that.state.isTriadMode)
    {
        that.state.isTriadMode = false;
        that.$triadsCheckbox.hide();
        that.$triadsCheckboxEmpty.show();
    }
    else
    {
        that.state.isTriadMode = true;
        that.$triadsCheckboxEmpty.hide();
        that.$triadsCheckbox.show();
    }
    that.updateScaleNotesBlock();
    that.putNotesOnAllStrings();
    that.state.saveToQuery();
}

ScalesItem.prototype.initTriadsCheckbox = function()
{
    this.$triadsCheckbox = $('.' + TRIADS_CHECKBOX_CLASS, this.$itemBlock);
    this.$triadsCheckboxEmpty = $('.' + TRIADS_CHECKBOX_EMPTY_CLASS, this.$itemBlock);
    if (this.state.isTriadMode)
    {
        this.$triadsCheckboxEmpty.hide();
    }
    else
    {
        this.$triadsCheckbox.hide();
    }
    this.$triadsCheckbox.click({that: this}, this.onTriadsCheckboxClick);
    this.$triadsCheckboxEmpty.click({that: this}, this.onTriadsCheckboxClick);
}

ScalesItem.prototype.initDOM = function()
{
    this.$itemOptionsBlock = $('.' + ITEM_OPTIONS_BLOCK, this.$itemBlock);
    this.$stringsBtnsBlock = $(STRINGS_BTNS_BLOCK_TMPL()).insertBefore($('.' + ITEM_HEAD_SELECT_CLASS, this.$itemBlock));
    this.$lhToggleBlock = $(LH_TOGGLE_BLOCK_TMPL()).insertAfter($('.' + ITEM_HEAD_SELECT_CLASS, this.$itemBlock));
    this.$neckBlock = $(NECK_BLOCK_TMPL()).insertAfter($('.' + ITEM_HEAD_CLASS, this.$itemBlock));
    this.$scalesOptionsBlock = $(SCALES_OPTIONS_BLOCK_TMPL()).prependTo(this.$itemOptionsBlock);
    this.$scalesSelectBlock = $(SCALES_SELECT_BLOCK_TMPL()).prependTo(this.$itemOptionsBlock);
    this.$TuningOptionsBlock = $(TUNING_OPTIONS_BLOCK_TMPL()).prependTo(this.$itemOptionsBlock);
}

ScalesItem.prototype.init = function()
{
    this.initDOM();
    this.neck = new Neck(this.state, this.$neckBlock, 
        $('.' + STRING_NUMBER_CLASS, this.$itemBlock), 
        $('.' + ADD_STRING_BTN_CLASS, this.$itemBlock),
        $('.' + DEL_STRING_BTN_CLASS, this.$itemBlock),
        $('.' + TUNING_OPTIONS_CLASS, this.$itemBlock),
        this.$lhToggleBlock);
    this.initTriadsCheckbox();
    this.updateScaleNotesBlock();
    this.selectCurrentScale();
    this.selectCurrentRootNote();
    $('.' + SCALE_SELECT_CLASS, this.$itemBlock).change({that: this}, this.onScaleChange);
    $('.' + SCALE_NOTES_BLOCK_CLASS, this.$itemBlock).
        on("click", '.' + ROOT_NOTE_CLASS, {that: this}, this.onRootNoteChange);
}
