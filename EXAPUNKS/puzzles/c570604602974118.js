// For the latest Axiom VirtualNetwork+ scripting documentation, 
// please visit: http://www.zachtronics.com/virtualnetwork/

function getTitle() {
    return "RAILROAD NETWORK";
}

function getSubtitle() {
    return "UNKNOWN STATION";
}

function getDescription() {
    return "The *waiting* host contains multiple files. These files store information about people about to get on a train, formatted as _train ID_, _departure time (hour)_, _departure time (minute)_ and _the person's name_.\nOverwrite the time in the file, whose ID is specified in file *199*, with the current time.";
}

function initializeTestRun(testRun) {
    waiting = createHost("waiting", 5, -1, 3, 5);

    // generate arrivals
    newarrhost = waiting
    for (i = -4; i > 3 * -4; i = i - 3) {
        newarrhost_ = createHost(i, 6, i, 1, 1)
        createLink(newarrhost, LINK_ID_NONE, newarrhost_, 800)
        newarrhost = newarrhost_
    }

    // generate departures
    newdephost = waiting
    for (i = 6; i < 3 * 5; i = i + 3) {
        newdephost_ = createHost(i, 6, i, 1, 1)
        createLink(newdephost, 800, newdephost_, LINK_ID_NONE)
        newdephost = newdephost_
    }

    tickets = []

    for (i = 0; i < randomInt(2, 10); i++) {
        tickets.push(200 + i)
        setFileInitiallyCollapsed(createNormalFile(waiting, 200 + i, FILE_ICON_USER, [randomInt(100, 999), randomInt(0, 24), randomInt(0, 59), randomName()]))
    }
    
    requiredTicketNumber = tickets[tickets.length - 1] + 1
    createNormalFile(getPlayerHost(), 199, FILE_ICON_TEXT, [requiredTicketNumber])
    requiredTicketInfo = [requiredTicketNumber, randomInt(100, 999), randomInt(0, 23), randomInt(0, 59), randomName()]
    tickets.push(requiredTicketNumber)

    requiredTicket = createNormalFile(waiting, requiredTicketNumber, FILE_ICON_USER, requiredTicketInfo.slice(1))

    clockhours = randomInt(0, 23)
    clockminutes = randomInt(0, 59)

    //while (clockminutes == requiredTicketInfo[3]) {
    //    clockminutes = randomInt(0, 59)
    //}
//
    //while (clockhours == requiredTicketInfo[2]) {
    //    clockhours == randomInt(0, 23)
    //}

    for (att = 0; att < 1000; att++) {
        clockminutes = randomInt(0, 59)
        if (clockminutes != requiredTicketInfo[3]) {
            break
        }
    }

    for (att = 0; att < 1000; att++) {
        clockhours = randomInt(0, 23)
        if (clockhours != requiredTicketInfo[2]) {
            break
        }
    }

    clockhost = createHost("clock", 10, 2, 2, 2)
    createLink(waiting, 801, clockhost, -1)

    hour_reg = createRegister(clockhost, 10, 3, 'HOUR')
    minute_reg = createRegister(clockhost, 11, 3, 'MNTE')

    setRegisterReadCallback(hour_reg, function() {return clockhours})
    setRegisterReadCallback(minute_reg, function() {return clockminutes})

    // generate filler hosts
    hallway = createHost('hallway', 10, -1, 10000, 2)
    createLink(hallway, LINK_ID_NONE, waiting, LINK_ID_NONE)

    for (i = 1; i < 5; i++) {
        newcamreg = createRegister(hallway, 10 + ((i - 1) * 4), -1, 'CAM' + i)
        setRegisterReadCallback(newcamreg, function() {return 1})
    }

    cafe = createHost('cafe', 10, -5, 3, 2)
    createLink(hallway, LINK_ID_NONE, cafe, LINK_ID_NONE)

    setRegisterReadCallback(createRegister(cafe, 12, -4, 'LGHT'), function() {return 1})

    kitchen = createHost('kitchen', 10, -8, 3, 1)
    createLink(kitchen, LINK_ID_NONE, cafe, LINK_ID_NONE)

    setRegisterReadCallback(createRegister(kitchen, 12, -8, 'FRZR'), function() {return -17})
    setRegisterReadCallback(createRegister(kitchen, 10, -8, 'OVEN'), function() {return 230})

    ticketing = createHost('ticketing', 15, 3, 3, 2)
    createLink(hallway, LINK_ID_NONE, ticketing, LINK_ID_NONE)
    setFileInitiallyCollapsed(createLockedFile(ticketing, 100, FILE_ICON_DATA, tickets))

    atm = createHost('ATM', 15, -4, 3, 1)
    createLink(hallway, LINK_ID_NONE, atm, LINK_ID_NONE)

    cashamt = randomInt(100, 999)
    setRegisterReadCallback(createRegister(atm, 15, -4, 'CASH'), function() {return cashamt})
    createRegister(atm, 17, -4, 'DISP')

    editedTicket = requiredTicketInfo.slice(1)
    editedTicket[1] = clockhours
    editedTicket[2] = clockminutes
    requireChangeFile(requiredTicket, editedTicket, 'Change the time.')
}

function onCycleFinished() {
}