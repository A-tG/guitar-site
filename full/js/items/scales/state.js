function ScalesItemState(id, JSONstring)
{
    this.id = id;
    this.type = "scales";
    
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
        +this.isTriadMode,
        ParsingUt.boolArrToNumber(this.normalNotesShowPattern),
        ParsingUt.boolArrToNumber(this.triadsNotesShowPattern),
        this.boxFirstFret,
        +this.isLH
    ];
    var JSONstring = JSON.stringify(fieldsToSave);
    return JSONstring;
}

ScalesItemState.prototype.deserialize = function(JSONstring)
{
    var parsedArr = JSON.parse(JSONstring);
    this.type = parsedArr[0];
    this.scale = parsedArr[1];
    this.root = parsedArr[2];
    this.tuning = parsedArr[3];
    this.halfStep = parsedArr[4];
    this.stringsNumber = parsedArr[5];
    this.stringsTunes = parsedArr[6];
    this.isTriadMode = !!parsedArr[7];
    this.normalNotesShowPattern = ParsingUt.numberToBoolArr(parsedArr[8], 12);
    this.triadsNotesShowPattern = ParsingUt.numberToBoolArr(parsedArr[9], 12);
    this.semiTones = Scale.getSemitones(this.scale);
    this.scaleNotes = Note.getNotesFromSemiTones(this.root, this.semiTones);
    this.boxFirstFret = parsedArr[10];
    this.isLH = !!parsedArr[11];
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
    this.semiTones = Scale.getSemitones(this.scale);
    this.scaleNotes =  Note.getNotesFromSemiTones(this.root, this.semiTones);
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

ScalesItemState.prototype.initStringTunes = function()
{   
    var tunes = this.stringsTunes.slice();
    for (var i = tunes.length; i < this.stringsNumber; i++)
    {
        this.stringsTunes.push(Tuning.getStringTune(tunes, i));
    }
}

ScalesItemState.prototype.init = function(JSONstring)
{
    this.readFromDefaultOptions();
    if (JSONstring)
    {
        this.deserialize(JSONstring);
    }
    this.initStringTunes();
    this.saveToQuery();
}
