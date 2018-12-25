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
function BitArr(size)
{
    if (!(size > 0))
    {
        size = this._DEFAULT_SIZE;
    }
    this._arr = new Array(size);
    for (var i = 0; i < this._arr.length; i++)
    {
        this._arr[i] = true;
    }
}

BitArr.prototype._IS_DEBUG = IS_DEBUG;
BitArr.prototype._DEFAULT_SIZE = 12;

BitArr.prototype.set = function(i, value)
{
    i = Math.abs(i) % this._arr.length;
    if (!isNaN(i))
    { 
        this._arr[i] = !!value;
    }
    return this;
}

BitArr.prototype.get = function(i)
{
    i = Math.abs(i) % this._arr.length;
    return this._arr[i];
}

BitArr.prototype.getArr = function()
{
    return this._arr.slice();
}

BitArr.prototype.getBinArr = function()
{
    return this._arr.map(function(item) {return +item});
}

BitArr.prototype.toInt = function()
{
    var numberArr = this.getBinArr();
    return parseInt(numberArr.join(''), 2);
}

BitArr.prototype.fromInt = function(number)
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
    if (binArr.length < this._arr.length)
    {
        var lengthDiff = this._arr.length - binArr.length;
        for (var i = 0; i < lengthDiff; i++)
        {
            binArr.unshift("0");
        }
    } else
    {
        binArr =  binArr.slice(binArr.length - this._arr.length);
    }
    this._arr = binArr.map(function(item) {return !!+item});
    return this;
}

BitArr.prototype.serialize = BitArr.prototype.toInt;

BitArr.prototype.deserialize = function(number)
{
    if (number !== undefined)
    {
        this.fromInt(number);
    }
    return this;
};

BitArr.prototype.toJSON = BitArr.prototype.serialize;

BitArr.prototype.toString = function()
{
    var binArr = this.getBinArr()
    return binArr.join('')
}

BitArr.prototype.valueOf = BitArr.prototype.toInt;
