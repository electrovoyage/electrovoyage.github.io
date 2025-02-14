const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24

function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

function onloaded() {
    const date = new Date(Date.now())
    //console.log(Date.prototype.getDay())
    
    const script_status_label = document.querySelector('.script-status')
    const script_date_label = document.querySelector('.script-date')

    console.log(date.getFullYear(), date.getMonth())

    year = date.getFullYear()

    shouldbreak = false

    currentmonth = date.getMonth()
    /*for (month = currentmonth; month <= 11; month++) {
        for (day = month == currentmonth ? date.getDate() : 13; day < getDaysInMonth(year, month); day++) {
            dy = new Date(year, month, day).getDay()
            shouldbreak = dy == 5 && day == 13
            if (shouldbreak) {break}
        }
        if (shouldbreak) {break}
    }*/
    
    msnow = Date.now()

    for (time = msnow; time <= msnow + 366 * MILLISECONDS_IN_A_DAY; time += MILLISECONDS_IN_A_DAY) {
        dt = new Date(time)

        month = dt.getMonth()
        year = dt.getFullYear()

        shouldbreak = dt.getDay() == 5 && dt.getDate() == 13
        if (shouldbreak) {break}
    }

    if (!shouldbreak) {
        //throw new Error('failed to find next Friday the 13th')
        script_status_label.innerHTML = "Failed to find next Friday the 13th!"
        script_date_label.innerHTML = "electrovoyage's code might be crappy. Please report this!"
        return
    }

    //console.log(year, month, day)
    //str = `<h1>The next Friday the 13<sub>th</sub> is on...</h1>\n<h2>`

    script_date_label.innerHTML = `${MONTHS[month]} of ${year}`
}

MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]

function postfix(day) {
    lastdigit = day % 10
    if (day < 20|| lastdigit > 3) {
        return 'th'
    } else {
        return ['st', 'nd', 'rd'][lastdigit - 1]
    }
}

window.onload = onloaded