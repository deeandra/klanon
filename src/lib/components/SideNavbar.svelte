<svelte:head>
    <script src="https://kit.fontawesome.com/c531037e51.js" crossorigin="anonymous"></script>
</svelte:head>

<script>
	import Modal from "$lib/components/Modal.svelte";
    import YourClass from "$lib/components/YourClass.svelte";
</script>
<!-- Sidebar -->
<div class="bg-base-200 text-gray-500 w-[14rem] flex flex-col m-4 rounded-lg py-2">
    <nav class="flex-1">
    <ul class="menu px-2 w-100% h-full bg-base-200 text-gray-500">
        <!-- Sidebar content here -->
        <li><a><i class="fa-solid fa-house"></i>Home</a></li>
        <li><a><i class="fa-solid fa-pen-to-square"></i>My Activity</a></li>
        <li><a><i class="fa-solid fa-bookmark"></i>Saved Posts</a></li>
        <li><a><i class="fa-solid fa-hourglass-start"></i>Waitlist</a></li>
        <li><a><i class="fa-solid fa-chart-simple"></i>Student Activity Stats</a></li>

        <div class="divider px-3"></div>
        <div class="flex items-center justify-between w-[100%]">
            <span class="m-4 font-bold text-xs">YOUR CLASSES</span>
            <li>
                <div class="dropdown dropdown-hover dropdown-right">
                    <button class="mx-4">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                    <ul class="dropdown-content menu p-2 shadow bg-neutral text-neutral-content rounded-box w-36">
                        <label for="join_modal" class="btn text-xs">JOIN</label>
                        <label for="create-class_modal" class="btn text-xs">CREATE NEW</label>
                    </ul>
                </div>
            </li>
        </div>
        <YourClass/>
    </ul>
    </nav>
</div>

<Modal modalId="join_modal">

</Modal>

<Modal modalId="create-class_modal">
    <h3 class="font-bold text-lg">Create A New Class</h3>
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
                <button class="btn">Create</button>
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

