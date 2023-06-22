<script>
    import Modal from "$lib/components/Modal.svelte";
    import { page } from '$app/stores';

    export let post
    export let form
    export let data

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


    let display_name = ""
    let user_display_name

    $: {
        user_display_name = data.user_classes.find(obj => obj.class_id == post?.class_id).display_name
    } 

    let user_role
    $: {
        user_role = data.user_classes.find(obj => obj.class_id == post?.class_id).role
    } 

    const generated_pseudonym = generatePseudonym()

    let pseudonym 

    $: pseudonym = post?.op_pseudonym ? post?.op_pseudonym : generated_pseudonym

    let anon_status = post?.op_anon_status
    let prev_anon_status = post?.op_anon_status
    $: {
        if (prev_anon_status != post?.op_anon_status) {
            anon_status = post?.op_anon_status
            prev_anon_status = post?.op_anon_status
        }
    }

    $: {
        if(anon_status == "none") {
            display_name = user_display_name
        }
        else {
            display_name = pseudonym
        }
        
    }

    let abusiveAlertMode = ""

    $: {
        if (form?.message == "abusive language detected") {
            abusiveAlertMode = "modal-open"
        }
    }

    function handleCancel() {
        abusiveAlertMode = ""
        form.body = ""
        form.message = ""
        form.prediction = ""
    }

    function handleEdit() {
        abusiveAlertMode = ""
        let checkbox = document.getElementById('edit_post_modal');
        checkbox.checked = !checkbox.checked;
        pseudonym = form.body.pseudonym
        anon_status = form.body.anon_status
    }

    function handleSendMod() {
        const button = document.getElementById("send_to_mod_btn")
        button.click()
    }
</script>

<Modal modalId="edit_post_modal" mode="">
    <div class="badge badge-accent badge-outline text-gray-600 font-bold truncate">
        {"POSTING IN " + post?.class_name.toUpperCase()}
    </div>
    <div class="mt-3">Anonymous mode :</div>
    <div class="flex items-center mt-1 mb-2">
        <label>
            <input type="radio" name="anon_status" bind:group={anon_status} 
            value={"none"} class="radio radio-xs radio-primary mr-2" />
            none
        </label>
        <label>
            <input type="radio" name="anon_status" bind:group={anon_status} 
            value={"full"} class="radio radio-xs radio-primary mr-2 ml-4" />
            full
        </label>
        <label>
            <input type="radio" name="anon_status" bind:group={anon_status} 
            value={"partial"} class="radio radio-xs radio-primary mr-2 ml-4" />
            partial
        </label>
    </div>

    <div class="flex mt-1 mb-1 items-center">
        <span>Posting as</span>
        <div class="badge badge-primary ml-2">{display_name}</div>
        {#if anon_status!="none"}
            <div class="badge border-gray-100 text-gray-100 badge-outline ml-2">anon</div>
        {/if}
    </div>
    
    <div class="form-control w-full">
        <form action="?/postedit" method="POST" id="post_edit_form">
            <input name="title" type="text" placeholder="Title" 
                class="input w-full bg-base-200 mt-4" 
                value={form?.body?.title ? form.body.title : post?.title} />

            <textarea name="content" placeholder="Content"
                class="bg-base-200 textarea w-full text-base mt-4 h-48"  
                value={form?.body?.content ? form.body.content : decodeURIComponent(post?.content)}></textarea>

            <input name="class_id" class="hidden" value={post?.class_id}/>
            <input name="anon_status" class="hidden" value={anon_status}/>
            <input name="pseudonym" class="hidden" value={display_name}/>
            <input name="post_id" class="hidden" value={post?.post_id}/>
            <input name="role" class="hidden" value={user_role}/>
            
            <div class="modal-action">
                <button name="post_status" value="draft" class="btn">Save As Draft</button>
                <button name="post_status" value="published" class="btn btn-primary">Post</button>
                <button name="post_status" value="pending" class="btn btn-primary hidden" id="send_to_mod_btn">Post</button>
            </div>
        </form>
    </div>
    
</Modal>

<Modal modalId="abusive_alert" mode={abusiveAlertMode}>
    <h3 class="font-bold text-lg">
        Abusive Language Detected!
    </h3>
    <div class="mt-3">
        The automatic moderation system has detected that your post may contain abusive language. You can choose to cancel, edit, or send your post to the moderator and wait for approval.
    </div>
    <div class="modal-action">
        <button class="btn" on:click={handleCancel}>Cancel</button>
        <button class="btn" on:click={handleEdit}>Edit Post</button>
        <button class="btn btn-primary" on:click={handleSendMod}>Send to Moderator</button>
    </div>
</Modal>

