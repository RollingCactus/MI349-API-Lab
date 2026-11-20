

async function fetchData(){

    try{
        const pokemonName = document.getElementById("pokemonName").value;

        const response = await fetch("https://pokeapi.co/api/v2/pokemon/${pokemonName}");

        if(!response.ok){
            throw new Error("Could not find");

        }

        const data = await response.json();
        console.log(data);

    }
    catch(error){
        console.error(error);
    }
}