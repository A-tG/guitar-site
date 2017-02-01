function ScaleItemState(id, JSONstring)
{
    this.id = id;
    this.type = "scales";
    this.scale =  "major";
    this.root = "C";
    this.scaleNotes = DEFAULT_SCALE_NOTES;
    this.semiTones = DEFAULT_SCALE_SEMITONES;
    this.tuning = "standart_e";
    this.stringsNumber = 0;
    this.stringsTunes = DEFAULT_STRING_TUNES;
    this.halfStep =  0;
    this.isTriadMode = false;
    this.boxFirstFret = -1;
    this.normalNotesShowPattern = DEFAULT_NOTES_SHOW_PATTERN;
    this.triadsNotesShowPattern = DEFAULT_TRIADS_SHOW_PATTERN;

    this.init(JSONstring);
}

ScaleItemState.prototype.isCorrectSerializedData = function(JSONstring)
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
}

ScaleItemState.prototype.saveToQuery = function()
{
    var index = $('.' + ITEM_CLASS).index($('#' + this.id));
    updateItemSerializedData(index, this.serialize());
    updateItemsQueryParams();
}

ScaleItemState.prototype.serialize = function()
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
}

ScaleItemState.prototype.deserialize = function(JSONstring)
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

ScaleItemState.prototype.saveToDefaultOptions = function()
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
}

ScaleItemState.prototype.readFromDefaultOptions = function()
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

ScaleItemState.prototype.init = function(JSONstring)
{
    if (JSONstring !== undefined)
    {
        if (this.isCorrectSerializedData(JSONstring))
        {
            this.deserialize(JSONstring);
        }
        else
        {
            this.readFromDefaultOptions();
            this.saveToQuery();
        }
    }
    else
    {
        this.readFromDefaultOptions();
    } 
}
