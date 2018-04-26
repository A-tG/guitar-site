var ParsingUt = {
    isCorrectStringsNumber: function(number)
    {
        return (Number.isInteger(number)) && ((+number) >= MIN_STRINGS_NUMBER) && ((+number) <= MAX_STRINGS_NUMBER);
    },
    
    isCorrectNotesShowPattern: function(notesShowPattern)
    {
        var isArray = (typeof notesShowPattern === "object") && (Array.isArray(notesShowPattern));
        if (!isArray)
        {
            return false;
        }
        var isEveryElementBoolType = notesShowPattern.every(function(arrElement) {return (typeof arrElement === "boolean")});
        if (!isEveryElementBoolType)
        {
            return false;
        }
        var isCorrectLength = (notesShowPattern.length == 12);
        return (isArray && isEveryElementBoolType && isCorrectLength);
    },
    
    isCorrectBoxFret: function(fretNumber)
    {
        return (Number.isInteger(fretNumber)) && (fretNumber >= -1) && (fretNumber <= FRETS_NUMBER);
    },

    arrToBoolArr: function(item, i, arr)
    {
        return !!+item;
    },

    boolArrToNumberArr: function(item, i, arr)
    {
        return +item;
    },

    boolArrToNumber: function(arr)
    {
        var numberArr = arr.map(ParsingUt.boolArrToNumberArr);
        return parseInt(numberArr.join(''), 2);
    },

    numberToBoolArr: function(number, minSize)
    {
        var binArr = number.toString(2).split('');
        if (binArr.length < minSize)
        {
            var lengthDiff = minSize - binArr.length;
            for (var i = 0; i < lengthDiff; i++)
            {
                binArr.unshift(0);
            }
        }
        return binArr.map(ParsingUt.arrToBoolArr);
    }
}
