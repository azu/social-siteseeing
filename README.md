# What's this?

はてなブックマークやTwitterのコメントなどを見られるFirefoxアドオン.

SBM Counterやはてなブックマークのコメントビューアー部分のような感じ。

## How to use

![img](http://monosnap.com/image/NKZFRN6MStFMPwMk0UIkWKpkelfzPi.png)

---

TopsyのAPIを使ったTwitter/Google+のコメント取得も実装してありますが、有料APIじゃないと使いものにならないので削除してます…

Twitterのコメントを取得するのに [Topsy's Otter API](http://code.google.com/p/otterapi/ "Topsy's Otter API") を利用しています。

無料版のAPIには取得回数制限があるため、各自ユーザーが [API keys » Your API keys](http://manage.topsy.com/app "API keys » Your API keys") で、
アカウントを作成してAPI Keyを取得し、アドオンの設定画面にてAPI Keyを設定する必要があります。

<img src="http://monosnap.com/image/QaNczM6nL8XmqvcjUqg23bxdZ.png">

## Add-on SDK

[Add-on SDK](https://dev.mozilla.jp/addon-sdk-docs/ "Add-on SDK") を使って書かれています

## ライセンス

MIT