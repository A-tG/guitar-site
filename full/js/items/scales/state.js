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
    this.isLH = false;

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
        isCorrect = (parsedArr.length == 12) && 
            (parsedArr[0] == "scales") && isCorrectScale(parsedArr[1]) && 
            isCorrectNote(parsedArr[2]) && isCorrectTuning(parsedArr[3]) && 
            isCorrectHalfStep(parsedArr[4]) && isCorrectStringsNumber(parsedArr[5]) && 
            isCorrectTuningNotes(parsedArr[6]) && (typeof parsedArr[7] === 'boolean') && 
            isCorrectNotesShowPattern(parsedArr[8]) && isCorrectNotesShowPattern(parsedArr[9]) &&
            isCorrectBoxFret(parsedArr[10]) && (typeof parsedArr[11] === 'boolean'); 
    }
    return isCorrect;
}

ScaleItemState.prototype.saveToQuery = function()
{
    menuItems.updateItemSerializedData(this.id, this.serialize());
    menuItems.updateItemsQueryParams();
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
        this.boxFirstFret,
        this.isLH
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
    this.isLH = parsedArr[11];
}

ScaleItemState.prototype.saveToDefaultOptions = function()
{
    defaults.scales.scale = this.scale;
    defaults.scales.root = this.root;
    defaults.scales.semiTones = this.semiTones;
    defaults.scales.tuning = this.tuning;
    defaults.scales.halfStep = this.halfStep;
    defaults.scales.stringsTunes = this.stringsTunes;
    defaults.scales.stringsNumber = this.stringsNumber;
    defaults.scales.isTriadMode = this.isTriadMode;
    defaults.scales.boxFirstFret = this.boxFirstFret;
    defaults.scales.isLH = this.isLH;
    Cookies.set("defaultScaleOptions", defaults.scales, {expires: DEFAULT_SCALE_OPTIONS_EXPIRE_DAYS});
}

ScaleItemState.prototype.readFromDefaultOptions = function()
{
    this.scale = defaults.scales.scale;
    this.root = defaults.scales.root;
    this.semiTones = getScaleSemitones(this.scale);
    this.scaleNotes =  getNotesFromSemiTones(this.root, this.semiTones);
    this.tuning = defaults.scales.tuning;
    this.halfStep = defaults.scales.halfStep;
    this.stringsTunes = defaults.scales.stringsTunes;
    this.stringsNumber = defaults.scales.stringsNumber;
    this.isTriadMode = defaults.scales.isTriadMode;
    this.normalNotesShowPattern = defaults.scales.normalNotesShowPattern;
    this.triadsNotesShowPattern = defaults.scales.triadsNotesShowPattern;
    this.boxFirstFret = defaults.scales.boxFirstFret;
    this.isLH = defaults.scales.isLH;
}

ScaleItemState.prototype.init = function(JSONstring)
{
    this.readFromDefaultOptions();
    if (JSONstring && this.isCorrectSerializedData(JSONstring))
    {
        this.deserialize(JSONstring);
    }
    this.saveToQuery();
}
