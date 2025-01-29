// existing imports and code...

// Add the new game logic
async function startPokemonGame() {
    const pokemon = await getRandomPokemon();
    const pokemonName = pokemon.name;
    const abilities = pokemon.abilities.map(ability => ability.ability.name).join(', ');

    console.log(`Guess the Pokémon with these abilities: ${abilities}`);

    const userGuess = prompt("Enter your guess:");

    if (userGuess.toLowerCase() === pokemonName.toLowerCase()) {
        console.log("Correct! You guessed the Pokémon.");
    } else {
        console.log(`Wrong! The correct answer was ${pokemonName}.`);
    }
}

// Call the new game function instead of the soccer game
startPokemonGame(); 