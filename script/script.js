//https://api.meteo-concept.com/api/ephemeride/0?token=930d5117f78ec1fa8f9368f75d745d99b76195c4b473e092ba6a1bb713ec3f14

// Ajout d'un écouteur d'événement sur l'input du code postal pour surveiller les modifications
document.getElementById('cp').addEventListener('input', function() {
    const codePostal = this.value;
    if (codePostal.length === 5 && !isNaN(codePostal)) {
        obtenirVilles(codePostal); // Remplir la liste des villes lorsque le code postal est valide
    } else {
        viderVilles(); // Vider la liste des villes si le code postal est invalide
    }
});

// Fonction pour obtenir la liste des communes à partir du code postal
function obtenirVilles(cp) {
    fetch(`https://geo.api.gouv.fr/communes?codePostal=${cp}&fields=nom&format=json&geometry=centre`)
        .then(response => response.json())
        .then(data => {
            const selectVille = document.getElementById('CV');
            selectVille.innerHTML = '<option value=""> --Choix de la ville--</option>'; // Réinitialiser la liste
            data.forEach(commune => {
                const option = document.createElement('option');
                option.value = commune.code; // On stocke le code INSEE pour l'appel API météo
                option.textContent = commune.nom;
                selectVille.appendChild(option);
            });
            // Activer la liste des villes si elle est désactivée
            selectVille.disabled = false;
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des communes:', error);
        });
}

// Fonction pour vider la liste des villes
function viderVilles() {
    const selectVille = document.getElementById('CV');
    selectVille.innerHTML = '<option value=""> --Choix de la ville--</option>';
    selectVille.disabled = true; // Désactiver la liste des villes
}

// Ajout d'un écouteur d'événement sur le bouton Rechercher
document.getElementById('recherche').addEventListener('click', function() {
    const ville = document.getElementById('CV').value;
    if (ville) {
        obtenirMeteo(ville); // Appel à l'API météo si une ville est sélectionnée
    } else {
        alert('Veuillez sélectionner une ville.');
    }
});

// Fonction pour obtenir les données météorologiques via l'API MétéoConcept
function obtenirMeteo(codeINSEE) {
    const apiKey = 'https://api.meteo-concept.com/api/ephemeride/0?token=930d5117f78ec1fa8f9368f75d745d99b76195c4b473e092ba6a1bb713ec3f14'; // Remplacer par votre clé API
    fetch(`https://api.meteo-concept.com/api/forecast/daily?token=${apiKey}&insee=${codeINSEE}`)
        .then(response => response.json())
        .then(data => {
            afficherMeteo(data.forecast);
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données météo:', error);
        });
}

// Fonction pour afficher les informations météo sur la page
function afficherMeteo(meteo) {
    const divValeur = document.getElementById('valeur');
    divValeur.innerHTML = `
        <p>Température minimale : ${meteo.tmin} °C</p>
        <p>Température maximale : ${meteo.tmax} °C</p>
        <p>Probabilité de pluie : ${meteo.probarain} %</p>
        <p>Nombre d'heures d'ensoleillement : ${meteo.sun_hours} h</p>
    `;
}

// Désactiver la liste des villes par défaut
document.getElementById('CV').disabled = true;

