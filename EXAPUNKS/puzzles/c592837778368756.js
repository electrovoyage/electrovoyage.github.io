// For the latest Axiom VirtualNetwork+ scripting documentation, 
// please visit: http://www.zachtronics.com/virtualnetwork/

function range(start, end) {
    _range = []
    for (let i = start; i < end; i++) {
        _range.push(i)
    }

    return _range
}

function getUniqueArrayItem(array) {
    obj_ind = randomInt(0, array.length - 1)
    obj = array[obj_ind]
    array.splice(obj_ind)

    return [array, obj]
}

function makeDirectory(f) {
    fcontents = []
    for (var key in f) {
        if (f.hasOwnProperty(key)) {
            fcontents.push(f[key][0])
            fcontents.push(parseInt(key))
        }
    }

    return fcontents
}

function getTitle() {
    return "EXAFS FILE SYSTEM";
}

function getSubtitle() {
    return "SAWAYAMA EXALANCE";
}

function getDescription() {
    return "#FILE requests files. Find the filename read from #FILE in file 200 (host HUB) and copy (create new with same contents) the associated file to UPLOAD. When done, write any value to #DONE.\nNote that no number in any of the files in host *C:/* is -9999.";
}

function initializeTestRun(testRun) {
    var targetHost = createHost("HUB", 5, 0, 3, 3);
    var cdrive = createHost("C:/", 5, 5, 3, 3)
    var hubtoclink = createLink(targetHost, 800, cdrive, -1)

    var terminal = createHost("TERMINAL", 6, -4, 1, 2)
    var hubtoterminallink = createLink(targetHost, 801, terminal, -1)

    var upload = createHost("UPLOAD", 10, 0, 3, 3)
    var terminaltouploadlink = createLink(targetHost, 802, upload, -1)

    terminal_freq_register = createRegister(terminal, 6, -4, "FILE")
    possibleNames = [["README.txt", "server.php", "index.js", "backup.zip", "build.sh"], ["System Volume Information", "todo.txt"], ["explorer.exe", "winlogon", "cmd.exe", "regedit.exe"]]
    fnames = randomChoice(possibleNames)

    needed_file = randomChoice(fnames)
    setRegisterReadCallback(terminal_freq_register, function() {
        return needed_file
    })

    possible_fileids = range(150, 400)
    created_files = []
    files_dict = {}

    fnames.forEach(function(item, index, array) {
        file_ext = item.split('.')[1]
        type = file_ext == "txt" || file_ext == "php" || file_ext == "js" || file_ext == "sh"
        fdata = []
        for (let i = 0; i < randomInt(4, 1000); i++) {
            fdata.push(randomInt(-9998, 9999))
        }

        newFileID = removeAndReturnRandom(possible_fileids, created_files)
        created_files.push(newFileID)
        file = createLockedFile(cdrive, created_files.slice(-1)[0], type ? FILE_ICON_TEXT : FILE_ICON_DATA, fdata)
        files_dict[created_files.slice(-1)[0]] = [item, fdata, file]
        setFileInitiallyCollapsed(file)
    })

    directory = createLockedFile(targetHost, 200, FILE_ICON_FOLDER, makeDirectory(files_dict))
    setFileColumnCount(directory, 2)

    requireCreateFile(upload, getNeededFile(needed_file, files_dict), "Copy the required file to the UPLOAD host.")

    file_moved = createRegister(upload, 11, 1, "DONE")
    done_goal = requireCustomGoal("Mark the file transfer as done.")

    setRegisterWriteCallback(file_moved, function(value) {
        setCustomGoalCompleted(done_goal)
    })
    //setRegisterReadCallback(file_moved, function() {
    //    setCustomGoalCompleted(done_goal)
    //    return 0
    //})
}

function onCycleFinished() {
}

function getNeededFile(file, dict) {
    for (var key in dict) {
        if (dict.hasOwnProperty(key)) {
            if (dict[key][0] == file) {
                return dict[key][1]
            }
        }
    }
}

function makeNewFileID(usedIDs, _id) {
    let id = _id;
    while (contains(usedIDs, id)) {
        id = randomInt(150, 400)
    }
    return id
}

function contains(container, value) {
    container.forEach(function(item, index, array) {
        if (item === value) {
            return true
        }
    })

    return false
}
function getRandomFromArray(arr) {
  return arr[randomInt(0, arr.length - 1)];
}

function arrayContains(arr, value) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === value) {
        return true;
      }
    }
    return false;
  }

function removeAndReturnRandom(A, B) {
  let randomint = getRandomFromArray(A);
  while (arrayContains(B, randomint)) {
    randomint = getRandomFromArray(A);
  }
  A.splice(A.indexOf(randomint), 1);
  B.push(randomint)
  return randomint;
}