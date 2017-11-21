function getSemiTonesPatternForString(scaleNotes, semiTones, stringTune)
{
    var pattern = [];
    var stringTuneOffset = 0;
    var stringTuneIndex = scaleNotes.indexOf(stringTune);
    while (stringTuneIndex < 0)
    {
        stringTune = Note.next(stringTune);
        stringTuneIndex = scaleNotes.indexOf(stringTune);
        stringTuneOffset++;
    }
    pattern.push(stringTuneOffset);
    for (var i = stringTuneIndex; i < semiTones.length; i++)
    {
        pattern.push(semiTones[i]);
    }
    for (var i = 0; i < stringTuneIndex; i++)
    {
        pattern.push(semiTones[i]);
    }
    return pattern;
}

function sliderLogVal(position, minVal, maxVal)
{
    var minPosition = 0;
    var maxPosition = 100;
    var value = 0;
    if (position > 0)
    {
        var minLogVal = Math.log(minVal);
        var maxLogVal = Math.log(maxVal);
        var scale = (maxLogVal - minLogVal) / (maxPosition - minPosition);
        value = Math.exp(minLogVal + scale * (position - minPosition));
    }
    return value;
}
