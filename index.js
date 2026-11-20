
async function fetchData() {

    const pokemonName = document
        .getElementById("pokemonName")
        .value.trim().toLowerCase();

    const nameElement = document.getElementById("name");
    const imgElement = document.getElementById("pokemonSprite");
    const statsElement = document.getElementById("stats");
    const locationsElement = document.getElementById("locations");

    if (!pokemonName) {
        alert("Please enter a Pokemon name!");
        return;
    }

    nameElement.textContent = "Loading...";
    imgElement.style.display = "none";
    statsElement.innerHTML = "";
    locationsElement.textContent = "Searching for locations...";

    try {

        // GET POKEMON INFORMATION

        const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
        );

        if (!response.ok) {
            throw new Error("Pokemon not found!");
        }

        const data = await response.json();

        // DISPLAY NAME

        nameElement.textContent =
            data.name.charAt(0).toUpperCase() + data.name.slice(1);

        // DISPLAY SPRITE

        imgElement.src = data.sprites.front_default;
        imgElement.style.display = data.sprites.front_default
            ? "block"
            : "none";

        // DISPLAY STATS

        statsElement.innerHTML = "<h3>Pokemon Stats</h3>";

        data.stats.forEach(stat => {

            const statDiv = document.createElement("div");

            statDiv.className = "stat";

            statDiv.textContent =
                `${stat.stat.name.toUpperCase()}: ${stat.base_stat}`;

            statsElement.appendChild(statDiv);

        });

        // GET POKEMON LOCATIONS

        await findPokemonLocation(pokemonName);

    }
    catch(error) {

        nameElement.textContent = "Pokemon Not Found!";
        imgElement.style.display = "none";
        statsElement.innerHTML = "";
        locationsElement.textContent = error.message;

        console.error(error);

    }

}


// FIND POKEMON LOCATIONS

async function findPokemonLocation(pokemonName) {

    const locationsElement = document.getElementById("locations");

    try {

        const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${pokemonName}/encounters`
        );

        if (!response.ok) {
            throw new Error("Could not find locations.");
        }

        const locations = await response.json();

        locationsElement.innerHTML = "";

        if (locations.length === 0) {

            locationsElement.textContent =
                "No encounter locations found for this Pokemon.";

            return;

        }

        locations.forEach(location => {

            const locationDiv = document.createElement("div");

            locationDiv.className = "location";

            const locationName =
                location.location_area.name.replaceAll("-", " ");

            const heading = document.createElement("h3");
            heading.textContent = locationName;

            locationDiv.appendChild(heading);

            location.version_details.forEach(version => {

                const gameName = version.version.name;

                const methods = version.encounter_details.map(
                    encounter => encounter.method.name.replaceAll("-", " ")
                );

                const gameInfo = document.createElement("p");

                gameInfo.textContent =
                    `Game: ${gameName} | Method: ${[...new Set(methods)].join(", ")}`;

                locationDiv.appendChild(gameInfo);

            });

            locationsElement.appendChild(locationDiv);

        });

    }
    catch(error) {

        locationsElement.textContent =
            "Unable to retrieve Pokemon locations.";

        console.error(error);

    }

}
