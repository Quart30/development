/**
 * API GET request after "Add to Slack" button is pressed
 *
 * Sample json in response:
 * {
 *   "ok":true,
 *   "access_token":"xoxp-23623886482-23625251793-24299768672-161a3ec268",
 *   "scope":"identify,incoming-webhook,commands,bot",
 *   "team_name":"quart30_cse112","team_id":"T0PJBS2E6",
 *   "incoming_webhook":
 *   {
 *       "channel":"#general",
 *       "channel_id":"C0PJ60W0L",
 *       "configuration_url":"https:\/\/quart30.slack.com\/services\/B0Q8R9UDR",
 *       "url":"https:\/\/hooks.slack.com\/services\/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"
 *   },
 *   "bot":
 *   {
 *       "bot_user_id":"U0Q8UFJNS",
 *       "bot_access_token":
 *       "xoxb-24300528774-XqsHsqbsaeHUSx0j9OGx3Q8j"
 *   }
 * }
 */
exports.get = function(req, res) {
    var params = req.query;
    var code = params.code;
    var client_id = '23623886482.24011540304';
    var client_secret = '06d85b7b64226c47238bd06fe61fc75c';

    // pretty gross way of getting the slack integration
    var url = 'https://slack.com/api/oauth.access?client_id=' + client_id + '&client_secret=' + client_secret + '&code=' + code;

    var request = require('request');
    request.post(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // get the necessary data by parsing the body
            // likely add it to the database so we can correctly send messages
            var slack_url;
            JSON.parse(body, function(k, v) {
                if (k == 'url')
                    slack_url = v;
            });

            var businesses = req.db.get('businesses');
            var bid = req.user[0].business;

            businesses.findAndModify({
                    query: { _id: bid },
                    update: { $set: {slack: slack_url} }
                },
                function (err, result) {
                    if (err) {
                        throw(err);
                    }
                }
            );
        } else {
            console.log(response.statusCode.toString() + ': ' + error);
        }
    });

    res.redirect('businesssetting/'); // redirect after processing data
};
