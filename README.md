# 食費入力bot
LINE botでテキストを送信すると以下が実行される
- 送信したテキストが数字か判定
  - 数字の場合：
    - GASでスプレッドシートへ入力
    - Zaimへ入力（非同期）
- LINE botで返信（非同期）
  - 送信したテキストが数字の場合：成功メッセージ
  - 送信したテキストが数字ではない場合：失敗メッセージ

### GASのデプロイを更新したら行うこと
1. ライブラリURLをコピー
2. LINE Developersからbotの「Messaging API設定」を開き、「Webhook URL」へ貼り付け
3. Zaim APIからアプリケーションを開き、「URL」へ貼り付け

### 定数
`LINE_TOKEN`：LINE Developersの「チャネルアクセストークン」  
`ZAIM_KEY`：Zaim APIの「コンシューマ ID」  
`ZAIM_SECRET`：Zaim APIの「コンシューマシークレット」  
`SHEET_ID`：スプレッドシートの「ID」  

### 参考
#### LINE bot → GAS  
- [いまさらGASでLineBotを作る【オウム返し】](https://tech-lab.sios.jp/archives/33512)
- [GAS・LINE連携でスプレッドシートに書き込む家計簿Botを作ろう！送信・メッセージ取得を学ぶ【ソースコードコピペOK】](https://feynman.co.jp/it-tool-takumi/line-gas-household-accounting/)
#### GAS → Zaim API
- [家計簿入力を自動化する](https://i-was-a-ki.hatenablog.com/entry/2020/03/01/143801)
