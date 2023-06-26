<svelte:head>
    <script src="https://kit.fontawesome.com/c531037e51.js" crossorigin="anonymous"></script>
</svelte:head>

<script>
	import Modal from "$lib/components/Modal.svelte";
    import YourClass from "$lib/components/YourClass.svelte";
    import { json } from "@sveltejs/kit";
    import { page } from '$app/stores';
	import Avatar from "./Avatar.svelte";

    export let data;
    
    let user_classes = data.user_classes
    let route = data.currentRoute
    let params = $page.params
    const menu_list = ["home", "my-activity", "saved", "waitlist", "student-stats"]
    const menu_classes = ["", "", "", "", ""]
    let regexC

    $: {
        user_classes = data.user_classes
        for (let i = 0; i < user_classes.length; i++) {
            user_classes[i].styles = ""
        }
        route = data.currentRoute
        params = $page.params

        for (let i = 0; i < menu_list.length; i++) {
            menu_classes[i] = ""
            const regex = new RegExp("^\/me\/" + menu_list[i]);
            if (regex.test(route)) {
                menu_classes[i] = "bg-accent text-white";
            }
        }
        regexC = new RegExp("^\/me\/c");
        if (regexC.test(route)) {
            const userClassIndex = user_classes.findIndex(obj => obj.class_id == parseInt(params.class_id))
            // console.log(userClassIndex)
            if(userClassIndex != -1) {
                user_classes[userClassIndex].styles = "bg-accent text-white";
            }
        }
    }

    let user_is_moderator = false
    let user_is_instructor = false

    $: {
        user_is_moderator = false
        user_is_instructor = false
        user_classes = data.user_classes
        for (let i = 0; i < user_classes.length; i++) {
            if (user_classes[i].role == "moderator") {
                user_is_moderator = true
            }
            if (user_classes[i].role == "instructor") {
                user_is_moderator = true
                user_is_instructor = true
            }
        }
    }

    let invitation_code = ""
    let invitation_password = ""
    let join_message = ""
    let class_name = ""
    let class_id = ""
    let join_class_avatar_url = ""

    async function handleContinueJoin() {
        const response = await fetch('/me/join', {
            method: "POST",
            body: JSON.stringify({
                invitation_code: invitation_code,
                invitation_password: invitation_password
            })
        })

        const res = await response.json()
        console.log(res)

        join_message = res.message
        class_name = res.class_name
        class_id = res.class_id
        join_class_avatar_url = res.avatar_url

        if (res.success) {
            let checkbox = document.getElementById('join_modal');
            checkbox.checked = !checkbox.checked;

            checkbox = document.getElementById('continue-join_modal');
            checkbox.checked = !checkbox.checked;
        }
        
    }
</script>

<!-- Sidebar -->
<div class="bg-transparent w-[14.3rem] flex flex-col py-6 ml-4 rounded-lg max-h-full">
</div>

<div class="fixed bg-base-200 text-gray-500 w-[14.3rem] flex flex-col my-4 ml-4 rounded-lg py-2 max-h-full z-50">
    <nav class="flex-1">
    <ul class="menu px-2 w-100% h-full bg-base-200 text-gray-500">
        <!-- Sidebar content here -->
        <li>
            <a data-sveltekit-reload href="/me/home" id="home" class={menu_classes[0]}>
                <i class="fa-solid fa-house w-4"></i>Home
            </a>
        </li>
        <li>
            <a data-sveltekit-reload href="/me/my-activity" id="my-activity" class={menu_classes[1]}>
                <i class="fa-solid fa-pen-to-square w-4"></i>My Activity
            </a>
        </li>
        <li>
            <a data-sveltekit-reload href="/me/saved" id="saved" class={menu_classes[2]}>
                <i class="fa-solid fa-bookmark w-4"></i>Saved Posts
            </a>
        </li>
        {#if user_is_moderator}
        <li>
            <a data-sveltekit-reload href="/me/waitlist" id="saved" class={menu_classes[3]}>
                <i class="fa-solid fa-hourglass-start w-4"></i>Waitlist
            </a>
        </li>
        {/if}
        {#if user_is_instructor}
        <li>
            <a data-sveltekit-reload href="/me/student-stats" id="student-stats" class={menu_classes[4]}>
                <i class="fa-solid fa-chart-simple w-4"></i>Student Engagement
            </a>
        </li>  
        {/if}

        <div class="divider px-3"></div>
        <div class="flex items-center justify-between w-[100%]">
            <span class="m-4 font-bold text-xs">YOUR CLASSES</span>
            <li>
                <div class="dropdown dropdown-hover dropdown-right">
                    <i class="fa-solid fa-plus btn-ghost"></i>
                    <ul class="dropdown-content menu p-2 shadow bg-neutral text-neutral-content rounded-box w-36">
                        <label for="join_modal" class="btn text-xs">JOIN</label>
                        <label for="create-class_modal" class="btn text-xs">CREATE NEW</label>
                    </ul>
                </div>
            </li>
        </div>
        <!-- <div class="w-full max-w-full"> -->
            {#each user_classes as user_class(user_class.class_id)}
                <YourClass {user_class} supabase={data.supabase}/>
            {/each}

        <!-- </div> -->
    </ul>
    </nav>
</div>


<Modal modalId="join_modal">
    <h3 class="font-bold text-lg mb-2 text-white">Join a Classroom</h3>
    <div class="form-control w-full">
        <label class="label mt-1">
            <span class="label-text">Invitation Code</span>
        </label>
        <input name="invitation_code" type="text" placeholder="Type here" class="input input-bordered w-full" bind:value={invitation_code} />

        <label class="label mt-1">
            <span class="label-text">Invitation Password
            </span>
        </label>
        <input name="invitation_password" type="text" placeholder="Type here" class="input input-bordered w-full" bind:value={invitation_password} />

        <p class="mt-3 text-red-600 text-center">{join_message}</p>

        <div class="modal-action">
            <label class="btn btn-accent" on:click={handleContinueJoin}>Continue</label>
        </div>
    </div>
    <!-- <form action="/me/join" method="POST">
        <div class="form-control w-full">
            <label class="label mt-1">
                <span class="label-text">Invitation Code</span>
            </label>
            <input name="invitation_code" type="text" placeholder="Type here" class="input input-bordered w-full" />

            <label class="label mt-1">
                <span class="label-text">Invitation Password
                </span>
            </label>
            <input name="invitation_password" type="text" placeholder="Type here" class="input input-bordered w-full" />

            <div class="modal-action">
                <button class="btn">Continue</button>
            </div>
        </div>
    </form> -->
</Modal>

<Modal modalId="continue-join_modal">
    <!-- <h3 class="font-bold text-lg mb-2">Join a Classroom</h3> -->
    <p class="pt-4 text-center mb-4">You're joining this class:</p> 
    <div class="flex w-full justify-center">
        <div class="w-32">
            <Avatar url={join_class_avatar_url} username={class_name} supabase={data.supabase}></Avatar>
        </div>
    </div>
    <h2 class="text-center font-bold text-2xl m-4 text-white">{class_name}</h2>
    <form action="/me/join/confirm" method="POST">
        <div class="form-control w-full">
            <label class="label mt-1">
                <span class="label-text">Choose a Display Name</span>
            </label>
            <input name="display_name" type="text" value={data.user.full_name} class="input input-bordered w-full" />

            <input type="hidden" name="class_id" value={class_id} class="input input-bordered w-full" />

            <div class="modal-action">
                <button class="btn btn-accent">JOIN</button>
            </div>
        </div>
    </form>
</Modal>

<Modal modalId="create-class_modal">
    <h3 class="font-bold text-lg text-white">Create a New Class</h3>
    <p class="py-4 text-sm">You will automatically be assigned as an instructor when you create a new class. You can change this later by delegating the role to another class member.</p>  
    <form action="/me/create-class" method="POST">
        <div class="form-control w-full">
            <label class="label">
                <span class="label-text">Class Name</span>
            </label>
            <input name="name" type="text" placeholder="Type here" class="input input-bordered w-full" />

            <label class="label mt-1">
                <span class="label-text">Invitation Code
                    <!-- <div class="tooltip tooltip-right" data-tip="">
                        <i class="fa-regular fa-circle-question ml-2"></i>
                    </div> -->
                </span>
            </label>
            <input name="invitation_code" type="text" placeholder="Type here" class="input input-bordered w-full" />

            <label class="label mt-1">
                <span class="label-text">Invitation Password
                    <!-- <div class="tooltip tooltip-right" data-tip="hello">
                        <i class="fa-regular fa-circle-question ml-2"></i>
                    </div> -->
                </span>
            </label>
            <input name="invitation_password" type="text" placeholder="Type here" class="input input-bordered w-full" />

            <label class="label mt-1">
                <span class="label-text">Description</span>
            </label>
            <textarea name="description" class="textarea textarea-bordered w-full text-base" placeholder="Type Here"></textarea>
            
            <div class="modal-action">
                <button class="btn btn-accent">Create</button>
            </div>
        </div>
    </form>
</Modal>

<style>
    ul > :global(li) {
        width: 100%;
    }

    ul > :global(li) > :global(a) {
        width: 100%;
    }
</style>

