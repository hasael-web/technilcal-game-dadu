function diceGameDadu() {
    const buttonDisable = document.getElementById("button-start")
    buttonDisable.style.visibility = "hidden"
    const gameDiv = document.getElementById("game")
    const div1 = document.createElement('div')
    const div2 = document.createElement("div")
    gameDiv.append(div1)
    gameDiv.append(div2)

    // input untuk total pemain
    const inputTotalPemain = document.createElement("input")
    inputTotalPemain.type = "number"
    inputTotalPemain.name = "total-user"
    inputTotalPemain.placeholder = "total user"

    // input untuk total dadu
    const inputTotalDadu = document.createElement("input")
    inputTotalDadu.type = "number"
    inputTotalDadu.name = "total-dadu"
    inputTotalDadu.placeholder = "total dadu"
    // handle input change

    let totalPemain = 0
    let totalDadu = 0
    inputTotalPemain.addEventListener("change", (e) => {
        totalPemain = parseInt(e.target.value)
    })
    inputTotalDadu.addEventListener("change", (e) => {
        totalDadu = parseInt(e.target.value)
    })
    // submit new user
    const buttonSubmit = document.createElement("button")
    buttonSubmit.textContent = "submit"
    buttonSubmit.addEventListener("click", () => {

        if (totalDadu >= 2 && totalPemain >= 2) {
            createPlayerAndStartGame(totalPemain, totalDadu)
        } else {
            alert("total pemain dan total dadu tidak bisa lebih kecil dari 2")
        }
    })

    // append input 
    gameDiv.append(buttonSubmit)
    div1.append(inputTotalPemain)
    div2.append(inputTotalDadu)
}

function createPlayerAndStartGame(totalPemain, totalDadu) {

    if (!isNaN(totalPemain) && !isNaN(totalDadu) && totalPemain >= 2 && totalDadu >= 2) {
        const players = Array.from({ length: totalPemain }, (_, index) => new Player(index + 1, totalDadu));
        playGame(players);
    } else {
        alert("Total pemain dan total dadu harus lebih besar atau sama dengan 2");
    }
}

class Player {
    constructor(id, total_dice) {
        this.id = id;
        this.dice = [];
        this.score = 0;
        this.total_dice = total_dice
        this.remainingDice = this.dice.length
    }

    throwDice(numDice) {
        this.dice = Array.from({ length: numDice }, () => Math.floor(Math.random() * 6) + 1);
    }

    evaluateDice() {
        let i = 0;
        while (i < this.dice.length) {
            if (this.dice[i] === 6) {
                this.score += 1;
                this.dice.splice(i, 1);
            } else if (this.dice[i] === 1) {
                if (i > 0) {
                    [this.dice[i], this.dice[i - 1]] = [this.dice[i - 1], this.dice[i]]; // Swap positions
                    i--; // Perbarui indeks setelah pertukaran
                }
            }
            i++; // Pindah ke dadu berikutnya
        }
    }

    winner(players) {
        return players.reduce((winner, currentPlayer) => {
            return currentPlayer.score > winner.score ? currentPlayer : winner;
        }, players[0]);
    }

    hasDiceRemaining() {
        return this.dice.length > 0;
    }
}



function playGame(players) {
    let round = 1;
    let output = "";

    while (players.length > 1) {
        output += `====================
Rounde ${round} lempar dadu:\n`;

        players.forEach(player => {
            if (player.dice.length === 0) {

                player.throwDice(player.total_dice);
            }
            player.throwDice(player.dice.length);
            output += `          Pemain #${player.id} (${player.score}):${player.dice.join(',')}\n`;
        });

        players.forEach(player => {
            player.evaluateDice(); // if (!player.hasDiceRemaining()) {
            //     output += `          Pemain #${player.id} (${player.score}):_,(Berhenti bermain karena tidak memiliki dadu)\n`;
            //     players.splice(players.indexOf(player), 1);
            // }

            output += `Setelah evaluasi: \n   `
            if (player.hasDiceRemaining()) {
                output += ` Pemain #${player.id} (${player.score}):${player.dice.join(',')}\n`;
            } else {
                output += ` Pemain #${player.id} (${player.score}):_,(Berhenti bermain karena tidak memiliki dadu)\n`;
                players.splice(players.indexOf(player), 1);

            }

            // if (!player.hasDiceRemaining()) {
            // }
        });

        round++;
        output += "======================\n";
    }



    output += `Game berakhir karena hanya pemain #${players[0].id} yang memiliki dadu.\n`;

    const winnerPlayer = players[0].winner(players);
    output += `Pemain #${winnerPlayer.id} adalah pemenang dengan skor ${winnerPlayer.score}.\n`;

    document.getElementById("output").innerText = output;
}



