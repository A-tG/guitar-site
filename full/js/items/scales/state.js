function ScalesStateBase()
{
    this.type = "scales";
    this.scale = new Scale();
    this.tuning = new GuitarTuning();
    this.stringsNumber = 6;
    this.isTriadMode = false;
    this.normalNotesShowPattern = new NotesShowPattern();
    this.triadsNotesShowPattern = new NotesShowPattern().deserialize(2688); // triad pattern
    this.boxFirstFret = -1;
    this.isLH = false;
}

ScalesStateBase.prototype.toArr = function()
{
    var arr =
    [
        this.type,
        this.scale,
        this.tuning,
        +this.stringsNumber,
        +this.isTriadMode,
        this.normalNotesShowPattern,
        this.triadsNotesShowPattern,
        this.boxFirstFret,
        +this.isLH
    ]
    return arr;
}

ScalesStateBase.prototype.serialize = function()
{
    var JSONstring = JSON.stringify(this.toArr());
    return JSONstring;
}

ScalesStateBase.prototype.toJSON = ScalesStateBase.prototype.toArr;

ScalesStateBase.prototype.deserialize = function(JSONstring)
{
    var parsedArr = [];
    if (JSONstring)
    {
        try
        {
            parsedArr = JSON.parse(JSONstring);   
        }
        catch (err)
        {
            console.error(err);
        }
    }
    this.type = parsedArr[0];
    this.scale = new Scale().deserialize(parsedArr[1]);
    this.tuning = new GuitarTuning().deserialize(parsedArr[2]);
    this.stringsNumber = ParsingUt.validateStringsNumber(parsedArr[3]);
    this.isTriadMode = !!parsedArr[4];
    this.normalNotesShowPattern.deserialize(parsedArr[5]);
    this.triadsNotesShowPattern.deserialize(parsedArr[6]);
    this.boxFirstFret = ParsingUt.validateBoxFret(parsedArr[7]);
    this.isLH = !!parsedArr[8];
}

function ScalesItemState(id, JSONstring)
{
    ScalesStateBase.call(this);
    this.id = id;
    
    this.init(JSONstring);
}

ScalesItemState.prototype = Object.create(ScalesStateBase.prototype);

ScalesItemState.prototype.saveToQuery = function()
{
    menuItems.updateItemSerializedData(this.id, this.serialize());
    menuItems.updateItemsQueryParams();
}

ScalesItemState.prototype.saveToDefaultOptions = function()
{
    defaults.scales.state.deserialize(this.serialize());
    defaults.scales.saveToCookie();
}

ScalesItemState.prototype.readFromDefaultOptions = function()
{
    this.deserialize(defaults.scales.state.serialize());
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
