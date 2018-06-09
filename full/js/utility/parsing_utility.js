var ParsingUt = {
    isCorrectStringsNumber: function(number)
    {
        return (Number.isInteger(number)) && ((+number) >= MIN_STRINGS_NUMBER) && ((+number) <= MAX_STRINGS_NUMBER);
    },

    validateStringsNumber: function(stringsNumber)
    {
        return ParsingUt.isCorrectStringsNumber(stringsNumber)? stringsNumber: 6;
    },
    
    isCorrectBoxFret: function(fretNumber)
    {
        return (Number.isInteger(fretNumber)) && (fretNumber >= -1) && (fretNumber <= FRETS_NUMBER);
    },

    validateBoxFret: function(fretNumber)
    {
        return ParsingUt.isCorrectBoxFret(fretNumber)? fretNumber: -1;
    }
}
