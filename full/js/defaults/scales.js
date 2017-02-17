defaults.scales = {
    scale: "major",
    root: "C",
    tuning: "standart_e",
    halfStep: 0,
    stringsTunes: DEFAULT_STRING_TUNES,
    stringsNumber: 6,
    isTriadMode: false,
    normalNotesShowPattern: DEFAULT_NOTES_SHOW_PATTERN,
    triadsNotesShowPattern: DEFAULT_TRIADS_SHOW_PATTERN,
    boxFirstFret: -1,
    isLH: false,

    readFromCookie: function()
    {
        if (Cookies.getJSON("defaultScaleOptions") !== undefined)
        {
            var options = Cookies.getJSON("defaultScaleOptions");
            if ((options.scale !== undefined) && isCorrectScale(options.scale))
            {
                this.scale = options.scale;
            }
            if ((options.root !== undefined) && isCorrectNote(options.root))
            {
                this.root = options.root;
            }
            if ((options.tuning !== undefined) && isCorrectTuning(options.tuning))
            {
                this.tuning = options.tuning;
            }
            if ((options.halfStep !== undefined) && isCorrectHalfStep(options.halfStep))
            {
                this.halfStep = +options.halfStep;
            }
            if ((options.stringsTunes !== undefined) && isCorrectTuningNotes(options.stringsTunes))
            {
                this.stringsTunes = options.stringsTunes;
            }
            if ((options.stringsNumber !== undefined) && isCorrectStringsNumber(options.stringsNumber))
            {
                this.stringsNumber = +options.stringsNumber;
            }
            if ((options.isTriadMode !== undefined) && (typeof options.isTriadMode === 'boolean'))
            {
                this.isTriadMode = options.isTriadMode;
            }
            if ((options.normalNotesShowPattern !== undefined) && 
                isCorrectNotesShowPattern(options.normalNotesShowPattern))
            {
                this.normalNotesShowPattern = options.normalNotesShowPattern;
            }
            if ((options.triadsNotesShowPattern !== undefined) && 
                isCorrectNotesShowPattern(options.triadsNotesShowPattern))
            {
                this.triadsNotesShowPattern = options.triadsNotesShowPattern;
            }
            if ((options.boxFirstFret !== undefined) && isCorrectBoxFret(options.boxFirstFret))
            {
                this.boxFirstFret = options.boxFirstFret;
            }
            if ((options.isLH !== undefined) && (typeof options.isLH === 'boolean'))
            {
                this.isLH = options.isLH;
            }
        }
    },

    init: function()
    {
        this.readFromCookie();
    }
}
