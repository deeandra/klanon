<script>
    import Modal from "$lib/components/Modal.svelte";
    import Avatar from "$lib/components/Avatar.svelte";
    import { page } from '$app/stores';

    export let data
    export let form
    export let comment
    export let mode

    

    const adj = ["furry","ferocious","dangerous","poisonous","tame","agile","clever","aggressive","tiny","domestic","wild","herbivorous","carnivorous","Adorable","Aggressive","Agile","Beautiful","Bossy","Candid","Carnivorous","Clever","Cold","Cold-Blooded","Colorful","Cuddly","Curious","Cute","Dangerous","Deadly","Domestic","Dominant","Energetic","Fast","Feisty","Ferocious","Fierce","Fluffy","Friendly","Furry","Fuzzy","Grumpy","Hairy","Heavy","Herbivorous","Jealous","Large","Lazy","Loud","Lovable","Loving","Malicious","Maternal","Mean","Messy","Nocturnal","Noisy","Nosy","Picky","Playful","Poisonous","Quick","Rough","Sassy","Scaly","Short","Shy","Slimy","Slow","Small","Smart","Smelly","Soft","Spikey","Stinky","Strong","Stubborn","Submissive","Tall","Tame","Tenacious","Territorial","Tiny","Vicious","Warm","Wild"]

    const animals = ["Aardvark","Albatross","Alligator","Alpaca","Ant","Anteater","Antelope","Ape","Armadillo","Donkey","Baboon","Badger","Barracuda","Bat","Bear","Beaver","Bee","Bison","Boar","Buffalo","Butterfly","Camel","Capybara","Caribou","Cassowary","Cat","Caterpillar","Cattle","Chamois","Cheetah","Chicken","Chimpanzee","Chinchilla","Chough","Clam","Cobra","Cockroach","Cod","Cormorant","Coyote","Crab","Crane","Crocodile","Crow","Curlew","Deer","Dinosaur","Dog","Dogfish","Dolphin","Dotterel","Dove","Dragonfly","Duck","Dugong","Dunlin","Eagle","Echidna","Eel","Eland","Elephant","Elk","Emu","Falcon","Ferret","Finch","Fish","Flamingo","Fly","Fox","Frog","Gaur","Gazelle","Gerbil","Giraffe","Gnat","Gnu","Goat","Goldfinch","Goldfish","Goose","Gorilla","Goshawk","Grasshopper","Grouse","Guanaco","Gull","Hamster","Hare","Hawk","Hedgehog","Heron","Herring","Hippopotamus","Hornet","Horse","Human","Hummingbird","Hyena","Ibex","Ibis","Jackal","Jaguar","Jay","Jellyfish","Kangaroo","Kingfisher","Koala","Kookabura","Kouprey","Kudu","Lapwing","Lark","Lemur","Leopard","Lion","Llama","Lobster","Locust","Loris","Louse","Lyrebird","Magpie","Mallard","Manatee","Mandrill","Mantis","Marten","Meerkat","Mink","Mole","Mongoose","Monkey","Moose","Mosquito","Mouse","Mule","Narwhal","Newt","Nightingale","Octopus","Okapi","Opossum","Oryx","Ostrich","Otter","Owl","Oyster","Panther","Parrot","Partridge","Peafowl","Pelican","Penguin","Pheasant","Pig","Pigeon","Pony","Porcupine","Porpoise","Quail","Quelea","Quetzal","Rabbit","Raccoon","Rail","Ram","Rat","Raven","Red deer","Red panda","Reindeer","Rhinoceros","Rook","Salamander","Salmon","Sand Dollar","Sandpiper","Sardine","Scorpion","Seahorse","Seal","Shark","Sheep","Shrew","Skunk","Snail","Snake","Sparrow","Spider","Spoonbill","Squid","Squirrel","Starling","Stingray","Stinkbug","Stork","Swallow","Swan","Tapir","Tarsier","Termite","Tiger","Toad","Trout","Turkey","Turtle","Viper","Vulture","Wallaby","Walrus","Wasp","Weasel","Whale","Wildcat","Wolf","Wolverine","Wombat","Woodcock","Woodpecker","Worm","Wren","Yak","Zebra"]

    function capitalizeWords(str) {
        return str?.replace(/\b\w/g, function(match) {
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
        user_display_name = data.user_classes.find(obj => obj.class_id == comment?.class_id).display_name
    } 

    let user_role
    $: {
        user_role = data.user_classes.find(obj => obj.class_id == comment?.class_id).role
    } 

    let user_anon_status
    $: {
        user_anon_status = data.comment_anon_statuses?.find(obj => obj.post_id == comment?.post_id)
        comment.user_anon_status = user_anon_status?.anon_status
        comment.user_pseudonym = user_anon_status?.pseudonym
    } 

    const generated_pseudonym = generatePseudonym()

    let pseudonym 

    $: pseudonym = comment?.user_pseudonym ? comment?.user_pseudonym : (comment?.op_pseudonym ? comment?.op_pseudonym : generated_pseudonym)

    let anon_status = comment?.user_anon_status ? comment?.user_anon_status : comment?.op_anon_status
    let prev_anon_status = comment?.op_anon_status
    $: {
        if (prev_anon_status != comment?.op_anon_status) {
            anon_status = comment?.op_anon_status
            prev_anon_status = comment?.op_anon_status
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
        form.comment_body = ""
        form.comment_message = ""
        form.comment_prediction = ""
    }

    function handleEdit() {
        abusiveAlertMode = ""
        let checkbox = document.getElementById('edit_comment_modal');
        checkbox.checked = !checkbox.checked;
        pseudonym = form.comment_body.pseudonym
        anon_status = form.comment_body.anon_status
    }

    function handleSendMod() {
        const button = document.getElementById("send_comment_to_mod_btn")
        button.click()
    }
</script>

<Modal modalId="edit_comment_modal" mode={mode}>
        
    {#if !comment?.parent_content}
        <div class="badge badge-accent badge-outline text-gray-600 text-sm font-bold mb-2">
            {"COMMENTING IN " + comment?.class_name.toUpperCase()}
        </div>
        <div class="bg-base-100 rounded-lg text-xs font-semibold p-1">
            
            <div class="flex mt-1">
                <div class="mr-1">
                    <Avatar url={comment?.post_op_avatar_url} username={comment?.post_op_display_name} size="40" supabase={data.supabase}/>
                </div>
                <div class="w-[2px] bg-accent my-[2px] ml-2 mr-[0.3rem]"></div>
                <div class="flex flex-col justify-center ml-1">
                    <div class="uppercase font-semibold text-accent mb-1">
                        {comment?.post_op_display_name}
                    </div>
                    <div>
                        {decodeURIComponent(comment?.post_title)}
                    </div>
                </div>
            </div>
        </div>
    {:else}
        <div class="badge badge-accent badge-outline text-gray-600 text-sm font-bold mb-2">
            {"COMMENTING IN " + comment?.class_name.toUpperCase()}
        </div>
        <div class="badge text-xs font-bold text-gray-600">IN REPLY TO</div>
        <div class="bg-base-100 rounded-lg text-xs font-semibold p-1">
            
            <div class="flex mt-1">
                <div class="mr-1">
                    <Avatar url={comment?.parent_op_avatar_url} username={comment?.parent_op_display_name} size="40" supabase={data.supabase}/>
                </div>
                <div class="w-[2px] bg-accent my-[2px] ml-2 mr-[0.3rem]"></div>
                <div class="flex flex-col justify-center ml-1">
                    <div class="uppercase font-semibold text-accent mb-1">
                        {comment?.parent_op_display_name}
                    </div>
                    <div>
                        {decodeURIComponent(comment?.parent_content)}
                    </div>
                </div>
            </div>
        </div>
    {/if}

    <div class="mt-2 text-gray-500 font-semibold text-sm">
        Anonymous mode  
        {#if comment?.user_anon_status}
        <div class="badge badge-primary font-bold badge-outline uppercase">
            {comment?.user_anon_status}
        </div>
        {/if}
    </div>
    {#if !comment?.user_anon_status}
        <div class="flex items-center mt-1">
            <label>
                <input type="radio" name="anon_status" bind:group={anon_status} 
                value={"none"} class="radio radio-xs radio-primary mr-2" checked/>
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
    {/if}

    <div class="flex mt-2 items-center text-sm">
        <span class="text-gray-500 font-semibold">Commenting as</span>
        <div class="badge badge-primary ml-2">{display_name}</div>
        {#if anon_status!="none"}
            <div class="badge badge-accent badge-outline ml-2">anon</div>
        {/if}
    </div>

    
    <div class="form-control w-full">
        <form action="?/commentedit" method="POST" id="comment_edit_form">
            <textarea name="content" class="bg-base-200 textarea w-full text-base mt-4 h-48" placeholder="Content" value={form?.comment_body?.content ? form.comment_body.content : decodeURIComponent(comment?.content)}></textarea>

            <input name="comment_id" class="hidden" value={comment?.comment_id}/>
            <input name="post_id" class="hidden" value={comment?.post_id}/>
            <input name="parent_id" class="hidden" value={comment?.parent_id ? comment?.parent_id : null}/>
            <input name="anon_status" class="hidden" value={anon_status}/>
            <input name="pseudonym" class="hidden" value={display_name}/>
            <input name="role" class="hidden" value={user_role}/>
            
            <div class="modal-action">
                <button name="comment_status" value="draft" class="btn">Save As Draft</button>
                <button name="comment_status" value="published" class="btn btn-primary">Post</button>
                <button name="comment_status" value="pending" class="btn btn-primary hidden" id="send_comment_to_mod_btn">Post</button>
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
        <button class="btn" on:click={handleEdit}>Edit Comment</button>
        <button class="btn btn-primary" on:click={handleSendMod}>Send to Moderator</button>
    </div>
</Modal>