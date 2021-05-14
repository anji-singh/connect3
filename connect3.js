let num = 24
let row = 5
let chance = true
let draw = false
let chances = 3
let connect3Matrix = [...Array(num).keys()]
    .map(k => k + 2)
    .reduce((acc, k) => {
        if (k % row == 0) {
            acc.push({ pos: [acc[0].pos[0], row], marked: false, markedBy: '' })
        } else if (k % row == 1) {
            acc[0].pos[0]++
            acc.push({ pos: [acc[0].pos[0], k % row], marked: false, markedBy: '' })
        } else {
            acc.push({ pos: [acc[0].pos[0], k % row], marked: false, markedBy: '' })
        }
        return acc
    }, [{ pos: [1, 1], marked: false, markedBy: '' }])
connect3Matrix[0].pos[0] = 1
let connect3Art = connect3Matrix.map(() => "O")
connect3Formatter(connect3Art)
console.log(`chose any column 1-${row}`)
console.log("you will be (#) and other player will be ($)\n1st chance will given to you.")
let win = false
const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})
rl.on('line', input => {
    input = Number(input)
    if (!input || Number.isNaN(input) || input > row) {
        console.log("are you stupid?")
    } else {
        connect3Matrix = handleConnect3Matrix(input, connect3Matrix)
        connect3Art = connect3Matrix.map(o => o.marked ? o.markedBy : "O")
        connect3Formatter(connect3Art)
        if (connect3Art.filter(art => art == "O").length < num - 3) {
            win = handleWin(connect3Matrix)
        }
        chance = !chance
        if (win) {
            if (!draw) {
                console.log(!chance ? "You win" : "Other Player win")
            }
            rl.close();
            return
        }
        console.log(chance ? "Your chance" : "Other Player chance")
    }
})
function connect3Formatter(arr) {
    let length = arr.length, str = ''
    for (let i = 1; i <= length; i++) {
        str += "|"
        if (i % row == 0) {
            str += "_" + arr[i - 1] + "_|"
            str += "\n"
        } else {
            str += "_" + arr[i - 1] + "_"
        }
    }
    console.log(str)
}
function handleConnect3Matrix(input, arr) {
    let tempRow = row, found = false, index = 0
    while (!found) {
        if (arr[index].pos[0] == tempRow && arr[index].pos[1] == input && !arr[index].marked) {
            arr[index].marked = true
            arr[index].markedBy = chance ? "#" : "$"
            found = true
        }
        index++
        if (index > arr.length - 1) {
            index = 0
            tempRow--
        }
        if (tempRow < 0) {
            console.log("choose other column")
            break;
        }
    }
    return arr
}
function handleWin(arr) {
    let charCheck = chance ? "#" : "$"
    let tempChances = chances - 1, win = false
    arr = arr
        .filter(o => o.markedBy == charCheck)
    let arr1 = [...arr].sort((a, b) => b.pos[0] - a.pos[0])
    let arr2 = [...arr].sort((a, b) => b.pos[1] - a.pos[1])
    console.log(arr1)
    if (!win) {
        for (let i = 0; i < arr1.length - 1; i++) {
            if (arr1[i + 1].pos[0] == arr1[i].pos[0] && Math.abs(arr1[i + 1].pos[1] - arr1[i].pos[1]) == 1) {
                tempChances--
            } else if (tempChances < chances - 1 && tempChances > 0) {
                tempChances = chances - 1
            }
            if (tempChances == 0) {
                win = true
                console.log("1")
                break
            }
        }
    }
    if (!win) {
        tempChances = chances - 1
        for (let i = 0; i < arr2.length - 1; i++) {
            if (arr2[i + 1].pos[1] == arr2[i].pos[1] && Math.abs(arr2[i + 1].pos[0] - arr2[i].pos[0]) == 1) {
                tempChances--
            } else if (tempChances < chances - 1 && tempChances > 0) {
                tempChances = chances - 1
            }
            if (tempChances == 0) {
                win = true
                console.log("2")
                break
            }
        }
    }
    if (!win) {
        tempChances = chances - 1
        let commonFound = false, jIndex = 1, index = 0, kIndex = 0, predictPos = [0, 0]
        while (!commonFound) {
            let a = arr1[index].pos[0]
            let b = arr1[index].pos[1]
            let c = arr1[jIndex].pos[0]
            let d = arr1[jIndex].pos[1]
            if (Math.abs(a - c) == 1 && Math.abs(b - d) == 1) {
                if ((predictPos[0] != c || predictPos[1] != d) && tempChances < 2) {
                    kIndex++
                    index = kIndex
                    jIndex = kIndex
                    tempChances = chances - 1
                    // console.log("run in predict", tempChances)
                } else {
                    predictPos[0] = c - 1
                    predictPos[1] = b - d < 0 ? d + 1 : d - 1
                    tempChances--
                    index = jIndex
                }
                // console.log(a, b, c, d)
                // console.log("run in subtract check", tempChances, predictPos)
            }
            jIndex++
            if (tempChances == 0) {
                win = true
                console.log("3.1")
                break
            }
            if (jIndex > arr1.length - 1) {
                jIndex = index
                index++
                tempChances = chances - 1
                // console.log("run in jindex", tempChances)
            }
            if (index > arr.length - 1) {
                if ((chance && arr.length >= num / 2 + 1) || (!chance && arr.length >= num / 2)) {
                    console.log("Draw")
                    draw = true
                    win = true
                }
                console.log("3")
                break;
            }
        }
    }
    return win
}

// console.log(
//     handleWin([
//         { pos: [5, 1], marked: true, markedBy: '$' },
//         { pos: [5, 3], marked: true, markedBy: '$' },
//         { pos: [4, 2], marked: true, markedBy: '$' },
//         { pos: [3, 2], marked: true, markedBy: '$' },
//         { pos: [3, 3], marked: true, markedBy: '$' }
//     ])
// )