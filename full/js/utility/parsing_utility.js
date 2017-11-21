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

    semiTonesPatternBoolToInt: function(field, value) 
    {
        if (ParsingUt.isCorrectStringsNumber(value))
        {
            for (var i = 0; i < value.length; i++)
            {
                value[i] = value[i] ? 1 : 0;
            }
        }    
        return value;
    },
    
    semiTonesPatternIntToBool: function(field, value)
    { 
        var isArray = (typeof value === "object") && (Array.isArray(value));
        if (!isArray)
        {
            return value;
        }
        var isEveryElementIntType = value.every(function(arrElement) {return Number.isInteger(arrElement)});
        if (!isEveryElementIntType)
        {
            return value;
        }
        var isCorrectLength = (value.length == 12);
        if (isArray && isEveryElementIntType && isCorrectLength)
        {
            for (var i = 0; i < value.length; i++)
            {
                value[i] = value[i] !== 0;
            }
        }
        return value;
    }
}
