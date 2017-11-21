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
        var parsedArr = JSON.parse(this.JSON, ParsingUt.semiTonesPatternIntToBool);
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
        parsedArr = JSON.parse(this.JSON, ParsingUt.semiTonesPatternIntToBool);
    }
    catch (err) {}
    var isValid = true;
    parsedArr[0] = SCALES_TYPE;
    if (parsedArr.length != 12)
    {
        isValid = false;
    }
    if (!Scale.isCorrect(parsedArr[1]))
    {
        isValid = false;
        parsedArr[1] = defaults.scales.scale;
    }
    if (!Note.isCorrect(parsedArr[2]))
    {
        isValid = false;
        parsedArr[2] = defaults.scales.root;
    }
    if (!Tuning.isCorrect(parsedArr[3]))
    {
        isValid = false;
        parsedArr[3] = defaults.scales.tuning;
    }
    if (!Halfstep.isCorrect(parsedArr[4]))
    {
        isValid = false;
        parsedArr[4] = defaults.scales.halfStep;
    } 
    if (!ParsingUt.isCorrectStringsNumber(parsedArr[5]))
    {
        console.log(parsedArr)
        isValid = false;
        parsedArr[5] = defaults.scales.stringsNumber;
    } 
    if (!Tuning.isCorrectNotes(parsedArr[6]))
    {
        isValid = false;
        parsedArr[6] = defaults.scales.stringsTunes;
    }
    if (typeof parsedArr[7] !== 'boolean')
    {
        isValid = false;
        parsedArr[7] = defaults.scales.isTriadMode;
    }
    if (!ParsingUt.isCorrectNotesShowPattern(parsedArr[8]))
    {
        isValid = false;
        parsedArr[8] = defaults.scales.normalNotesShowPattern;
    }
    if (!ParsingUt.isCorrectNotesShowPattern(parsedArr[9]))
    {
        isValid = false;
        parsedArr[9] = defaults.scales.triadsNotesShowPattern;
    }
    if (!ParsingUt.isCorrectBoxFret(parsedArr[10]))
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
        this.JSON = JSON.stringify(parsedArr, ParsingUt.semiTonesPatternBoolToInt);
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
