<script>
    import Modal from "$lib/components/Modal.svelte";
    import { page } from '$app/stores';

    const adj = ["furry","ferocious","dangerous","poisonous","tame","agile","clever","aggressive","tiny","domestic","wild","herbivorous","carnivorous","Adorable","Aggressive","Agile","Beautiful","Bossy","Candid","Carnivorous","Clever","Cold","Cold-Blooded","Colorful","Cuddly","Curious","Cute","Dangerous","Deadly","Domestic","Dominant","Energetic","Fast","Feisty","Ferocious","Fierce","Fluffy","Friendly","Furry","Fuzzy","Grumpy","Hairy","Heavy","Herbivorous","Jealous","Large","Lazy","Loud","Lovable","Loving","Malicious","Maternal","Mean","Messy","Nocturnal","Noisy","Nosy","Picky","Playful","Poisonous","Quick","Rough","Sassy","Scaly","Short","Shy","Slimy","Slow","Small","Smart","Smelly","Soft","Spikey","Stinky","Strong","Stubborn","Submissive","Tall","Tame","Tenacious","Territorial","Tiny","Vicious","Warm","Wild"]

    const animals = ["Aardvark","Albatross","Alligator","Alpaca","Ant","Anteater","Antelope","Ape","Armadillo","Donkey","Baboon","Badger","Barracuda","Bat","Bear","Beaver","Bee","Bison","Boar","Buffalo","Butterfly","Camel","Capybara","Caribou","Cassowary","Cat","Caterpillar","Cattle","Chamois","Cheetah","Chicken","Chimpanzee","Chinchilla","Chough","Clam","Cobra","Cockroach","Cod","Cormorant","Coyote","Crab","Crane","Crocodile","Crow","Curlew","Deer","Dinosaur","Dog","Dogfish","Dolphin","Dotterel","Dove","Dragonfly","Duck","Dugong","Dunlin","Eagle","Echidna","Eel","Eland","Elephant","Elk","Emu","Falcon","Ferret","Finch","Fish","Flamingo","Fly","Fox","Frog","Gaur","Gazelle","Gerbil","Giraffe","Gnat","Gnu","Goat","Goldfinch","Goldfish","Goose","Gorilla","Goshawk","Grasshopper","Grouse","Guanaco","Gull","Hamster","Hare","Hawk","Hedgehog","Heron","Herring","Hippopotamus","Hornet","Horse","Human","Hummingbird","Hyena","Ibex","Ibis","Jackal","Jaguar","Jay","Jellyfish","Kangaroo","Kingfisher","Koala","Kookabura","Kouprey","Kudu","Lapwing","Lark","Lemur","Leopard","Lion","Llama","Lobster","Locust","Loris","Louse","Lyrebird","Magpie","Mallard","Manatee","Mandrill","Mantis","Marten","Meerkat","Mink","Mole","Mongoose","Monkey","Moose","Mosquito","Mouse","Mule","Narwhal","Newt","Nightingale","Octopus","Okapi","Opossum","Oryx","Ostrich","Otter","Owl","Oyster","Panther","Parrot","Partridge","Peafowl","Pelican","Penguin","Pheasant","Pig","Pigeon","Pony","Porcupine","Porpoise","Quail","Quelea","Quetzal","Rabbit","Raccoon","Rail","Ram","Rat","Raven","Red deer","Red panda","Reindeer","Rhinoceros","Rook","Salamander","Salmon","Sand Dollar","Sandpiper","Sardine","Scorpion","Seahorse","Seal","Shark","Sheep","Shrew","Skunk","Snail","Snake","Sparrow","Spider","Spoonbill","Squid","Squirrel","Starling","Stingray","Stinkbug","Stork","Swallow","Swan","Tapir","Tarsier","Termite","Tiger","Toad","Trout","Turkey","Turtle","Viper","Vulture","Wallaby","Walrus","Wasp","Weasel","Whale","Wildcat","Wolf","Wolverine","Wombat","Woodcock","Woodpecker","Worm","Wren","Yak","Zebra"]

    function capitalizeWords(str) {
        return str.replace(/\b\w/g, function(match) {
            return match.toUpperCase();
        });
    }

    function generatePseudonym() {
        var adj_i = Math.floor(Math.random() * (adj.length + 1 - 0));
        var animal_i = Math.floor(Math.random() * (animals.length + 1 - 0));

        return capitalizeWords(adj[adj_i]) + " " + capitalizeWords(animals[animal_i])
    }

    export let data
    let anon_status = "none"
    let post_status = ""
    const pseudonym = generatePseudonym()

    let display_name = ""

    $: {
        if(anon_status == "none") {
            display_name = data.thisClass.user_class[0].display_name
        }
        else {
            display_name = pseudonym
        }
    }

    async function handlePost() {
        post_status = "published"
        const form = document.getElementById("postForm");
        const formData = new FormData(form);

        const response = await fetch('/api/post', {
            method: "POST",
            body: formData
        })

        const res = await response.json()
        console.log(res)

        if (res.success) {
            let checkbox = document.getElementById('create_post_modal');
            checkbox.checked = !checkbox.checked;
        }
        
    }
</script>

<label for="create_post_modal" class="fixed z-20 btn btn-primary bottom-6 right-6 text-white py-2 px-4 rounded-full shadow-md">Create Post</label>

<Modal modalId="create_post_modal" mode="bg-white">
    <h3 class="font-bold text-lg">Posting on <strong>{data.thisClass.name}</strong></h3>
    <!-- <p class="py-4 text-sm">as</p> -->
    <!-- <div class="flex">
        <span>Posting on:</span>
        <div class="badge badge-primary inline ml-2">Pengantar Teknik Komputer</div>
    </div> -->
    <div class="mt-3">Anonymous mode :</div>
    <div class="flex items-center mt-3">
        <input type="radio" name="radio-1" bind:group={anon_status} value="none" 
            class="radio radio-xs radio-primary mr-2" checked/>none
        <input type="radio" name="radio-1" bind:group={anon_status} value="full"
            class="radio radio-xs radio-primary mr-2 ml-4" />full
        <input type="radio" name="radio-1" bind:group={anon_status} value="partial"
            class="radio radio-xs radio-primary mr-2 ml-4" />partial
    </div>

    <div class="flex mt-3 mb-2 items-center">
        <span>Posting as</span>
        <div class="badge badge-primary ml-2">{display_name}</div>
        {#if anon_status!="none"}
            <div class="badge badge-accent badge-outline ml-2">anon</div>
        {/if}
    </div>
    
    <form id="postForm">
        <div class="form-control w-full">
            <input name="title" type="text" placeholder="Title" class="input w-full bg-base-200 mt-4" />

            <textarea name="content" class="bg-base-200 textarea w-full text-base mt-4 h-48" placeholder="Content"></textarea>

            <input name="class_id" type="hidden" value={$page.params.class_id}/>
            <input name="anon_status" type="hidden" value={anon_status}/>
            <input name="pseudonym" type="hidden" value={display_name}/>
            <input name="post_status" type="hidden" value={post_status}/>
            
            <div class="modal-action">
                <button class="btn" on:click|preventDefault={handlePost}>Save As Draft</button>
                <button class="btn btn-primary" on:click|preventDefault={handlePost}>Post</button>
            </div>
        </div>
    </form>
</Modal>