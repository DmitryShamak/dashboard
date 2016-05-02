angular.module("app")
    .filter('translate', function(translations) {
        return function(input, lang) {
            var translation = translations[lang] ? translations[lang][input] : translations[translations.defaultLanguage][input];
            return (translation || "["+input+"]");
        };
    });