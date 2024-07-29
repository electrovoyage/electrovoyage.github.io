// For the latest Axiom VirtualNetwork+ scripting documentation, 
// please visit: http://www.zachtronics.com/virtualnetwork/

function getTitle() {
    return "ARITHMETIC COPROCESSOR";
}

function getSubtitle() {
    return "UNKNOWN MICROPROCESSOR";
}

function getDescription() {
    return "*#CODE* sends opcodes that are either _+_, _-_, _/_ or an asterisk. Read values from *#VALA* and *#VALB* and perform the required operation. Operation symbols are available via the registers in the *CONSTANTS* host. For example, if *#CODE* is _/_, divide *#VALA* by *#VALB*.\nWhen done, find allocation *PUT-RESULT-HERE* (available in file 299) in file 300 and replace it with the result.";
}

function createConstant(host, x, y, name, value) {
    reg = createRegister(host, x, y, name)
    setRegisterReadCallback(reg, function() {
        return value
    })

    return reg
}

function initializeTestRun(testRun) {
    var coprocessor = createHost("COPROCESSOR", 5, 1, 5, 1);
    var ophost = createHost("OPCODE", 5, 4, 1, 2)
    var value_a = createHost("VALUE A", 7, 4, 1, 2)
    var value_b = createHost("VALUE B", 9, 4, 1, 2)
    createLink(coprocessor, 800, ophost, -1)
    createLink(coprocessor, 801, value_a, -1)
    createLink(coprocessor, 802, value_b, -1)

    var codereg = createRegister(ophost, 5, 5, "CODE")
    var vala_reg = createRegister(value_a, 7, 5, "VALA")
    var valb_reg = createRegister(value_b, 9, 5, "VALB")

    var constants = createHost("CONSTANTS", 5, -2, 5, 1)
    createLink(coprocessor, 803, constants, -1)

    var add_reg = createConstant(constants, 5, -2, "ADDS", "+")
    var sub_reg = createConstant(constants, 6, -2, "SUBS", "-")
    var mul_reg = createConstant(constants, 8, -2, "MULS", "*")
    var div_reg = createConstant(constants, 9, -2, "DIVS", "/")

    var memhost = createHost("MEMORY", 12, 0, 2, 3)
    createLink(coprocessor, 1, memhost, -1)

    var allocator = createHost("ALLOCATOR", 12, 5, 2, 1)
    createLink(memhost, 800, allocator, -1)

    needed_file_contents = makeProperMemoryFile()
    var alloc_file = createNormalFile(allocator, 299, FILE_ICON_TEXT, ["PUT-RESULT-HERE"])
    var neededfile = createLockedFile(memhost, 300, FILE_ICON_DATA, needed_file_contents)

    for (let i = 1; i <= 4; i++) {
        setFileInitiallyCollapsed(createLockedFile(memhost, 300 + i, FILE_ICON_DATA, makeMeaninglessFileContents()))
    }

    operand_a = randomInt(-999, 999)
    operand_b = randomInt(-999, 999)

    operation = randomChoice(["+", "-", "*", "/"])
    setRegisterReadCallback(codereg, function() {
        return operation
    })

    setRegisterReadCallback(vala_reg, function() {
        return operand_a
    })

    setRegisterReadCallback(valb_reg, function() {
        return operand_b
    })

    requireChangeFile(neededfile, getRequiredResultFileContents(), "Write equation result to memory.")
    requireDeleteFile(alloc_file, "Remove allocation file.")
}

function _solveEquation() {
    switch (operation) {
        case "+":
            return operand_a + operand_b
        case "-":
            return operand_a - operand_b
        case "/":
            return operand_a / operand_b
        case "*":
            return operand_a * operand_b
    }
}

function solveEquation() {
    return constrainToEXALimits(_solveEquation())
}

function onCycleFinished() {
}

function makeMeaninglessFileContents() {
    arr = []
    for (let i = 0; i <= randomInt(10, 1000); i++) {
        arr.push(randomInt(-9999, 9999))
    }
    return arr
}

function makeProperMemoryFile() {
    arr = makeMeaninglessFileContents()
    alloc_pos = randomInt(0, arr.length)
    arr[alloc_pos] = "PUT-RESULT-HERE"
    return arr
}

function getRequiredResultFileContents() {
    arr = needed_file_contents
    arr[arr.indexOf("PUT-RESULT-HERE")] = solveEquation()
    return arr
}

function constrainToEXALimits(int) {
    if (int > 9999) {return 9999}
    else if (int < -9999) {return -9999}
    else {return int}
}