
$(document).ready(function () {

    var characters = {
        "Jon Snow": {
            name: "Jon Snow",
            health: 120,
            attack: 8,
            imageUrl: "images/a1.jpg",
            enemyAttackBack: 10
        },

        "White Walker": {
            name: "White Walker",
            health: 44,
            attack: 14,
            imageUrl: "images/a2.jpg",
            enemyAttackBack: 17
        },
        "Y gritte": {
            name: "Y gritte",
            health: 65,
            attack: 8,
            imageUrl: "images/a3.jpg",
            enemyAttackBack: 3
        },
        "Brienne of Tarth": {
            name: "Brienne of Tarth",
            health: 75,
            attack: 11,
            imageUrl: "images/a4.jpg",
            enemyAttackBack: 3
        },
        "Bronn": {
            name: "Bronn",
            health: 135,
            attack: 16,
            imageUrl: "images/a5.jpg",
            enemyAttackBack: 5
        },
        "Lormund Gantsbare": {
            name: "Lormund Gantsbare",
            health: 70,
            attack: 16,
            imageUrl: "images/a6.jpg",
            enemyAttackBack: 7
        },
        "Lord Barys": {
            name: "Lord Barys",
            health: 70,
            attack: 13,
            imageUrl: "images/a7.jpg",
            enemyAttackBack: 10
        },
        "Tyrion Lannister": {
            name: "Tyrion Lannister",
            health: 170,
            attack: 6,
            imageUrl: "images/a8.jpg",
            enemyAttackBack: 6
        },
        "Petry Baelis": {
            name: "Petry Baelis",
            health: 60,
            attack: 5,
            imageUrl: "images/a9.jpg",
            enemyAttackBack: 15
        }
    };

    var attacker;
    var combatants = [];
    var defender;
    var turnCounter = 1;
    var killCount = 0;

    var renderCharacter = function (character, renderArea) {
        var charDiv = $("<div class='character' data-name='" + character.name + "'>");
        var charName = $("<div class='character-name'>").text(character.name);
        var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
        var charHealth = $("<div class='character-health'>").text(character.health);
        charDiv.append(charImage).append(charName).append(charHealth);
        $(renderArea).append(charDiv);
    };

    var initializeGame = function () {
        for (var key in characters) {
            renderCharacter(characters[key], "#characters-section");
        }
    };

    initializeGame();

    var updateCharacter = function (charObj, areaRender) {
        $(areaRender).empty();
        renderCharacter(charObj, areaRender);
    };

    var renderEnemies = function (enemyArr) {
        for (var i = 0; i < enemyArr.length; i++) {
            renderCharacter(enemyArr[i], "#available-to-attack-section");
        }
    };

    var renderMessage = function (message) {
        var gameMessageSet = $("#game-message");
        var newMessage = $("<div>").text(message);
        gameMessageSet.append(newMessage);
    };

    var restartGame = function (resultMessage) {
        var restart = $("<button>Restart</button>").click(function () {
            location.reload();
        });

        var gameState = $("<div>").text(resultMessage);

        $("body").append(gameState);
        $("body").append(restart);
    };

    var clearMessage = function () {
        var gameMessage = $("#game-message");

        gameMessage.text("");
    };

    $("#characters-section").on("click", ".character", function () {
        var name = $(this).attr("data-name");

        if (!attacker) {
            attacker = characters[name];

            for (var key in characters) {
                if (key != name) {
                    combatants.push(characters[key]);
                }
            }
            $("#characters-section").hide();

            updateCharacter(attacker, "#selected-character");
            renderEnemies(combatants);
        }
    });


    $("#available-to-attack-section").on("click", ".character", function () {

        var name = $(this).attr("data-name");

        if ($("#defender").children().length === 0) {
            defender = characters[name];
            updateCharacter(defender, "#defender");

            $(this).remove();
            clearMessage();
        }
    });

    $("#attack-button").on("click", function () {
        if ($("#defender").children().length !== 0) {
            var attackMessage = "You attacked " + defender.name + " for " + attacker.attack * turnCounter + " damage.";
            var counterAttackMessage = defender.name + " attacked you back for " + defender.enemyAttackBack + " damage.";
            clearMessage();

            defender.health -= attacker.attack * turnCounter;

            if (defender.health > 0) {
                updateCharacter(defender, "#defender");

                renderMessage(attackMessage);
                renderMessage(counterAttackMessage);

                attacker.health -= defender.enemyAttackBack;

                updateCharacter(attacker, "#selected-character");

                if (attacker.health <= 0) {
                    clearMessage();
                    restartGame("You have been defeated...GAME OVER!!!");
                    $("#attack-button").off("click");
                }
            }
            else {
                $("#defender").empty();

                var gameStateMessage = "You have defeated " + defender.name + ", you can choose to fight another competitor.";
                renderMessage(gameStateMessage);

                killCount++;

                if (killCount >= combatants.length) {
                    clearMessage();
                    $("#attack-button").off("click");
                    restartGame("You Won!!! GAME OVER!!!");
                }
            }
            turnCounter++;
        }
        else {
            clearMessage();
            renderMessage("No Competitor here.");
        }
    });

})

