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
