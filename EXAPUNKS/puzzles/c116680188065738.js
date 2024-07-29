// For the latest Axiom VirtualNetwork+ scripting documentation, 
// please visit: http://www.zachtronics.com/virtualnetwork/

function getTitle() {
    return "MITSUZEN U102-L";
}

function getSubtitle() {
    return "LOGGING SERVER";
}

function getDescription() {
    return "File 100 ends with two host IDs of two logging drives. Entering either one of them into *#AUTH* will unlock a link to the host with that hostname. Only one of the hosts, unlockable with this method, will have a file with the ID 200. That file will end with an eight-digit code.\nRetrieve that code and save it to a file in your host.";
}

function randomFileJunk() {
    return randomChoice([randomInt(-9999, 9999), randomChoice(['true', 'false']), randomName(), randomAddress()])
}

function initializeTestRun(testRun) {
    log1key = randomInt(1000000, 9999999)
    log2key = randomInt(1000000, 9999999)

    keyA = 'LOG1' + log1key
    keyB = 'LOG2' + log2key

    controllerHost = createHost("controller", 5, 0, 2, 3);
    trashhost = createHost('trash', 5, -4, 1, 2)
    createLink(controllerHost, 799, trashhost, -1)

    access_register = createRegister(controllerHost, 6, 1, 'AUTH')

    trash = []
    for (i = 0; i < 25; i++) {
        trash.push(randomFileJunk())
    }

    trash.push(keyA, keyB)

    createLockedFile(trashhost, 100, FILE_ICON_DATA, trash)

    loghost1 = createHost(keyA, 9, 2, 3, 3)
    loghost2 = createHost(keyB, 9, -2, 3, 3)
    loglink1 = createLink(controllerHost, LINK_ID_NONE, loghost1, LINK_ID_NONE)
    loglink2 = createLink(controllerHost, LINK_ID_NONE, loghost2, LINK_ID_NONE)

    setRegisterWriteCallback(access_register, OnCodeEntered)

    needed_file_host = randomChoice([loghost1, loghost2])

    // generate useless files
    for (file = 1; file < randomInt(2, 8 - (needed_file_host == loghost1 ? 1 : 0)); file++) {
        file_contents = []
        for (i = 0; i < 25; i++) {
            file_contents.push(randomFileJunk())
        }
        setFileInitiallyCollapsed(createLockedFile(loghost1, 201 + file, FILE_ICON_DATA, file_contents))
    }

    for (file = 1; file < randomInt(2, 8 - (needed_file_host == loghost2 ? 1 : 0)); file++) {
        file_contents = []
        for (i = 0; i < 25; i++) {
            file_contents.push(randomFileJunk())
        }
        setFileInitiallyCollapsed(createLockedFile(loghost2, 201 + file, FILE_ICON_DATA, file_contents))
    }

    file_contents = []
    for (i = 0; i < 25; i++) {
        file_contents.push(randomFileJunk())
    }

    code = []
    for (i = 0; i < 8; i++) {
        code.push(randomInt(0, 9))
    }

    //file_contents.push(...code)
    for (i = 0; i < code.length; i++) {
        file_contents.push(code[i])
    }

    createLockedFile(needed_file_host, 200, FILE_ICON_DATA, file_contents)

    requireCreateFile(getPlayerHost(), code, 'Copy the code.')
}

function OnCodeEntered(value) {
    modifyLink(loglink1, LINK_ID_NONE, LINK_ID_NONE)
    modifyLink(loglink2, LINK_ID_NONE, LINK_ID_NONE)

    if (value == keyA) {
        modifyLink(loglink1, 800, -1)
    } else if (value == keyB) {
        modifyLink(loglink2, 800, -1)
    }
}

function onCycleFinished() {
}
