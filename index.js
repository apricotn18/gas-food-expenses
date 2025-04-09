var LINE_TOKEN = 'XXXXXX';
var LINE_URL = 'https://api.line.me/v2/bot/message/reply';
var ZAIM_KEY = 'XXXXXX';
var ZAIM_SECRET = 'XXXXXX';
var ZAIM_URL = 'https://api.zaim.net/v2/home/money/payment';
var SHEET_ID = 'XXXXXX';
var SHEET_NAME = '食費';

// 初回のみこの関数を選んで実行（Zaimの認証が必要）
function authorize() {
  var service = _getService();
  var authorizationUrl = service.authorize();
  console.log("次のURLを開いてZaimで認証したあと、再度スクリプトを実行してください。: %s", authorizationUrl);
}

function doPost(e) {
  var json = JSON.parse(e.postData.contents);
  var price = json.events[0].message.text;
  var isNumber = !!price.match(/^\d+$/);

  if (isNumber) {
    _writeToSheet(price, _getDate('/'));

    // Zaim書き込み
    var zaimService = _getService();
    var params = {
        mapping: 1,
        category_id: '101',
        genre_id: '10101',
        amount: price,
        date: _getDate('-'),
    };
    zaimService.fetch(ZAIM_URL + '?' + _toString(params), {
      method: 'post'
    });
  }

  // LINE返信
  UrlFetchApp.fetch(LINE_URL, {
    'headers': {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + LINE_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
        'replyToken': json.events[0].replyToken,
        'messages': [
          {
            'type': 'text',
            'text': isNumber ? '入力しました' : '数字のみ入力してください',
          }
        ]
    }),
  });
}

function _getDate(separator) {
  var today = new Date();
  return today.getFullYear() + separator + (today.getMonth() + 1) + separator + today.getDate();
}

function _writeToSheet(price, date) {
  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  var lastRow = sheet.getLastRow();
  sheet.getRange('A' + (lastRow + 1)).setValue(date);
  sheet.getRange('B' + (lastRow + 1)).setValue(price);
}

function _toString(params) {
  var query = [];
  for (var name in params) {
    var value = encodeURIComponent(params[name]);
    query.push(name + '=' + value);
  };
  return query.join('&');
}

function _getService() {
    return (
        OAuth1.createService('Zaim')
            // Set the endpoint URLs.
            .setAccessTokenUrl('https://api.zaim.net/v2/auth/access')
            .setRequestTokenUrl('https://api.zaim.net/v2/auth/request')
            .setAuthorizationUrl('https://auth.zaim.net/users/auth')

            // Set the consumer key and secret.
            .setConsumerKey(ZAIM_KEY)
            .setConsumerSecret(ZAIM_SECRET)

            // Set the name of the callback function in the script referenced
            // above that should be invoked to complete the OAuth flow.
            .setCallbackFunction('authCallback')

            // Set the property store where authorized tokens should be persisted.
            .setPropertyStore(PropertiesService.getUserProperties())
    );
}

function authCallback(request) {
    var service = _getService();
    var authorized = service.handleCallback(request);
    if (authorized) {
        return HtmlService.createHtmlOutput("認証できました！");
    } else {
        return HtmlService.createHtmlOutput("認証失敗");
    }
}
