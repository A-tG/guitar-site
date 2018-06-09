function GuitarTuning(tuningName)
{
    this._name = this.getDefaultName();
    this._stringsTuning = this.getDefaultTunings();
    this._HS = 0;

    if (this._isArgReceived(tuningName))
    {
        this.setName(tuningName);
    }
}

GuitarTuning.prototype._IS_DEBUG = IS_DEBUG;
// associative array "tuning_name" => tunings_array
GuitarTuning.prototype._TUNINGS = TUNINGS;
GuitarTuning.prototype._CUSTOM_NAME = "custom";
GuitarTuning.prototype._MIN_HS = -12;
GuitarTuning.prototype._MAX_HS = 12;

GuitarTuning.prototype._isArgReceived = function(arg)
{
    return arg !== undefined; 
}

GuitarTuning.prototype._isValidTuningName = function(tuningName)
{
    return this._TUNINGS.hasOwnProperty(tuningName);
}

GuitarTuning.prototype._isValidStringsTuning = function(stringsTuning)
{
    return stringsTuning.every(function(item, i, arr) {return item instanceof Note});
}

GuitarTuning.prototype._isValidHS = function(halfStep)
{
    return (Number.isInteger(halfStep)) && ((halfStep) >= this._MIN_HS) && ((halfStep) <= this._MAX_HS);
}

GuitarTuning.prototype.isValidStringsTuning = function(stringsTuning)
{
    if (this._isValidStringsTuning(stringsTuning))
    {
        return true;
    }
    if (this._IS_DEBUG)
    {
        console.error("Invalid strings tuning: " + stringsTuning);
    }
    return false;
}

GuitarTuning.prototype.isValidTuningName = function(tuningName)
{
    if (this._isValidTuningName(tuningName))
    {
        return true;
    }
    if (this._IS_DEBUG)
    {
        console.error("Invalid strings tuning name: " + tuningName);
    }
    return false;
}

GuitarTuning.prototype.isInTunings = function(stringsTuning)
{
    return this.getNameFromTunings(stringsTuning) !== GuitarTuning._CUSTOM_NAME;
}

GuitarTuning.prototype.isValidHS = function(halfStep)
{
    if (this._isValidHS(halfStep))
    {
        return true;
    }
    if (this._IS_DEBUG)
    {
        console.error("Invalid strings tuning half-steps number: " + halfStep);
    }
    return false;
}

GuitarTuning.prototype.getDefaultName = function()
{
    return "standart_e";
}

GuitarTuning.prototype.getDefaultTunings = function()
{
    var tunings = ["E", "B", "G", "D", "A", "E", "B", "F#", "C#", "G#", "D#", "A#"];
    return tunings.map(function(item) {return new Note(item)});
}

GuitarTuning.prototype.getStringTuning = function(stringNumber)
{
    var index = stringNumber % this._stringsTuning.length;
    return this._stringsTuning[index].getCopy().higherST(this._HS);
}

GuitarTuning.prototype.setStringTuning = function(stringNumber, note)
{
    note.higherST(-this._HS);
    if (stringNumber >= this._stringsTuning.length)
    {
        for (var i = this._stringsTuning.length; i < stringNumber; i++)
        {
            this._stringsTuning.push(this.getStringTuning(i));
        }
        this._stringsTuning.push(note);
    } else
    {
        this._stringsTuning[stringNumber] = note;
    }
    if (this.isInTunings(this._stringsTuning))
    {
        this._name = this.getNameFromTunings(this._stringsTuning);
    } else
    {
        this._name = this._CUSTOM_NAME;
    }
    return this;
}

GuitarTuning.prototype.setName = function(tuningName)
{
    if (this.isValidTuningName(tuningName))
    {
        this._name = tuningName;
        this._stringsTuning = this._TUNINGS[tuningName].map(function(item) {return new Note(item)});
    }
    return this;
}

GuitarTuning.prototype.getName = function()
{
    return this._name;
}

GuitarTuning.prototype.setTuning = function(stringsTuning)
{
    if (this.isValidStringsTuning(stringsTuning))
    {
        this._name = this.getNameFromTunings(stringsTuning);
        this._stringsTuning = stringsTuning;
    }
    return this;
}

GuitarTuning.prototype.setHS = function(halfStep)
{
    if (this.isValidHS(halfStep))
    {
        this._HS = halfStep;
    }
    return this;
}

GuitarTuning.prototype.getHS = function()
{
    return this._HS;
}

GuitarTuning.prototype.set = function(tuningName, halfStep, stringsTuning)
{
    if (tuningName === this._CUSTOM_NAME)
    {
        this._name = this._CUSTOM_NAME;
        this.setTuning(stringsTuning);
    } else
    {
        this.setName(tuningName);
    }
    if (this._isArgReceived(halfStep))
    {
        this.setHS(halfStep);
    }
    return this;
}

GuitarTuning.prototype.setFromArr = function(arr)
{
    if (arr)
    {
        switch (arr.length)
        {
            case 1:
                this.set(arr[0]);
                break;
            case 2:
                this.set(arr[0], arr[1]);
                break;
            case 3:
                this.set(arr[0], arr[1], arr[3]);
                break;
            default:
                if (this._IS_DEBUG)
                {
                    console.error("Ivalid argument length: " + arr);
                }
        } 
    }
    return this;
}

GuitarTuning.prototype.getNameFromTunings = function(stringsTuning)
{
    if (!this.isValidStringsTuning(stringsTuning))
    {
        return this._CUSTOM_NAME;
    }
    for (var name in this._TUNINGS)
    {
        var isEqualLengths = this._TUNINGS[name].length == stringsTuning.length;
        if (isEqualLengths)
        {
            var isEqual = this._TUNINGS[name].every(function(item, i, arr) {
                return item == stringsTuning[i].getName();
            });
            if (isEqual)
            {
                return name;
            }
        }
    }
    return this._CUSTOM_NAME;
}

GuitarTuning.prototype.incHS = function()
{
    var HS = this._HS;
    if (this.isValidHS(++HS))
    {
        this._HS = HS;
    }
    return this;
}

GuitarTuning.prototype.decHS = function()
{
    var HS = this._HS;
    if (this.isValidHS(--HS))
    {
        this._HS = HS;
    }
    return this;
}

GuitarTuning.prototype.serialize = function()
{
    var arr = [this._name, this._HS];
    if (this._name === this._CUSTOM_NAME)
    {
        arr.push(this._stringsTuning);
    }
    return arr;
}

GuitarTuning.prototype.deserialize = GuitarTuning.prototype.setFromArr;

GuitarTuning.prototype.toJSON = GuitarTuning.prototype.serialize;
