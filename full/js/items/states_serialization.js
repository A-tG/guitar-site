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
        var parsedArr = JSON.parse(this.JSON);
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
        parsedArr = JSON.parse(this.JSON);
    }
    catch (err) {}
    parsedArr[0] = SCALES_TYPE;
    if (parsedArr.length != 12)
    {
        parsedArr.slice(0, 11)
    }
    if (!Scale.isCorrect(parsedArr[1]))
    {
        parsedArr[1] = defaults.scales.scale;
    }
    if (!Note.isCorrect(parsedArr[2]))
    {
        parsedArr[2] = defaults.scales.root;
    }
    if (!Tuning.isCorrect(parsedArr[3]))
    {
        parsedArr[3] = defaults.scales.tuning;
    }
    if (!Halfstep.isCorrect(parsedArr[4]))
    {
        parsedArr[4] = defaults.scales.halfStep;
    } 
    if (!ParsingUt.isCorrectStringsNumber(parsedArr[5]))
    {
        parsedArr[5] = defaults.scales.stringsNumber;
    } 
    if (!Tuning.isCorrectNotes(parsedArr[6]))
    {
        parsedArr[6] = defaults.scales.stringsTunes;
    }
    if (typeof parsedArr[7] !== 'number')
    {
        parsedArr[7] = +defaults.scales.isTriadMode;
    }
    if (typeof parsedArr[8] == 'number')
    {
        var parameter = ParsingUt.numberToBoolArr(parsedArr[8], 12);
        if (!ParsingUt.isCorrectNotesShowPattern(parameter))
        {
            parsedArr[8] = ParsingUt.boolArrToNumber(defaults.scales.normalNotesShowPattern);
        }
    } else
    {
        parsedArr[8] = ParsingUt.boolArrToNumber(defaults.scales.normalNotesShowPattern);
    }
    if (typeof parsedArr[9] == 'number')
    {
        var parameter = ParsingUt.numberToBoolArr(parsedArr[9], 12);
        if (!ParsingUt.isCorrectNotesShowPattern(parameter))
        {
            parsedArr[9] = ParsingUt.boolArrToNumber(defaults.scales.triadsNotesShowPattern);
        }
    } else
    {
        parsedArr[9] = ParsingUt.boolArrToNumber(defaults.scales.triadsNotesShowPattern);
    }
    if (!ParsingUt.isCorrectBoxFret(parsedArr[10]))
    {
        parsedArr[10] = defaults.scales.boxFirstFret;
    }
    if (typeof parsedArr[11] !== 'number')
    {
        parsedArr[11] = +defaults.scales.isLH;
    }
    this.JSON = JSON.stringify(parsedArr);
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
            //this.chordsStateValidate();
            break;
        default:
            this.scalesStateValidate();
            break;
    }
}
