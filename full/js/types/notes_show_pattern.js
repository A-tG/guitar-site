function NotesShowPattern()
{
    this._arr = new Array(this._SIZE);
    for (var i = 0; i < this._arr.length; i++)
    {
        this._arr[i] = true;
    }
}

NotesShowPattern.prototype._IS_DEBUG = IS_DEBUG;
NotesShowPattern.prototype._SIZE = 12;

NotesShowPattern.prototype.set = function(i, value)
{
    i = Math.abs(i) % this._SIZE;
    if (!isNaN(i))
    { 
        this._arr[i] = !!value;
    }
    return this;
}

NotesShowPattern.prototype.get = function(i)
{
    i = Math.abs(i) % this._SIZE;
    return this._arr[i];
}

NotesShowPattern.prototype.getArr = function()
{
    return this._arr.slice();
}

NotesShowPattern.prototype.toInt = function()
{
    var numberArr = this._arr.map(function(item) {return +item});
    return parseInt(numberArr.join(''), 2);
}

NotesShowPattern.prototype.fromInt = function(number)
{
    number = Math.abs(number);
    if (isNaN(number))
    {
        if (this._IS_DEBUG)
        {
            console.error("Invalid number");
        }
        return this;
    }
    var binArr = number.toString(2).split('');
    if (binArr.length < this._SIZE)
    {
        var lengthDiff = this._SIZE - binArr.length;
        for (var i = 0; i < lengthDiff; i++)
        {
            binArr.unshift("0");
        }
    } else
    {
        binArr =  binArr.slice(binArr.length - this._SIZE);
    }
    this._arr = binArr.map(function(item) {return !!+item});
    return this;
}

NotesShowPattern.prototype.serialize = NotesShowPattern.prototype.toInt;

NotesShowPattern.prototype.deserialize = NotesShowPattern.prototype.fromInt;

NotesShowPattern.prototype.toJSON = NotesShowPattern.prototype.serialize;
