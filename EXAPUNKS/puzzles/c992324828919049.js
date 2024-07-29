// For the latest Axiom VirtualNetwork+ scripting documentation, 
// please visit: http://www.zachtronics.com/virtualnetwork/

function getTitle() {
    return "SECURE STORAGE";
}

function getSubtitle() {
    return "MITSUZEN D100-H10";
}

function getDescription() {
    return "File 200 in your host contains a keyword. Brute-force the 3-digit pass-code, entering one digit at a time into *#PASS*. When done, find the required file by its keyword in file 201 and move it to your host. \nAfter the code is entered, the link to *DRIVE* becomes *801*, and the link back becomes *-1*.";
}

function initializeTestRun(testRun) {
    hubHost = createHost("HUB", 5, 1, 1, 1);

    keywords = ["USER", "TREE", "EXAFS", "DEF", "DEFUN", "FUNCTION", "FILE", "OBJECT", "KEYWORD", "PASSWORD", "LETMEIN", "12345678", "DATA", "NULL", "DEBUG"]
    needed_kwd = randomChoice(keywords)
    keywords.splice(keywords.indexOf(needed_kwd))

    keywd_file = createNormalFile(getPlayerHost(), 200, FILE_ICON_TEXT, [needed_kwd])

    input_host = createHost("INPUT", 5, 4, 1, 3)
    input_link = createLink(hubHost, 800, input_host, -1)

    input_reg = createRegister(input_host, 5, 6, "PASS")
    passcode = [0, 0, 0]
    needed_passcode = [randomInt(0, 9), randomInt(0, 9), randomInt(0, 9)]

    drive_host = createHost("DRIVE", 8, 0, 5, 5)
    drive_link = createLink(hubHost, LINK_ID_NONE, drive_host, LINK_ID_NONE)

    code_num_index = 0

    setRegisterWriteCallback(input_reg, function(value) {
        code_num_index++
        passcode[convertNumIndex(code_num_index)] = value
        if (passcode.join("") == needed_passcode.join("")) {
            modifyLink(drive_link, 801, -1)
        }
    })

    generated_files = []
    useless = []
    for (let i = 0; i < randomInt(3, 19); i++) {
        kwd = randomChoice(keywords)
        useless = createNormalFile(drive_host, 300 + i, FILE_ICON_DATA, makeFile(kwd, keywords))
        generated_files.push(kwd, 300 + i)
        needed_file_id = randomChoice([301 + i, 300 - 1])
        setFileInitiallyCollapsed(useless)
    }
    generated_files.push(needed_kwd, needed_file_id)

    needed_file = createNormalFile(drive_host, needed_file_id, FILE_ICON_DATA, makeNeededFile(needed_kwd))
    dir_file = createLockedFile(drive_host, 201, FILE_ICON_FOLDER, generated_files)
    setFileColumnCount(dir_file, 2)

    requireMoveFile(needed_file, getPlayerHost(), "Bring the required file to your host.")
}

function convertNumIndex(int) {
    return (int - 1) % 3
}

function makeFile(keyword, keywords) {
    arr = [keyword]
    keywords.splice(keywords.indexOf(keyword))
    for (let i = 0; i <= randomInt(10, 100); i++) {
        arr.push(randomInt(0, 255))
    }
    return arr
}

function makeNeededFile(keyword) {
    arr = [keyword]
    for (let i = 0; i <= randomInt(10, 100); i++) {
        arr.push(randomInt(0, 255))
    }
    return arr
}

function onCycleFinished() {
}
