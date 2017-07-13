// load the .env file
require('dotenv-extended').load()

var builder = require('botbuilder');
var restify = require('restify');

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log('%s is listening to %s', server.name, server.url)
});

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, (session) => {
    session.send('I am rubber, you are glue');
});

var recogniser = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
bot.recognizer(recogniser);
 
bot.dialog('/', [
    (session, args, next) => {
        res = builder.LuisRecognizer.recognize(session.message.text, process.env.LUIS_MODEL_URL, (err, intents, entities) => {
            console.log(intents);
        });
    }
]).triggerAction({
    matches: /\*/g
});
