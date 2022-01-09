# notion-quick-action

a macOS service to add a new notion task and a calendar event

## How to install

- Download workflow from here
[https://github.com/hkob/notion-quick-action/releases/download/1.0/NotionQuickAction.workflow.zip]

- Unpack the zip file
- Down click the workflow file
- Click Install in the following dialog

![Install](QuickActionInstaller-E.png)

- Enable `NotionQuickAction` and set a shortcut key.  In this figure, I set `option` + `command` + N.

![Install](Service-E.png)

- Open Terminal software.
- Open NotionQuickAction.workflow by the following terminal command.

```sh
open $HOME/Library/Services/NotionQuickAction.workflow
```

- We can see a JXA code in a `Run JavaScript` action.

![Install](Automator-E.png)

- Rewrite some values

The following 8 values must be adjust to your environment.
In you don't know about NOTION_API_TOKEN and DATABASE_ID,
please read the below Notion API setup.

```Javascript
// ########## Personal settings ##########
// Set your Notion API Token (strings that starts with `secret_`)
const NOTION_API_TOKEN = "secret_XXXXXXXXXXXX"
// Set your database ID (32-digits hex number)
const DATABASE_ID = "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY"
// Set the property name for Title of your task database
const TASK_NAME = "タスク名"
// Set the property name for Date of your task database
const TASK_DATE = "日付"
// time zone of your country (see https://www.iana.org/time-zones)
const TIME_ZONE = "Asia/Tokyo"
// If you want to settle a Calendar event of your task, set true.
const ADD_CALENDAR = true
// Set Calendar name for Notion tasks
const NOTION_CALENDAR = "Notion"
// If you want to open a new task by Notion.app, set true.  If you want to open it by your default browser, set false.
const OPEN_BY_APP = true
```

## Notion API setup

Next, set API setting. Please see Getting Started in the Notion Developer page. Please remind NOTION_API_TOKEN and database_id for the above database (DATABASE_ID), and invite your integration to the databases.

![abc](ShareForIntegration-E.png)

## How to use

- [movie (Twitter)](https://twitter.com/hkob/status/1479695927661461514?s=20)
- [blog in Japanese](https://hkob.hatenablog.com/entry/2022/01/08/130000)
