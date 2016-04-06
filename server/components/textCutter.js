module.exports = function(text) {
    var maxLength = 100; //words
    var words = text.split(" ");

    if(words.length > maxLength) {
        return (words.splice(0, maxLength).join(" ") + "..");
    }

    return text;
};