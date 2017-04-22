function ScalesItemState(id, JSONstring)
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

ScalesItemState.prototype.saveToQuery = function()
{
    menuItems.updateItemSerializedData(this.id, this.serialize());
    menuItems.updateItemsQueryParams();
}

ScalesItemState.prototype.serialize = function()
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

ScalesItemState.prototype.deserialize = function(JSONstring)
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

ScalesItemState.prototype.saveToDefaultOptions = function()
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
    defaults.scales.saveToCookie();
}

ScalesItemState.prototype.readFromDefaultOptions = function()
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

ScalesItemState.prototype.init = function(JSONstring)
{
    this.readFromDefaultOptions();
    if (JSONstring)
    {
        this.deserialize(JSONstring);
    }
    this.saveToQuery();
}
