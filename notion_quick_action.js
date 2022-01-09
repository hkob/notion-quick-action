// ########## Personal settings ##########
// Set your Notion API Token (strings that starts with `secret_`)
const NOTION_API_TOKEN = "secret_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
// Set your database ID (32-digits hex number)
const DATABASE_ID = "YYYYYYYYYYYYYYYYYYYYYYYYYy"
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

// show a dialog to register dateTimeStr
function dialogText(app, input) {
  const message = "Input date and time:  (format) [[YYYY/]MM/DD [HH:MM [HH:MM]]]\n" +
    "Example: (no input) -> unsettled\n" +
    "\t 4/25 -> 25th, April\n" +
    "\t 4/25 10:00 -> 25th, April 10:00 - 10:00\n" +
    "\t 4/25 9:00 12:00 -> 25th, April 9:00 - 12:00\n" +
    "for Message : \n" + input
  return app.displayDialog(message, {
    defaultAnswer: "",
    withIcon: "note",
    buttons: ["Cancel", "Continue"],
    defaultButton: "Continue"
  })
}

// parse dateTimeStr and return a date hash
function parseDateTime(dateTimeStr) {
  const app = Application.currentApplication()
  app.includeStandardAdditions = true

  var endTimeStr = null
  var startTimeStr = null

  let words = dateTimeStr.split(" ")
  var timeStr = words.slice(-1)[0]
  if (timeStr && timeStr.match("[0-9]+:[0-9]+")) {
    endTimeStr = words.pop()
  }
  if (endTimeStr) {
    timeStr = words.slice(-1)[0]
    if (timeStr && timeStr.match("[0-9]+:[0-9]+")) {
      startTimeStr = words.pop()
    } else {
      startTimeStr = endTimeStr
      endTimeStr = null
    }
  }
  var dateStr = words.slice(-1)[0]
  if (dateStr) {
    if (dateStr.match("^[0-9]+/[0-9]+$")) {
      dateStr = new Date().getFullYear() + "/" + words.pop()
    } else if (dateStr.match("^[0-9]+/[0-9]+/[0-9]+$")) {
      dateStr = words.pop()
    } else {
      dateStr = null
    }
  }
  if (dateStr == null && startTimeStr != null) {
    const timeNow = new Date()
    dateStr = timeNow.getFullYear() + "/" + (timeNow.getMonth() + 1) + "/" + timeNow.getDate()
  }

  if (startTimeStr) {
    const startTime = new Date(dateStr + " " + startTimeStr)
    var endTime
    if (endTimeStr) {
      endTime = new Date(dateStr + " " + endTimeStr)
    } else {
      endTime = new Date(dateStr + " " + startTimeStr)
      endTime.setHours(endTime.getHours() + 1)
    }
    return {startTime: startTime, endTime: endTime}
  } else if (dateStr) {
    return {date: new Date(dateStr)}
  } else {
    return {noDate: true}
  }
}

// Call Notion API
function sendNotion(app, url, payload, method) {
  const header = " --header 'Authorization: Bearer '" + NOTION_API_TOKEN + "'' "  +
    "--header 'Content-Type: application/json' " +
    "--header 'Notion-Version: 2021-08-16' " +
    "--data '"
  const script = "curl -X " + method + " " + url + header + JSON.stringify(payload) + "'"
  return JSON.parse(app.doShellScript(script))
}

// create a page
function createPage(app, payload) {
  return sendNotion(app, "https://api.notion.com/v1/pages", payload, "POST")
}

// return an ISO 8601 format for date and time
function dateTime2str(dt) {
  return dt.toLocaleTimeString([], {year: "numeric", month: "2-digit",  day: "2-digit", hour: "2-digit", minute: "2-digit"}).replaceAll("/", "-")
}

// return an ISO 8601 format for date
function date2str(dt) {
  return dt.toLocaleDateString([], {year: "numeric", month: "2-digit",  day: "2-digit"}).replaceAll("/", "-")
}

// return a dateTimeHash for notion API
function notionDateHash(hash) {
  if (hash.startTime) {
    return {
      start: dateTime2str(hash["startTime"]),
      end: dateTime2str(hash["endTime"]),
      time_zone: TIME_ZONE
    }
  } else if (hash["date"]) {
    return {
      start: date2str(hash["date"])
    }
  } else {
    return {
      start: "",
      end: ""
    }
  }
}

// return a payload to add a Notion page
function createPayload(title, date_hash) {
  return {
    parent: {
      database_id: DATABASE_ID,
    },
    properties: {
      [TASK_NAME]: {
        title: [
          {
            text: {
              content: title
            }
          }
        ]
      },
      [TASK_DATE]: {
        type: "date",
        date: date_hash
      },
    }
  }
}

ObjC.import("stdlib");

// add a calendar event for a new task
function createCalendar(task_id, title, dateTimeHash) {
  let Calendar = Application("Calendar")

  let notionCal = Calendar.calendars[NOTION_CALENDAR]
  var event = { summary: title }
  if (task_id != "") {
    event.description = "id:" + task_id
    // If you want to set task_id only in the description field, please change like as follows.
    // event.description = task_id
  }
  if (dateTimeHash.startTime) {
    // with time
    event.startDate = dateTimeHash.startTime
    event.endDate = dateTimeHash.endTime
    let newEvent = Calendar.Event(event)
    notionCal.events.push(newEvent)
  } else {
    // without time
    event.startDate = dateTimeHash.date
    event.endDate = dateTimeHash.date
    event.alldayEvent = true
    let newEvent = Calendar.Event(event)
    notionCal.events.push(newEvent)
  }
}

function run(input, parameters) {
  const app = Application.currentApplication()
  app.includeStandardAdditions = true

  if (input.length > 0) {
    const response = dialogText(app, input)
    if (response.buttonReturned == "Continue") {
      const parsedTime = parseDateTime(response.textReturned)
      // Create Notion Task
      const payload = createPayload(String(input), notionDateHash(parsedTime))
      const taskCreateResult = createPage(app, payload)
      // If ADD_CALENDER is true and the generated task has date, a calendar event is also added.
      const task_id = taskCreateResult.id
      if (ADD_CALENDAR && !parsedTime.noDate) {
        createCalendar(task_id, input, parsedTime)
      }
      const tmp_url = taskCreateResult.url
      var url
      if (OPEN_BY_APP == true) {
        url = tmp_url.replace("https", "notion")
        let notion = Application("Notion")
        notion.activate()
      } else {
        url = tmp_url
      }
    }
    return url
  } else {
    return false
  }
}
