# notion-quick-action

NotionQuickAction.workflow はNotion のタスクデータベースのページとカレンダーイベントを同時に登録してくれる macOS サービスです。

## インストール方法

- 以下のリンクから NotionQuickAction.workflow をダウンロードします。
[https://github.com/hkob/notion-quick-action/releases/download/1.0/NotionQuickAction.workflow.zip]

- zip ファイルのままの場合には展開します。
- workflow を実行します。
- 以下のような画面が出るので、インストールをクリックします。

![Install](QuickActionInstaller-J.png)

- `NotionQuickAction` がキーボードのショートカットに現れます。チェックをつけた上で、自分の好きなショートカットを割り当ててください。ここでは、`option` + `command` + N を設定しています。

![Install](Service-J.png)

- ターミナルを立ち上げます。
- 以下のコマンドをタイプして、NotionQuickAction.workflow を開きます。

```sh
open $HOME/Library/Services/NotionQuickAction.workflow
```

- Automator が開き、以下のような画面になります。上の `Run Javascript` の部分に JXA code (JavaScript 版の AppleScript) が表示されています。

![Install](Automator-J.png)

- 先頭部分に以下の 8 つの設定項目が変数で定義されています。自分のものに合わせて中身を修正してください。なお、NOTION_API_TOKEN や DATABASE_ID についてわからない人は、下の NOTION API の設定を先に実施してから、値を設定してください。

```Javascript
// ########## Personal settings ##########
// Notion API Token を設定します (`secret_` で始まる文字列です)。
const NOTION_API_TOKEN = "secret_XXXXXXXXXXXX"
// 登録するタスクデータベースの ID を設定します (32桁の16進数です)。
const DATABASE_ID = "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY"
// タスクデータベースのタイトルプロパティの名前を設定します。
const TASK_NAME = "タスク名"
// タスクデータベースの日付プロパティの名前を設定します。
const TASK_DATE = "日付"
// タイムゾーンを設定します (https://www.iana.org/time-zones を見てください。日本の人はこのままでいいです)。
const TIME_ZONE = "Asia/Tokyo"
// Notion タスクと同時にカレンダーにイベントを登録したい人は true にしてください。したくない人は false にします。
const ADD_CALENDAR = true
// 登録するカレンダーの名前を設定します。
const NOTION_CALENDAR = "Notion"
// 登録後にページが開きます。Notion.app で開きたい人は true にしてください。false にするとデフォルトブラウザで開きます。
const OPEN_BY_APP = true
```

## Notion API の設定

初めての人のために、Notion API の設定方法も説明しておきます。

- 最初に Notion の設定を開き、インテグレーションタブを開きます。
![インテグレーション画面](Integration-J.png)

- 次に「独自のインテグレーションを開始する」をクリックします。以下のような画面になるので、「新しいインテグレーション」をクリックします。
![私のインテグレーション](myIntegration-J.png)

- 上の部分の名前、画像は好きなものを設定してください。ワークスペースは自動的に設定されているはずです。複数のワークスペースを持っている人は利用するワークスペースを選択してください。
![新しいインテグレーション](newIntegration0-J.png)

- コンテンツ機能は今回すべてチェックします。ユーザに関する情報は必要ないので、ユーザー情報なしでよいです。
![新しいインテグレーション](newIntegration1-J.png)

- 送信をクリックすると画面が変わり、上にシークレットが表示されます。「表示」をクリックすると `secret_` で始まる文字列が表示されます。右にあるコピーをクリックするとクリップボードにコピーされるので、NotionQuickAction の NOTION_API_TOKEN の部分に貼り付けてください。
![シークレット](secret-J.png)

## インテグレーションの許可

次に登録するデータベースを開きます。リンクドデータベースがある場合には、`右上矢印 + データベース名` の部分をクリックすればデータベースのページが単体で開きます。インラインのデータベースの場合には、`...` から「ページとして開く」をクリックして開きます。
![ページとして開く](openAsPage-J.png)

このデータベースを API からアクセスできるように、右上の`共有`で開くダイアログにて先ほど作成したインテグレーションを招待します。
追加ができるように編集権限を与えてください。

![abc](ShareForIntegration-J.png)

## 使い方

![movie](NotionQuickAction.gif)
- [ブログでの解説](https://hkob.hatenablog.com/entry/2022/01/08/130000)
