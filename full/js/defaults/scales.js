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
            if ((options.scale !== undefined) && Scale.isCorrect(options.scale))
            {
                this.scale = options.scale;
            }
            if ((options.root !== undefined) && Note.isCorrect(options.root))
            {
                this.root = options.root;
            }
            if ((options.tuning !== undefined) && Tuning.isCorrect(options.tuning))
            {
                this.tuning = options.tuning;
            }
            if ((options.halfStep !== undefined) && Halfstep.isCorrect(options.halfStep))
            {
                this.halfStep = +options.halfStep;
            }
            if ((options.stringsTunes !== undefined) && Tuning.isCorrectNotes(options.stringsTunes))
            {
                this.stringsTunes = options.stringsTunes;
            }
            if ((options.stringsNumber !== undefined) && ParsingUt.isCorrectStringsNumber(options.stringsNumber))
            {
                this.stringsNumber = +options.stringsNumber;
            }
            if ((options.isTriadMode !== undefined) && (typeof options.isTriadMode === 'boolean'))
            {
                this.isTriadMode = options.isTriadMode;
            }
            if ((options.normalNotesShowPattern !== undefined) && 
                ParsingUt.isCorrectNotesShowPattern(options.normalNotesShowPattern))
            {
                this.normalNotesShowPattern = options.normalNotesShowPattern;
            }
            if ((options.triadsNotesShowPattern !== undefined) && 
                ParsingUt.isCorrectNotesShowPattern(options.triadsNotesShowPattern))
            {
                this.triadsNotesShowPattern = options.triadsNotesShowPattern;
            }
            if ((options.boxFirstFret !== undefined) && ParsingUt.isCorrectBoxFret(options.boxFirstFret))
            {
                this.boxFirstFret = options.boxFirstFret;
            }
            if ((options.isLH !== undefined) && (typeof options.isLH === 'boolean'))
            {
                this.isLH = options.isLH;
            }
        }
    },

    saveToCookie: function()
    {
        Cookies.set("defaultScaleOptions", this, {expires: DEFAULT_SCALE_OPTIONS_EXPIRE_DAYS});
    },

    init: function()
    {
        this.readFromCookie();
    }
}
