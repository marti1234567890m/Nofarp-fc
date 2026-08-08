// ==========================================
// NOFARP FC
// V1.2
// ==========================================


// ==========================================
// DONNÉES
// ==========================================

let players =
    JSON.parse(
        localStorage.getItem("nofarp_players")
    ) || [
        "Alex",
        "Joueur 2",
        "Joueur 3",
        "Joueur 4",
        "Joueur 5",
        "Joueur 6"
    ];


let matches =
    JSON.parse(
        localStorage.getItem("nofarp_matches")
    ) || [];


// ==========================================
// SAUVEGARDE
// ==========================================

function saveData() {

    localStorage.setItem(
        "nofarp_players",
        JSON.stringify(players)
    );

    localStorage.setItem(
        "nofarp_matches",
        JSON.stringify(matches)
    );

}


// ==========================================
// NAVIGATION
// ==========================================

function showPage(
    pageId,
    button = null
) {

    document
        .querySelectorAll(".page")
        .forEach(
            page =>
                page.classList.remove(
                    "active-page"
                )
        );


    const page =
        document.getElementById(
            pageId
        );


    if (page) {

        page.classList.add(
            "active-page"
        );

    }


    document
        .querySelectorAll(".nav-btn")
        .forEach(
            btn =>
                btn.classList.remove(
                    "active"
                )
        );


    if (button) {

        button.classList.add(
            "active"
        );

    }


    refresh();

}


// ==========================================
// AJOUT JOUEUR
// ==========================================

function addPlayer() {

    const input =
        document.getElementById(
            "newPlayer"
        );


    const name =
        input.value.trim();


    if (!name) {

        alert(
            "Entre un nom de joueur."
        );

        return;

    }


    if (
        players.some(
            p =>
                p.toLowerCase() ===
                name.toLowerCase()
        )
    ) {

        alert(
            "Ce joueur existe déjà."
        );

        return;

    }


    players.push(name);

    input.value = "";

    saveData();

    refresh();

}


// ==========================================
// SUPPRIMER JOUEUR
// ==========================================

function deletePlayer(index) {

    const player =
        players[index];


    const used =
        matches.some(
            match =>
                match.player1 === player ||
                match.player2 === player
        );


    if (used) {

        alert(
            "Impossible de supprimer ce joueur : il possède déjà des matchs."
        );

        return;

    }


    if (
        !confirm(
            "Supprimer " +
            player +
            " ?"
        )
    ) {

        return;

    }


    players.splice(
        index,
        1
    );


    saveData();

    refresh();

}


// ==========================================
// SELECTS
// ==========================================

function updatePlayerSelects() {

    const select1 =
        document.getElementById(
            "player1"
        );

    const select2 =
        document.getElementById(
            "player2"
        );

    const h2h1 =
        document.getElementById(
            "h2hPlayer1"
        );

    const h2h2 =
        document.getElementById(
            "h2hPlayer2"
        );


    if (!select1 || !select2)
        return;


    select1.innerHTML = "";

    select2.innerHTML = "";


    players.forEach(
        player => {

            select1.innerHTML += `
                <option value="${player}">
                    ${player}
                </option>
            `;


            select2.innerHTML += `
                <option value="${player}">
                    ${player}
                </option>
            `;

        }
    );


    if (h2h1 && h2h2) {

        h2h1.innerHTML = "";

        h2h2.innerHTML = "";


        players.forEach(
            player => {

                h2h1.innerHTML += `
                    <option value="${player}">
                        ${player}
                    </option>
                `;


                h2h2.innerHTML += `
                    <option value="${player}">
                        ${player}
                    </option>
                `;

            }
        );

    }

}


// ==========================================
// JOUEURS
// ==========================================

function renderPlayers() {

    const container =
        document.getElementById(
            "playerList"
        );


    if (!container)
        return;


    if (
        players.length === 0
    ) {

        container.innerHTML =
            `<div class="empty">
                Aucun joueur.
            </div>`;

        return;

    }


    container.innerHTML =
        players.map(
            (player,index) => `

            <div class="player-item">

                <strong>
                    ${player}
                </strong>

                <button
                    class="delete-button"
                    onclick="
                        deletePlayer(${index})
                    "
                >

                    Supprimer

                </button>

            </div>

        `
        ).join("");

}


// ==========================================
// AJOUT MATCH
// ==========================================

function addMatch() {

    const player1 =
        document.getElementById(
            "player1"
        ).value;


    const player2 =
        document.getElementById(
            "player2"
        ).value;


    const score1 =
        parseInt(
            document.getElementById(
                "score1"
            ).value
        );


    const score2 =
        parseInt(
            document.getElementById(
                "score2"
            ).value
        );


    if (
        players.length < 2
    ) {

        alert(
            "Il faut au moins deux joueurs."
        );

        return;

    }


    if (
        player1 === player2
    ) {

        alert(
            "Un joueur ne peut pas jouer contre lui-même."
        );

        return;

    }


    if (
        isNaN(score1) ||
        isNaN(score2) ||
        score1 < 0 ||
        score2 < 0
    ) {

        alert(
            "Score invalide."
        );

        return;

    }


    matches.push({

        player1,
        player2,

        score1,
        score2,

        date:
            new Date().toISOString()

    });


    saveData();


    document.getElementById(
        "score1"
    ).value = 0;


    document.getElementById(
        "score2"
    ).value = 0;


    alert(
        "⚽ Match enregistré !"
    );


    refresh();

}


// ==========================================
// STATISTIQUES
// ==========================================

function calculateStats() {

    const stats = {};


    players.forEach(
        player => {

            stats[player] = {

                matches: 0,

                wins: 0,

                draws: 0,

                losses: 0,

                goalsFor: 0,

                goalsAgainst: 0,

                points: 0

            };

        }
    );


    matches.forEach(
        match => {

            const p1 =
                stats[match.player1];


            const p2 =
                stats[match.player2];


            if (!p1 || !p2)
                return;


            p1.matches++;

            p2.matches++;


            p1.goalsFor +=
                match.score1;

            p1.goalsAgainst +=
                match.score2;


            p2.goalsFor +=
                match.score2;

            p2.goalsAgainst +=
                match.score1;


            if (
                match.score1 >
                match.score2
            ) {

                p1.wins++;

                p1.points += 3;

                p2.losses++;

            }

            else if (
                match.score2 >
                match.score1
            ) {

                p2.wins++;

                p2.points += 3;

                p1.losses++;

            }

            else {

                p1.draws++;

                p2.draws++;

                p1.points++;

                p2.points++;

            }

        }
    );


    return stats;

}


// ==========================================
// CLASSEMENT
// ==========================================

function getRanking() {

    const stats =
        calculateStats();


    const ranking =
        players.map(
            player => {

                const s =
                    stats[player];


                return {

                    player,

                    ...s,

                    difference:
                        s.goalsFor -
                        s.goalsAgainst

                };

            }
        );


    ranking.sort(
        (a,b) => {

            if (
                b.points !==
                a.points
            )

                return (
                    b.points -
                    a.points
                );


            if (
                b.difference !==
                a.difference
            )

                return (
                    b.difference -
                    a.difference
                );


            return (
                b.goalsFor -
                a.goalsFor
            );

        }
    );


    return ranking;

}


function renderRanking() {

    const body =
        document.getElementById(
            "rankingBody"
        );


    if (!body)
        return;


    const ranking =
        getRanking();


    body.innerHTML =
        ranking.map(
            (r,index) => `

            <tr>

                <td class="rank-number">

                    ${index + 1}

                </td>


                <td
                    class="player-link"
                    onclick="
                        openProfile(
                            '${r.player}'
                        )
                    "
                >

                    ${r.player}

                </td>


                <td>
                    ${r.matches}
                </td>

                <td>
                    ${r.wins}
                </td>

                <td>
                    ${r.draws}
                </td>

                <td>
                    ${r.losses}
                </td>

                <td>
                    ${r.goalsFor}
                </td>

                <td>
                    ${r.goalsAgainst}
                </td>

                <td>

                    ${
                        r.difference > 0
                            ? "+"
                            : ""
                    }

                    ${r.difference}

                </td>

                <td>

                    <strong>
                        ${r.points}
                    </strong>

                </td>

            </tr>

        `
        ).join("");

}


// ==========================================
// PODIUM
// ==========================================

function renderPodium() {

    const container =
        document.getElementById(
            "podium"
        );


    if (!container)
        return;


    const ranking =
        getRanking();


    if (
        ranking.length === 0
    ) {

        container.innerHTML =
            `<div class="empty">
                Aucun joueur.
            </div>`;

        return;

    }


    const top =
        ranking.slice(
            0,
            3
        );


    container.innerHTML =
        top.map(
            (player,index) => {

                const medals = [
                    "🥇",
                    "🥈",
                    "🥉"
                ];


                return `

                    <div class="podium-card">

                        <div class="podium-medal">

                            ${medals[index]}

                        </div>


                        <div class="podium-name">

                            ${player.player}

                        </div>


                        <div class="podium-points">

                            ${player.points}
                            pts

                        </div>


                        <div class="podium-record">

                            ${player.wins}V
                            ·
                            ${player.draws}N
                            ·
                            ${player.losses}D

                        </div>

                    </div>

                `;

            }
        ).join("");

}

// ==========================================
// RECORDS + TROPHÉES
// ==========================================

function renderRecords() {

    const container =
        document.getElementById(
            "records"
        );


    if (!container)
        return;


    if (matches.length === 0) {

        container.innerHTML =
            `<div class="empty">
                Les records apparaîtront après le premier match.
            </div>`;

        return;

    }


    const stats =
        calculateStats();


    let biggestWin = null;
    let highestScore = null;
    let bestScorer = null;
    let bestAttack = null;
    let bestDefense = null;
    let bestWinRate = null;


    // ==================================
    // RECORDS MATCHS
    // ==================================

    matches.forEach(
        match => {

            const difference =
                Math.abs(
                    match.score1 -
                    match.score2
                );


            if (
                !biggestWin ||
                difference >
                biggestWin.difference
            ) {

                biggestWin = {
                    match,
                    difference
                };

            }


            const total =
                match.score1 +
                match.score2;


            if (
                !highestScore ||
                total >
                highestScore.total
            ) {

                highestScore = {
                    match,
                    total
                };

            }

        }
    );


    // ==================================
    // RECORDS JOUEURS
    // ==================================

    players.forEach(
        player => {

            const s =
                stats[player];


            if (
                !s ||
                s.matches === 0
            )

                return;


            const attack =
                s.goalsFor /
                s.matches;


            const defense =
                s.goalsAgainst /
                s.matches;


            const winRate =
                s.wins /
                s.matches;


            if (
                !bestScorer ||
                s.goalsFor >
                stats[bestScorer].goalsFor
            ) {

                bestScorer =
                    player;

            }


            if (
                !bestAttack ||
                attack >
                bestAttack.value
            ) {

                bestAttack = {

                    player,

                    value: attack

                };

            }


            if (
                !bestDefense ||
                defense <
                bestDefense.value
            ) {

                bestDefense = {

                    player,

                    value: defense

                };

            }


            if (
                !bestWinRate ||
                winRate >
                bestWinRate.value
            ) {

                bestWinRate = {

                    player,

                    value: winRate

                };

            }

        }
    );


    container.innerHTML = `

        <div class="record-card">

            <span>
                💥
            </span>

            <strong>
                Plus grosse victoire
            </strong>

            <p>

                ${biggestWin.match.player1}
                ${biggestWin.match.score1}
                -
                ${biggestWin.match.score2}
                ${biggestWin.match.player2}

            </p>

        </div>


        <div class="record-card">

            <span>
                🎯
            </span>

            <strong>
                Match le plus prolifique
            </strong>

            <p>

                ${highestScore.match.player1}
                ${highestScore.match.score1}
                -
                ${highestScore.match.score2}
                ${highestScore.match.player2}

            </p>

        </div>


        <div class="record-card">

            <span>
                ⚽
            </span>

            <strong>
                Meilleur buteur
            </strong>

            <p>

                ${bestScorer}
                ·
                ${stats[bestScorer].goalsFor}
                buts

            </p>

        </div>


        <div class="record-card">

            <span>
                ⚔️
            </span>

            <strong>
                Meilleure attaque
            </strong>

            <p>

                ${bestAttack.player}
                ·
                ${bestAttack.value.toFixed(2)}
                buts / match

            </p>

        </div>


        <div class="record-card">

            <span>
                🛡️
            </span>

            <strong>
                Meilleure défense
            </strong>

            <p>

                ${bestDefense.player}
                ·
                ${bestDefense.value.toFixed(2)}
                encaissés / match

            </p>

        </div>


        <div class="record-card">

            <span>
                📈
            </span>

            <strong>
                Meilleur ratio de victoire
            </strong>

            <p>

                ${bestWinRate.player}
                ·
                ${(bestWinRate.value * 100).toFixed(1)}
                %

            </p>

        </div>

    `;

}


// ==========================================
// TROPHÉES INDIVIDUELS
// ==========================================

function getPlayerTrophies(
    player
) {

    const stats =
        calculateStats();


    const s =
        stats[player];


    if (
        !s ||
        s.matches === 0
    ) {

        return [];

    }


    const trophies = [];


    const ranking =
        getRanking();


    // 👑 ROI DU CLASSEMENT

    if (
        ranking.length > 0 &&
        ranking[0].player === player
    ) {

        trophies.push({
            icon: "👑",
            name: "Roi du classement"
        });

    }


    // ⚽ MEILLEUR BUTEUR

    let maxGoals = 0;


    players.forEach(
        p => {

            if (
                stats[p].goalsFor >
                maxGoals
            ) {

                maxGoals =
                    stats[p].goalsFor;

            }

        }
    );


    if (
        s.goalsFor === maxGoals &&
        maxGoals > 0
    ) {

        trophies.push({
            icon: "⚽",
            name: "Meilleur buteur"
        });

    }


    // 🛡️ MEILLEURE DÉFENSE

    let bestDefense =
        Infinity;


    players.forEach(
        p => {

            if (
                stats[p].matches === 0
            )

                return;


            const defense =
                stats[p].goalsAgainst /
                stats[p].matches;


            if (
                defense <
                bestDefense
            ) {

                bestDefense =
                    defense;

            }

        }
    );


    const playerDefense =
        s.goalsAgainst /
        s.matches;


    if (
        playerDefense ===
        bestDefense
    ) {

        trophies.push({
            icon: "🛡️",
            name: "Mur défensif"
        });

    }


    // ⚔️ MEILLEURE ATTAQUE

    let bestAttack = 0;


    players.forEach(
        p => {

            if (
                stats[p].matches === 0
            )

                return;


            const attack =
                stats[p].goalsFor /
                stats[p].matches;


            if (
                attack >
                bestAttack
            ) {

                bestAttack =
                    attack;

            }

        }
    );


    const playerAttack =
        s.goalsFor /
        s.matches;


    if (
        playerAttack ===
        bestAttack
    ) {

        trophies.push({
            icon: "⚔️",
            name: "Machine offensive"
        });

    }


    // 🚀 SÉRIE DE VICTOIRES

    const streak =
        getCurrentWinStreak(
            player
        );


    if (
        streak >= 3
    ) {

        trophies.push({
            icon: "🔥",
            name:
                `Série de ${streak} victoires`
        });

    }


    // 🎯 5 VICTOIRES

    if (
        s.wins >= 5
    ) {

        trophies.push({
            icon: "🎯",
            name: "5 victoires"
        });

    }


    // 💯 10 VICTOIRES

    if (
        s.wins >= 10
    ) {

        trophies.push({
            icon: "💯",
            name: "10 victoires"
        });

    }


    return trophies;

}


// ==========================================
// AFFICHER LES TROPHÉES
// ==========================================

function renderPlayerTrophies(
    player
) {

    const container =
        document.getElementById(
            "playerTrophies"
        );


    if (!container)
        return;


    const trophies =
        getPlayerTrophies(
            player
        );


    if (
        trophies.length === 0
    ) {

        container.innerHTML = `

            <h3>
                🏅 Trophées
            </h3>

            <div class="empty">

                Aucun trophée pour le moment.

            </div>

        `;

        return;

    }


    container.innerHTML = `

        <h3>
            🏅 Trophées
        </h3>


        <div class="trophy-grid">

            ${
                trophies.map(
                    trophy => `

                    <div class="trophy-card">

                        <div class="trophy-icon">

                            ${trophy.icon}

                        </div>

                        <strong>

                            ${trophy.name}

                        </strong>

                    </div>

                `
                ).join("")
            }

        </div>

    `;

}


// ==========================================
// PROFIL
// ==========================================

function openProfile(player) {

    showPage(
        "playerProfile"
    );


    const stats =
        calculateStats()[player];


    const playerMatches =
        matches.filter(
            match =>
                match.player1 === player ||
                match.player2 === player
        );


    const winRate =
        stats.matches > 0
            ? (
                stats.wins /
                stats.matches *
                100
            ).toFixed(1)
            : 0;


    const averageGoals =
        stats.matches > 0
            ? (
                stats.goalsFor /
                stats.matches
            ).toFixed(2)
            : 0;


    const currentStreak =
        getCurrentWinStreak(
            player
        );


    const content =
        document.getElementById(
            "profileContent"
        );


    content.innerHTML = `

        <div class="panel profile-header">

            <div class="profile-avatar">
                👤
            </div>


            <div class="profile-name">

                ${player}

            </div>


            <div class="profile-grid">


                <div class="profile-stat">

                    <strong>
                        ${stats.matches}
                    </strong>

                    <span>
                        MATCHS
                    </span>

                </div>


                <div class="profile-stat">

                    <strong>
                        ${stats.wins}
                    </strong>

                    <span>
                        VICTOIRES
                    </span>

                </div>


                <div class="profile-stat">

                    <strong>
                        ${stats.draws}
                    </strong>

                    <span>
                        NULS
                    </span>

                </div>


                <div class="profile-stat">

                    <strong>
                        ${stats.losses}
                    </strong>

                    <span>
                        DÉFAITES
                    </span>

                </div>


                <div class="profile-stat">

                    <strong>
                        ${stats.goalsFor}
                    </strong>

                    <span>
                        BUTS
                    </span>

                </div>


                <div class="profile-stat">

                    <strong>
                        ${stats.goalsAgainst}
                    </strong>

                    <span>
                        ENCAISSÉS
                    </span>

                </div>


                <div class="profile-stat">

                    <strong>
                        ${winRate}%
                    </strong>

                    <span>
                        VICTOIRES
                    </span>

                </div>


                <div class="profile-stat">

                    <strong>
                        ${currentStreak}
                    </strong>

                    <span>
                        SÉRIE
                    </span>

                </div>


            </div>

        </div>


        <div class="panel">

            <h3>
                📊 Moyenne de buts
            </h3>


            <div class="h2h-score">

                ${averageGoals}

            </div>

        </div>


        <div class="panel">

            <h3>
                🔥 Derniers matchs
            </h3>


            ${
                renderPlayerMatches(
                    playerMatches
                        .slice(-5)
                        .reverse()
                )
            }

        </div>


        <div class="panel">

            <h3>
                🔥 Face-à-face
            </h3>


            <button
                class="main-button"
                onclick="
                    openH2HFromPlayer(
                        '${player}'
                    )
                "
            >

                Voir les confrontations

            </button>

        </div>
    
    `;


    renderPlayerTrophies(
        player
    );
    
}


// ==========================================
// SÉRIE DE VICTOIRES
// ==========================================

function getCurrentWinStreak(player) {

    let streak = 0;


    for (
        let i =
            matches.length - 1;

        i >= 0;

        i--
    ) {

        const match =
            matches[i];


        if (
            match.player1 !== player &&
            match.player2 !== player
        )

            continue;


        const playerScore =
            match.player1 === player
                ? match.score1
                : match.score2;


        const opponentScore =
            match.player1 === player
                ? match.score2
                : match.score1;


        if (
            playerScore >
            opponentScore
        ) {

            streak++;

        }

        else {

            break;

        }

    }


    return streak;

}


// ==========================================
// MATCHS JOUEUR
// ==========================================

function renderPlayerMatches(
    playerMatches
) {

    if (
        playerMatches.length === 0
    )

        return `
            <div class="empty">
                Aucun match.
            </div>
        `;


    return playerMatches.map(
        match => `

        <div class="match-row">

            <div class="match-players">

                ${match.player1}

                <span style="color:#777">
                    vs
                </span>

                ${match.player2}

            </div>


            <div class="match-score">

                ${match.score1}
                -
                ${match.score2}

            </div>

        </div>

    `
    ).join("");

}


// ==========================================
// FACE À FACE
// ==========================================

function openH2HFromPlayer(
    player
) {

    showPage(
        "headToHead"
    );


    const select =
        document.getElementById(
            "h2hPlayer1"
        );


    select.value =
        player;

}

function showHeadToHead() {

    const p1 =
        document.getElementById(
            "h2hPlayer1"
        ).value;


    const p2 =
        document.getElementById(
            "h2hPlayer2"
        ).value;


    const result =
        document.getElementById(
            "h2hResult"
        );


    if (p1 === p2) {

        alert(
            "Choisis deux joueurs différents."
        );

        return;

    }


    const confrontations =
        matches.filter(
            match =>

                (
                    match.player1 === p1 &&
                    match.player2 === p2
                )

                ||

                (
                    match.player1 === p2 &&
                    match.player2 === p1
                )
        );


    // ==============================
    // STATISTIQUES
    // ==============================

    let wins1 = 0;
    let wins2 = 0;
    let draws = 0;

    let goals1 = 0;
    let goals2 = 0;


    confrontations.forEach(
        match => {

            const s1 =
                match.player1 === p1
                    ? match.score1
                    : match.score2;


            const s2 =
                match.player1 === p1
                    ? match.score2
                    : match.score1;


            goals1 += s1;
            goals2 += s2;


            if (s1 > s2) {

                wins1++;

            }

            else if (s2 > s1) {

                wins2++;

            }

            else {

                draws++;

            }

        }
    );


    const totalMatches =
        confrontations.length;


    const avg1 =
        totalMatches > 0
            ? (
                goals1 /
                totalMatches
            ).toFixed(2)
            : "0.00";


    const avg2 =
        totalMatches > 0
            ? (
                goals2 /
                totalMatches
            ).toFixed(2)
            : "0.00";


    const difference =
        goals1 - goals2;


    // ==============================
    // DERNIERS MATCHS
    // ==============================

    const lastMatches =
        confrontations
            .slice()
            .reverse()
            .slice(0, 5);


    let lastMatchesHTML = "";


    if (
        lastMatches.length === 0
    ) {

        lastMatchesHTML = `
            <div class="empty">
                Aucun affrontement pour le moment.
            </div>
        `;

    }

    else {

        lastMatchesHTML =
            lastMatches.map(
                match => {

                    const s1 =
                        match.player1 === p1
                            ? match.score1
                            : match.score2;


                    const s2 =
                        match.player1 === p1
                            ? match.score2
                            : match.score1;


                    let resultIcon;


                    if (s1 > s2) {

                        resultIcon = "🟢";

                    }

                    else if (s1 < s2) {

                        resultIcon = "🔴";

                    }

                    else {

                        resultIcon = "🟡";

                    }


                    const date =
                        new Date(
                            match.date
                        ).toLocaleDateString(
                            "fr-FR"
                        );


                    return `

                        <div class="h2h-match">

                            <div>

                                <span class="h2h-form">

                                    ${resultIcon}

                                </span>

                                ${p1}

                                <span class="h2h-vs">
                                    vs
                                </span>

                                ${p2}

                            </div>


                            <strong>

                                ${s1}
                                -
                                ${s2}

                            </strong>


                            <small>

                                ${date}

                            </small>

                        </div>

                    `;

                }
            ).join("");

    }


    // ==============================
    // DOMINATION
    // ==============================

    let dominationText;


    if (
        totalMatches === 0
    ) {

        dominationText =
            "Première confrontation à venir 👀";

    }

    else if (
        wins1 > wins2
    ) {

        dominationText =
            `👑 ${p1} domine la confrontation`;

    }

    else if (
        wins2 > wins1
    ) {

        dominationText =
            `👑 ${p2} domine la confrontation`;

    }

    else {

        dominationText =
            "⚔️ Égalité parfaite";

    }


    // ==============================
    // AFFICHAGE
    // ==============================

    result.innerHTML = `

        <div class="panel h2h-main">

            <div class="h2h-names">

                <div>

                    <div class="h2h-big-name">
                        ${p1}
                    </div>

                    <div class="h2h-big-number">
                        ${wins1}
                    </div>

                    <small>
                        VICTOIRES
                    </small>

                </div>


                <div class="h2h-vs-big">
                    VS
                </div>


                <div>

                    <div class="h2h-big-name">
                        ${p2}
                    </div>

                    <div class="h2h-big-number">
                        ${wins2}
                    </div>

                    <small>
                        VICTOIRES
                    </small>

                </div>

            </div>


            <div class="h2h-domination">

                ${dominationText}

            </div>

        </div>


        <!-- STATISTIQUES -->

        <div class="panel">

            <h3>
                📊 Statistiques
            </h3>


            <div class="h2h-stat-table">

                <div class="h2h-stat-line">

                    <strong>
                        ${goals1}
                    </strong>

                    <span>
                        ⚽ Buts
                    </span>

                    <strong>
                        ${goals2}
                    </strong>

                </div>


                <div class="h2h-stat-line">

                    <strong>
                        ${avg1}
                    </strong>

                    <span>
                        ⚽ Moyenne / match
                    </span>

                    <strong>
                        ${avg2}
                    </strong>

                </div>


                <div class="h2h-stat-line">

                    <strong>
                        ${wins1}
                    </strong>

                    <span>
                        🏆 Victoires
                    </span>

                    <strong>
                        ${wins2}
                    </strong>

                </div>


                <div class="h2h-stat-line">

                    <strong>
                        ${draws}
                    </strong>

                    <span>
                        🟡 Matchs nuls
                    </span>

                    <strong>
                        ${draws}
                    </strong>

                </div>


                <div class="h2h-stat-line">

                    <strong>
                        ${
                            difference > 0
                                ? "+" + difference
                                : difference
                        }
                    </strong>

                    <span>
                        ⚔️ Différence de buts
                    </span>

                    <strong>
                        ${
                            difference < 0
                                ? "+" + Math.abs(difference)
                                : difference === 0
                                    ? "0"
                                    : "-" + difference
                        }
                    </strong>

                </div>

            </div>

        </div>


        <!-- DERNIERS MATCHS -->

        <div class="panel">

            <h3>
                🔥 5 derniers affrontements
            </h3>

            ${lastMatchesHTML}

        </div>

    `;

}

// ==========================================
// HISTORIQUE
// ==========================================

function renderHistory() {

    const container =
        document.getElementById(
            "matchHistory"
        );


    if (!container)
        return;


    if (
        matches.length === 0
    ) {

        container.innerHTML =
            `<div class="empty">
                Aucun match enregistré.
            </div>`;

        return;

    }


    container.innerHTML =
        matches
            .slice()
            .reverse()
            .map(
                (match,index) => {

                    const realIndex =
                        matches.length -
                        1 -
                        index;


                    const date =
                        new Date(
                            match.date
                        );


                    return `

                        <div class="match-row">

                            <div class="match-players">

                                ${match.player1}

                                <span style="color:#777">
                                    vs
                                </span>

                                ${match.player2}

                                <span class="match-date">

                                    ${date.toLocaleDateString(
                                        "fr-FR"
                                    )}

                                </span>

                            </div>


                            <div class="match-score">

                                ${match.score1}
                                -
                                ${match.score2}

                            </div>


                            <button
                                class="delete-button"
                                onclick="
                                    deleteMatch(
                                        ${realIndex}
                                    )
                                "
                            >

                                ✕

                            </button>

                        </div>

                    `;

                }
            )
            .join("");

}


// ==========================================
// SUPPRESSION MATCH
// ==========================================

function deleteMatch(index) {

    if (
        !confirm(
            "Supprimer définitivement ce match ?"
        )
    )

        return;


    matches.splice(
        index,
        1
    );


    saveData();

    refresh();

}


// ==========================================
// DASHBOARD
// ==========================================

function renderDashboard() {

    document.getElementById(
        "totalMatches"
    ).textContent =
        matches.length;


    document.getElementById(
        "totalPlayers"
    ).textContent =
        players.length;


    let totalGoals = 0;


    matches.forEach(
        match => {

            totalGoals +=
                match.score1 +
                match.score2;

        }
    );


    document.getElementById(
        "totalGoals"
    ).textContent =
        totalGoals;


    const stats =
        calculateStats();


    let bestPlayer =
        null;


    players.forEach(
        player => {

            if (
                !bestPlayer ||
                stats[player].points >
                stats[bestPlayer].points
            ) {

                bestPlayer =
                    player;

            }

        }
    );


    const bestContainer =
        document.getElementById(
            "bestPlayer"
        );


    if (
        !bestPlayer ||
        matches.length === 0
    ) {

        bestContainer.innerHTML =
            `<div class="empty">
                Aucun classement pour le moment.
            </div>`;

    }

    else {

        bestContainer.innerHTML = `

            <div class="best-player">

                <div class="avatar">
                    👑
                </div>


                <strong>
                    ${bestPlayer}
                </strong>


                <span>

                    ${stats[bestPlayer].points}
                    points

                </span>

            </div>

        `;

    }


    const recent =
        document.getElementById(
            "recentMatches"
        );


    if (
        matches.length === 0
    ) {

        recent.innerHTML =
            `<div class="empty">
                Aucun match.
            </div>`;

    }

    else {

        recent.innerHTML =
            matches
                .slice()
                .reverse()
                .slice(0,5)
                .map(
                    match => `

                    <div class="match-row">

                        <div class="match-players">

                            ${match.player1}

                            <span style="color:#777">
                                vs
                            </span>

                            ${match.player2}

                        </div>


                        <div class="match-score">

                            ${match.score1}
                            -
                            ${match.score2}

                        </div>

                    </div>

                `
                )
                .join("");

    }


    renderPodium();

    renderRecords();

}


// ==========================================
// RAFRAÎCHISSEMENT
// ==========================================

function refresh() {

    updatePlayerSelects();

    renderPlayers();

    renderRanking();

    renderHistory();

    renderDashboard();
    // Mise à jour du classement de forme
    renderFormRanking();
        renderHall();

}


// ==========================================
// DÉMARRAGE
// ==========================================

refresh();

// ==========================================
// MODE SOIRÉE
// ==========================================

let partyPlayers = [];

let partyMatches = [];


// ==========================================
// AFFICHER LES JOUEURS
// ==========================================

function renderPartyPlayers() {

    const container =
        document.getElementById(
            "partyPlayers"
        );


    if (!container)
        return;


    container.innerHTML =
        players.map(
            (player, index) => `

            <label class="party-player">

                <input
                    type="checkbox"
                    value="${player}"
                    onchange="updatePartyPlayers()"
                >

                <span>
                    ${player}
                </span>

            </label>

        `
        ).join("");

}


// ==========================================
// JOUEURS SÉLECTIONNÉS
// ==========================================

function updatePartyPlayers() {

    partyPlayers =
        Array.from(
            document.querySelectorAll(
                "#partyPlayers input:checked"
            )
        ).map(
            checkbox =>
                checkbox.value
        );

}


// ==========================================
// COMMENCER LA SOIRÉE
// ==========================================

function startParty() {

    updatePartyPlayers();


    if (
        partyPlayers.length < 2
    ) {

        alert(
            "Sélectionne au moins 2 joueurs."
        );

        return;

    }


    partyMatches = [];


    document.getElementById(
        "partySetup"
    ).style.display = "none";


    document.getElementById(
        "partyGame"
    ).style.display = "block";


    document.getElementById(
        "partySummary"
    ).style.display = "none";


    updatePartySelects();

    renderPartyMatches();

}


// ==========================================
// SELECTS
// ==========================================

function updatePartySelects() {

    const select1 =
        document.getElementById(
            "partyPlayer1"
        );


    const select2 =
        document.getElementById(
            "partyPlayer2"
        );


    if (!select1 || !select2)
        return;


    select1.innerHTML = "";

    select2.innerHTML = "";


    partyPlayers.forEach(
        player => {

            select1.innerHTML += `

                <option value="${player}">
                    ${player}
                </option>

            `;


            select2.innerHTML += `

                <option value="${player}">
                    ${player}
                </option>

            `;

        }
    );


    if (
        partyPlayers.length >= 2
    ) {

        select2.selectedIndex = 1;

    }

}


// ==========================================
// AJOUTER UN MATCH À LA SOIRÉE
// ==========================================

function addPartyMatch() {

    const player1 =
        document.getElementById(
            "partyPlayer1"
        ).value;


    const player2 =
        document.getElementById(
            "partyPlayer2"
        ).value;


    const score1 =
        parseInt(
            document.getElementById(
                "partyScore1"
            ).value
        );


    const score2 =
        parseInt(
            document.getElementById(
                "partyScore2"
            ).value
        );


    if (
        player1 === player2
    ) {

        alert(
            "Choisis deux joueurs différents."
        );

        return;

    }


    if (
        isNaN(score1) ||
        isNaN(score2) ||
        score1 < 0 ||
        score2 < 0
    ) {

        alert(
            "Score invalide."
        );

        return;

    }


    const match = {

        player1,
        player2,

        score1,
        score2,

        date:
            new Date().toISOString()

    };


    partyMatches.push(
        match
    );


    // IMPORTANT :
    // Le match est immédiatement
    // ajouté aux statistiques générales.

    matches.push(
        match
    );


    saveData();


    // Reset des scores

    document.getElementById(
        "partyScore1"
    ).value = 0;


    document.getElementById(
        "partyScore2"
    ).value = 0;


    // Affichage

    renderPartyMatches();


    document.getElementById(
        "partyMatchCount"
    ).textContent =
        partyMatches.length +
        (
            partyMatches.length > 1
                ? " matchs"
                : " match"
        );


    // Retour automatique
    // sur le premier joueur

    document.getElementById(
        "partyPlayer1"
    ).focus();

}


// ==========================================
// AFFICHER LES MATCHS
// ==========================================

function renderPartyMatches() {

    const container =
        document.getElementById(
            "partyMatches"
        );


    if (!container)
        return;


    if (
        partyMatches.length === 0
    ) {

        container.innerHTML = `

            <div class="empty">

                Aucun match enregistré
                dans cette soirée.

            </div>

        `;

        return;

    }


    container.innerHTML =
        partyMatches
            .slice()
            .reverse()
            .map(
                (match, index) => `

                <div class="party-match">

                    <div>

                        <strong>
                            ${match.player1}
                        </strong>

                        <span>
                            vs
                        </span>

                        <strong>
                            ${match.player2}
                        </strong>

                    </div>


                    <div class="party-match-score">

                        ${match.score1}
                        -
                        ${match.score2}

                    </div>

                </div>

            `
            )
            .join("");

}


// ==========================================
// TERMINER LA SOIRÉE
// ==========================================

function endParty() {

    if (
        partyMatches.length === 0
    ) {

        if (
            !confirm(
                "Aucun match n'a été enregistré. Terminer quand même ?"
            )
        )

            return;

    }


    document.getElementById(
        "partyGame"
    ).style.display = "none";


    document.getElementById(
        "partySummary"
    ).style.display = "block";


    renderPartySummary();

}


// ==========================================
// RÉSUMÉ DE LA SOIRÉE
// ==========================================

function renderPartySummary() {

    const container =
        document.getElementById(
            "partySummary"
        );


    if (!container)
        return;


    if (
        partyMatches.length === 0
    ) {

        container.innerHTML = `

            <h3>
                🎮 Soirée terminée
            </h3>

            <div class="empty">
                Aucun match joué.
            </div>

            <button
                class="main-button"
                onclick="resetParty()"
            >

                Nouvelle soirée

            </button>

        `;

        return;

    }


    // ==============================
    // STATISTIQUES DE LA SOIRÉE
    // ==============================

    const partyStats = {};


    partyPlayers.forEach(
        player => {

            partyStats[player] = {

                matches: 0,

                wins: 0,

                draws: 0,

                losses: 0,

                goalsFor: 0,

                goalsAgainst: 0

            };

        }
    );


    partyMatches.forEach(
        match => {

            const p1 =
                partyStats[match.player1];


            const p2 =
                partyStats[match.player2];


            if (!p1 || !p2)
                return;


            p1.matches++;
            p2.matches++;


            p1.goalsFor +=
                match.score1;

            p1.goalsAgainst +=
                match.score2;


            p2.goalsFor +=
                match.score2;

            p2.goalsAgainst +=
                match.score1;


            if (
                match.score1 >
                match.score2
            ) {

                p1.wins++;

                p2.losses++;

            }

            else if (
                match.score2 >
                match.score1
            ) {

                p2.wins++;

                p1.losses++;

            }

            else {

                p1.draws++;

                p2.draws++;

            }

        }
    );


    // ==============================
    // MVP
    // ==============================

    let mvp = null;


    partyPlayers.forEach(
        player => {

            const s =
                partyStats[player];


            if (
                !s ||
                s.matches === 0
            )

                return;


            const points =
                s.wins * 3 +
                s.draws;


            if (
                !mvp ||
                points >
                mvp.points
            ) {

                mvp = {

                    player,

                    points

                };

            }

        }
    );


    // ==============================
    // AFFICHAGE
    // ==============================

    container.innerHTML = `

        <h3>
            🏁 Soirée terminée
        </h3>


        <div class="party-mvp">

            <div>
                🏆
            </div>

            <strong>
                ${mvp ? mvp.player : "-"}
            </strong>

            <span>
                MVP de la soirée
            </span>

        </div>


        <div class="party-summary-list">

            ${
                partyPlayers.map(
                    player => {

                        const s =
                            partyStats[player];


                        return `

                            <div
                                class="party-summary-player"
                            >

                                <strong>
                                    ${player}
                                </strong>


                                <span>

                                    ${s.matches} MJ

                                    ·

                                    ${s.wins} V

                                    ·

                                    ${s.draws} N

                                    ·

                                    ${s.losses} D

                                </span>


                                <strong>

                                    ${s.goalsFor}
                                    -
                                    ${s.goalsAgainst}

                                </strong>

                            </div>

                        `;

                    }
                ).join("")
            }

        </div>


        <button
            class="main-button"
            onclick="resetParty()"
        >

            🎮 NOUVELLE SOIRÉE

        </button>

    `;

}


// ==========================================
// NOUVELLE SOIRÉE
// ==========================================

function resetParty() {

    partyPlayers = [];

    partyMatches = [];


    document.getElementById(
        "partySetup"
    ).style.display = "block";


    document.getElementById(
        "partyGame"
    ).style.display = "none";


    document.getElementById(
        "partySummary"
    ).style.display = "none";


    renderPartyPlayers();

}


// ==========================================
// INITIALISATION
// ==========================================

renderPartyPlayers();

// ==========================================
// MATCH SUIVANT — ROTATION AUTOMATIQUE
// ==========================================

let partyRotationIndex = 0;


// ==========================================
// PROPOSER LE MATCH SUIVANT
// ==========================================

function nextPartyMatch() {

    if (partyPlayers.length < 2)
        return;


    const totalPlayers =
        partyPlayers.length;


    const index1 =
        partyRotationIndex %
        totalPlayers;


    const index2 =
        (partyRotationIndex + 1) %
        totalPlayers;


    const player1 =
        partyPlayers[index1];


    const player2 =
        partyPlayers[index2];


    document.getElementById(
        "partyPlayer1"
    ).value = player1;


    document.getElementById(
        "partyPlayer2"
    ).value = player2;


    document.getElementById(
        "partyScore1"
    ).value = 0;


    document.getElementById(
        "partyScore2"
    ).value = 0;


    partyRotationIndex++;


    // Si on arrive au bout,
    // on recommence les rotations.

    if (
        partyRotationIndex >=
        totalPlayers
    ) {

        partyRotationIndex = 0;

    }

}


// ==========================================
// MODIFIER LE DÉMARRAGE DE LA SOIRÉE
// ==========================================

const originalStartParty =
    startParty;


startParty = function() {

    originalStartParty();


    partyRotationIndex = 0;


    nextPartyMatch();

};

// ==========================================
// CLASSEMENT DE FORME
// ==========================================

function calculatePlayerForm(player) {

    // Récupère les matchs du joueur
    // du plus récent au plus ancien

    const playerMatches =
        matches
            .filter(
                match =>
                    match.player1 === player ||
                    match.player2 === player
            )
            .slice()
            .reverse()
            .slice(0, 5);


    if (
        playerMatches.length === 0
    ) {

        return {

            matches: 0,

            points: 0,

            percentage: 0,

            results: []

        };

    }


    let points = 0;

    const results = [];


    playerMatches.forEach(
        match => {

            let playerScore;
            let opponentScore;


            if (
                match.player1 === player
            ) {

                playerScore =
                    match.score1;

                opponentScore =
                    match.score2;

            }

            else {

                playerScore =
                    match.score2;

                opponentScore =
                    match.score1;

            }


            if (
                playerScore >
                opponentScore
            ) {

                points += 3;

                results.push("🟢");

            }

            else if (
                playerScore ===
                opponentScore
            ) {

                points += 1;

                results.push("🟡");

            }

            else {

                results.push("🔴");

            }

        }
    );


    const maxPoints =
        playerMatches.length * 3;


    const percentage =
        maxPoints > 0
            ? Math.round(
                (
                    points /
                    maxPoints
                ) * 100
            )
            : 0;


    return {

        matches:
            playerMatches.length,

        points,

        percentage,

        results

    };

}


// ==========================================
// AFFICHER LA FORME
// ==========================================

function renderFormRanking() {

    const container =
        document.getElementById(
            "formRanking"
        );


    if (!container)
        return;


    const ranking =
        players
            .map(
                player => {

                    const form =
                        calculatePlayerForm(
                            player
                        );


                    return {

                        player,

                        ...form

                    };

                }
            )
            .filter(
                item =>
                    item.matches > 0
            )
            .sort(
                (a, b) => {

                    // 1. Pourcentage de forme

                    if (
                        b.percentage !==
                        a.percentage
                    ) {

                        return (
                            b.percentage -
                            a.percentage
                        );

                    }


                    // 2. Nombre de points

                    return (
                        b.points -
                        a.points
                    );

                }
            );


    if (
        ranking.length === 0
    ) {

        container.innerHTML = `

            <div class="empty">

                Aucun match joué pour le moment.

            </div>

        `;

        return;

    }


    container.innerHTML =
        ranking
            .map(
                (item, index) => {

                    let medal;


                    if (index === 0) {

                        medal = "🥇";

                    }

                    else if (
                        index === 1
                    ) {

                        medal = "🥈";

                    }

                    else if (
                        index === 2
                    ) {

                        medal = "🥉";

                    }

                    else {

                        medal = `${index + 1}.`;

                    }


                    return `

                        <div class="form-player">

                            <div class="form-position">

                                ${medal}

                            </div>


                            <div class="form-player-info">

                                <strong>

                                    ${item.player}

                                </strong>


                                <div class="form-results">

                                    ${
                                        item.results
                                            .map(
                                                result =>
                                                    `<span>${result}</span>`
                                            )
                                            .join("")
                                    }

                                </div>

                            </div>


                            <div class="form-score">

                                <strong>

                                    ${item.percentage}%

                                </strong>

                                <small>

                                    ${item.points} pts

                                </small>

                            </div>

                        </div>

                    `;

                }
            )
            .join("");

}


// ==========================================
// INITIALISATION FORME
// ==========================================

renderFormRanking();

// ==========================================
// HALL OF FAME / HALL OF SHAME
// ==========================================

function calculateHallStats(player) {

    const playerMatches =
        matches.filter(
            match =>
                match.player1 === player ||
                match.player2 === player
        );


    let wins = 0;
    let draws = 0;
    let losses = 0;

    let goalsFor = 0;
    let goalsAgainst = 0;


    playerMatches.forEach(match => {

        let gf;
        let ga;


        if (match.player1 === player) {

            gf = Number(match.score1);
            ga = Number(match.score2);

        } else {

            gf = Number(match.score2);
            ga = Number(match.score1);

        }


        goalsFor += gf;
        goalsAgainst += ga;


        if (gf > ga) {

            wins++;

        } else if (gf === ga) {

            draws++;

        } else {

            losses++;

        }

    });


    const total =
        playerMatches.length;


    return {

        matches: total,

        wins,
        draws,
        losses,

        goalsFor,
        goalsAgainst,

        winRate:
            total > 0
                ? (wins / total) * 100
                : 0,

        goalsPerMatch:
            total > 0
                ? goalsFor / total
                : 0,

        concededPerMatch:
            total > 0
                ? goalsAgainst / total
                : 0

    };

}


// ==========================================
// PLUS LONGUE SÉRIE DE VICTOIRES
// ==========================================

function getBestWinStreak(player) {

    const playerMatches =
        matches.filter(
            match =>
                match.player1 === player ||
                match.player2 === player
        );


    let current = 0;
    let best = 0;


    playerMatches.forEach(match => {

        let gf;
        let ga;


        if (match.player1 === player) {

            gf = Number(match.score1);
            ga = Number(match.score2);

        } else {

            gf = Number(match.score2);
            ga = Number(match.score1);

        }


        if (gf > ga) {

            current++;

            if (current > best)
                best = current;

        } else {

            current = 0;

        }

    });


    return best;

}


// ==========================================
// PLUS LONGUE SÉRIE DE DÉFAITES
// ==========================================

function getWorstLossStreak(player) {

    const playerMatches =
        matches.filter(
            match =>
                match.player1 === player ||
                match.player2 === player
        );


    let current = 0;
    let worst = 0;


    playerMatches.forEach(match => {

        let gf;
        let ga;


        if (match.player1 === player) {

            gf = Number(match.score1);
            ga = Number(match.score2);

        } else {

            gf = Number(match.score2);
            ga = Number(match.score1);

        }


        if (gf < ga) {

            current++;

            if (current > worst)
                worst = current;

        } else {

            current = 0;

        }

    });


    return worst;

}


// ==========================================
// PLUS GROSSE VICTOIRE
// ==========================================

function getBiggestWin() {

    let best = null;


    matches.forEach(match => {

        const score1 =
            Number(match.score1);

        const score2 =
            Number(match.score2);


        const difference =
            Math.abs(
                score1 - score2
            );


        if (
            score1 === score2
        )
            return;


        if (
            !best ||
            difference > best.difference
        ) {

            best = {

                player:
                    score1 > score2
                        ? match.player1
                        : match.player2,

                opponent:
                    score1 > score2
                        ? match.player2
                        : match.player1,

                score1,
                score2,

                difference

            };

        }

    });


    return best;

}


// ==========================================
// PLUS GROSSE DÉFAITE
// ==========================================

function getBiggestLoss() {

    let worst = null;


    matches.forEach(match => {

        const score1 =
            Number(match.score1);

        const score2 =
            Number(match.score2);


        if (
            score1 === score2
        )
            return;


        const difference =
            Math.abs(
                score1 - score2
            );


        if (
            !worst ||
            difference > worst.difference
        ) {

            worst = {

                player:
                    score1 < score2
                        ? match.player1
                        : match.player2,

                opponent:
                    score1 < score2
                        ? match.player2
                        : match.player1,

                score1,
                score2,

                difference

            };

        }

    });


    return worst;

}


// ==========================================
// AFFICHAGE HALL
// ==========================================

function renderHall() {

    const fame =
        document.getElementById(
            "hallOfFame"
        );


    const shame =
        document.getElementById(
            "hallOfShame"
        );


    if (!fame || !shame)
        return;


    if (
        !matches ||
        matches.length === 0
    ) {

        fame.innerHTML = `
            <div class="empty">
                Aucun match enregistré pour le moment.
            </div>
        `;


        shame.innerHTML = `
            <div class="empty">
                Aucun record pour le moment.
            </div>
        `;


        return;

    }


    // ======================================
    // CALCUL DES STATISTIQUES
    // ======================================

    const stats =
        players.map(player => ({

            player,

            ...calculateHallStats(
                player
            ),

            winStreak:
                getBestWinStreak(
                    player
                ),

            lossStreak:
                getWorstLossStreak(
                    player
                )

        })).filter(
            item =>
                item.matches > 0
        );


    // ======================================
    // MEILLEURS RECORDS
    // ======================================

    const mostWins =
        [...stats].sort(
            (a, b) =>
                b.wins - a.wins
        )[0];


    const bestAttack =
        [...stats].sort(
            (a, b) =>
                b.goalsPerMatch -
                a.goalsPerMatch
        )[0];


    const bestDefense =
        [...stats].sort(
            (a, b) =>
                a.concededPerMatch -
                b.concededPerMatch
        )[0];


    const bestWinRate =
        [...stats].sort(
            (a, b) =>
                b.winRate -
                a.winRate
        )[0];


    const bestStreak =
        [...stats].sort(
            (a, b) =>
                b.winStreak -
                a.winStreak
        )[0];


    const biggestWin =
        getBiggestWin();


    // ======================================
    // PIRE RECORDS
    // ======================================

    const mostLosses =
        [...stats].sort(
            (a, b) =>
                b.losses - a.losses
        )[0];


    const worstAttack =
        [...stats].sort(
            (a, b) =>
                a.goalsPerMatch -
                b.goalsPerMatch
        )[0];


    const worstDefense =
        [...stats].sort(
            (a, b) =>
                b.concededPerMatch -
                a.concededPerMatch
        )[0];


    const worstWinRate =
        [...stats].sort(
            (a, b) =>
                a.winRate -
                b.winRate
        )[0];


    const worstStreak =
        [...stats].sort(
            (a, b) =>
                b.lossStreak -
                a.lossStreak
        )[0];


    const biggestLoss =
        getBiggestLoss();


    // ======================================
    // HALL OF FAME
    // ======================================

    fame.innerHTML = `

        ${hallRecord(
            "👑",
            "Plus de victoires",
            mostWins
                ? mostWins.player
                : "-",
            mostWins
                ? `${mostWins.wins} victoires`
                : "-"
        )}


        ${hallRecord(
            "⚽",
            "Meilleure attaque",
            bestAttack
                ? bestAttack.player
                : "-",
            bestAttack
                ? `${bestAttack.goalsPerMatch.toFixed(2)} buts / match`
                : "-"
        )}


        ${hallRecord(
            "🛡️",
            "Meilleure défense",
            bestDefense
                ? bestDefense.player
                : "-",
            bestDefense
                ? `${bestDefense.concededPerMatch.toFixed(2)} buts encaissés / match`
                : "-"
        )}


        ${hallRecord(
            "📈",
            "Meilleur taux de victoire",
            bestWinRate
                ? bestWinRate.player
                : "-",
            bestWinRate
                ? `${bestWinRate.winRate.toFixed(1)}%`
                : "-"
        )}


        ${hallRecord(
            "🔥",
            "Plus longue série",
            bestStreak
                ? bestStreak.player
                : "-",
            bestStreak
                ? `${bestStreak.winStreak} victoires`
                : "-"
        )}


        ${hallRecord(
            "💥",
            "Plus grosse victoire",
            biggestWin
                ? biggestWin.player
                : "-",
            biggestWin
                ? `${biggestWin.score1} - ${biggestWin.score2} vs ${biggestWin.opponent}`
                : "-"
        )}

    `;


    // ======================================
    // HALL OF SHAME
    // ======================================

    shame.innerHTML = `

        ${hallRecord(
            "💀",
            "Plus de défaites",
            mostLosses
                ? mostLosses.player
                : "-",
            mostLosses
                ? `${mostLosses.losses} défaites`
                : "-"
        )}


        ${hallRecord(
            "🥶",
            "Pire série",
            worstStreak
                ? worstStreak.player
                : "-",
            worstStreak
                ? `${worstStreak.lossStreak} défaites`
                : "-"
        )}


        ${hallRecord(
            "📉",
            "Pire taux de victoire",
            worstWinRate
                ? worstWinRate.player
                : "-",
            worstWinRate
                ? `${worstWinRate.winRate.toFixed(1)}%`
                : "-"
        )}


        ${hallRecord(
            "⚽",
            "Pire attaque",
            worstAttack
                ? worstAttack.player
                : "-",
            worstAttack
                ? `${worstAttack.goalsPerMatch.toFixed(2)} buts / match`
                : "-"
        )}


        ${hallRecord(
            "🧱",
            "Pire défense",
            worstDefense
                ? worstDefense.player
                : "-",
            worstDefense
                ? `${worstDefense.concededPerMatch.toFixed(2)} encaissés / match`
                : "-"
        )}


        ${hallRecord(
            "😭",
            "Plus grosse défaite",
            biggestLoss
                ? biggestLoss.player
                : "-",
            biggestLoss
                ? `${biggestLoss.score1} - ${biggestLoss.score2} vs ${biggestLoss.opponent}`
                : "-"
        )}

    `;

}


// ==========================================
// CARTE D'UN RECORD
// ==========================================

function hallRecord(
    icon,
    title,
    player,
    value
) {

    return `

        <div class="hall-record">

            <div class="hall-record-icon">
                ${icon}
            </div>


            <div class="hall-record-info">

                <span>
                    ${title}
                </span>

                <strong>
                    ${player}
                </strong>

            </div>


            <div class="hall-record-value">
                ${value}
            </div>

        </div>

    `;

}


// ==========================================
// INITIALISATION
// ==========================================

renderHall();
