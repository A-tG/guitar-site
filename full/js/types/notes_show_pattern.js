/*
 * Copyright 2018 Dmitriy Kurbatov
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * Dmitriy Kurbatov https://github.com/A-tG
*/
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

NotesShowPattern.prototype.getBinArr = function()
{
    return this._arr.map(function(item) {return +item});
}

NotesShowPattern.prototype.toInt = function()
{
    var numberArr = this.getBinArr();
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

NotesShowPattern.prototype.deserialize = function(number)
{
    if (number !== undefined)
    {
        this.fromInt(number);
    }
    return this;
};

NotesShowPattern.prototype.toJSON = NotesShowPattern.prototype.serialize;

NotesShowPattern.prototype.toString = function()
{
    var binArr = this.getBinArr()
    return binArr.join('')
}

NotesShowPattern.prototype.valueOf = NotesShowPattern.prototype.toInt;
