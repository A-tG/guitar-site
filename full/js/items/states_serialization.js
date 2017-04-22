function ItemSerializedState(JSONstring)
{
    this.JSON = JSONstring;

    this.validateJSON();
}

ItemSerializedState.prototype.getJSON = function()
{
    return this.JSON;
}

ItemSerializedState.prototype.setJSON = function(JSONstring)
{
    this.JSON = JSONstring;
    this.validateJSON();
}

ItemSerializedState.prototype.getItemType = function()
{
    var type = "";
    try
    {
        var parsedArr = JSON.parse(this.JSON, semiTonesPatternIntToBool);
        type = parsedArr[0];
    }
    catch (err) {}
    return type;
}

ItemSerializedState.prototype.scalesStateValidate = function()
{
    var parsedArr = [];
    try
    {
        parsedArr = JSON.parse(this.JSON, semiTonesPatternIntToBool);
    }
    catch (err) {}
    var isValid = true;
    parsedArr[0] = SCALES_TYPE;
    if (parsedArr.length != 12)
    {
        isValid = false;
    }
    if (!isCorrectScale(parsedArr[1]))
    {
        isValid = false;
        parsedArr[1] = defaults.scales.scale;
    }
    if (!isCorrectNote(parsedArr[2]))
    {
        isValid = false;
        parsedArr[2] = defaults.scales.root;
    }
    if (!isCorrectTuning(parsedArr[3]))
    {
        isValid = false;
        parsedArr[3] = defaults.scales.tuning;
    }
    if (!isCorrectHalfStep(parsedArr[4]))
    {
        isValid = false;
        parsedArr[4] = defaults.scales.halfStep;
    } 
    if (!isCorrectStringsNumber(parsedArr[5]))
    {
        isValid = false;
        parsedArr[5] = defaults.scales.stringsNumber;
    } 
    if (!isCorrectTuningNotes(parsedArr[6]))
    {
        isValid = false;
        parsedArr[6] = defaults.scales.stringsTunes;
    }
    if (typeof parsedArr[7] !== 'boolean')
    {
        isValid = false;
        parsedArr[7] = defaults.scales.isTriadMode;
    }
    if (!isCorrectNotesShowPattern(parsedArr[8]))
    {
        isValid = false;
        parsedArr[8] = defaults.scales.normalNotesShowPattern;
    }
    if (!isCorrectNotesShowPattern(parsedArr[9]))
    {
        isValid = false;
        parsedArr[9] = defaults.scales.triadsNotesShowPattern;
    }
    if (!isCorrectBoxFret(parsedArr[10]))
    {
        isValid = false;
        parsedArr[10] = defaults.scales.boxFirstFret;
    }
    if (typeof parsedArr[11] !== 'boolean')
    {
        isValid = false;
        parsedArr[11] = defaults.scales.isLH;
    }
    if (!isValid)
    {
        this.JSON = JSON.stringify(parsedArr, semiTonesPatternBoolToInt);
    }
}

ItemSerializedState.prototype.validateJSON = function()
{
    var type = this.getItemType();
    switch (type)
    {
        case SCALES_TYPE:
            this.scalesStateValidate();
            break;
        case CHORDS_TYPE:
            this.chordsStateValidate();
            break;
        default:
            this.scalesStateValidate();
            break;
    }
}
