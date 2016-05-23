module.exports = function(text) {
    var maxLength = 500; //words
    var words = text && text.split(" ");

    if(words && words.length > maxLength) {
        return (words.splice(0, maxLength).join(" ") + "..");
    }

    return text || "";
};