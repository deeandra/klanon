<script>
	import Avatar from "$lib/components/Avatar.svelte";
	import Modal from "$lib/components/Modal.svelte";
	import EditPostModal from "./EditPostModal.svelte";

    export let data
    export let postData
    export let postType

    let post = postData
    let date
    let postDate

    $: {
        post = postData
        date = new Date(post?.created_at)
        postDate = date.toLocaleDateString() + " " + date.toLocaleTimeString()
    }

    let isOP
    $: {
        isOP = false;
        if (post.op_id) {
            isOP = true;
        }
    }

    let user_role
    $: {
        user_role = data.user_classes.find(obj => obj.class_id == post.class_id).role
    }

    let user_has_saved
    $: user_has_saved = post.user_has_saved
    let swap_not_saved
    let swap_saved

    $: {
        if (user_has_saved) {
            swap_not_saved = "swap-off"
            swap_saved = "swap-on"
        }
        else {
            swap_not_saved = "swap-on"
            swap_saved = "swap-off"
        }
    }

    async function handleSave() {
        let action
        if (user_has_saved) {
            action = "delete"
        }
        else {
            action = "insert"
        }
        const response = await fetch('/api/save', {
            method: "POST",
            body: JSON.stringify({
                post_id: post.post_id,
                action: action
            })
        })

        const res = await response.json()

        if (res.success) {
            user_has_saved = !user_has_saved
        }
    }

    let user_has_liked
    $: user_has_liked = post.user_has_liked
    let swap_not_liked
    let swap_liked

    $: {
        if (user_has_liked) {
            swap_not_liked = "swap-off"
            swap_liked = "swap-on"
        }
        else {
            swap_not_liked = "swap-on"
            swap_liked = "swap-off"
        }
    }

    async function handleLike() {
        let action
        if (user_has_liked) {
            action = "delete"
        }
        else {
            action = "insert"
        }
        const response = await fetch('/api/like', {
            method: "POST",
            body: JSON.stringify({
                post_id: post.post_id,
                action: action
            })
        })

        const res = await response.json()

        if (res.success) {
            user_has_liked = !user_has_liked
        }
    }

    let postLink = "/c/" + post.class_id + "/p/" + post.post_id
    $: {
        postLink = "/c/" + post.class_id + "/p/" + post.post_id
        if (postType == "draft" || postType == "pending") {
            postLink = "#"
        }
    }

    function clickButton(btn_id) {
        const button = document.getElementById(btn_id)
        button.click()
    }
</script>

<div class="bg-base-300 w-[95%] max-w-screen-lg rounded-lg mx-auto my-3">
    {#if (post.is_pinned && postType=="class_page") }
        <div class="w-full h-6 bg-base-300 flex items-center px-5 pt-6 pb-4 rounded-t-lg text-xs font-bold text-gray-600">
            <div class="badge text-gray-600 text-xs">
                <i class="fa-solid fa-thumbtack fa-sm mt-[0.2rem] mr-2"></i>
                PINNED POST
            </div>
        </div>
    {:else if postType!="class_page"}
        <div class="w-full h-6 bg-base-300 flex items-center px-5 pt-6 pb-5 rounded-t-lg text-xs font-bold text-gray-600">
            <div class="badge text-gray-600 text-xs">
                {post.class_name.toUpperCase()}
            </div>
        </div>
    {:else}
        <div class="w-full h-6 bg-base-300 rounded-t-lg">
        </div>
    {/if}
    
    <div class="flex px-6 pb-6">
        <div class="h-full w-fit pr-6 flex flex-col justify-center">
            <div class="my-1">
                <Avatar url={post.op_avatar_url} username={post.op_display_name} size="60"/>
            </div>
            
            {#if postType!="draft" && postType!="pending"}
                <label class="swap mt-6 mb-1 swap-active" on:click={handleLike}>
                    <i class="fa-regular fa-heart fa-xl {swap_not_liked}"></i>
                    <i class="fa-solid fa-heart fa-xl {swap_liked}" style="color: #d1083b;"></i>
                </label>
                <span class="font-semibold block pt-1 w-full text-center">
                    {post.like_count}
                </span>
            {/if}
        </div>

        <a href={postLink}>
            <div class="mr-2 mb-2 overflow-hidden relative">
                <!-- <div class="absolute top-0 left-0 z-10 w-full h-full bg-gradient-to-t from-base-300"></div> -->
                <h3 class="text-lg font-semibold">{post.title}</h3> 

                <div>
                    {#if postType!="pending"}
                        <div class="badge badge-primary text-gray-100 text-xs font-bold my-2">
                            {post.op_role}
                        </div>  
                    {/if}
                    {#if data.session.user.id == post.op_id}
                        <div class="badge badge-accent badge-outline">You</div>
                    {/if}
                    {#if post.op_anon_status != "none"}
                        <div class="badge badge-accent badge-outline">anon</div>
                    {/if}
                </div>

                <div class="flex items-center">
                    <div class="text-gray-600 max-w-md truncate">
                        {postType=="pending" ? "Requested " : "Posted"}
                        by {post.op_display_name} on {postDate}
                    </div>     
                    
                </div>
                <p>{@html decodeURIComponent(post.content).replace(/\n/g, '<br>')}
                </p>
            </div>
        </a>
    </div>

    <div class="w-full h-10 bg-base-200 flex items-center p-6 rounded-b-lg">
        {#if postType!="draft" && postType!="pending"}
            <div class="flex items-center mr-3 btn-ghost p-1 rounded-lg">
                <a href={postLink}>
                    <i class="fa-regular fa-message pt-[0.1rem]"></i> 
                    <span class="pl-2 text-sm">{post.comment_count} Comments</span>
                </a>
            </div>
            <div class="flex items-center mr-1 btn-ghost p-1 rounded-lg">
                <label class="swap swap-active" on:click={handleSave}>
                    <!-- <input type="checkbox" /> -->
                    <i class="fa-regular fa-bookmark {swap_not_saved} pt-[0.1rem]"></i>
                    <i class="fa-solid fa-bookmark {swap_saved} pt-[0.1rem]"></i>
                    <span class="pl-[1.35rem] text-sm {swap_not_saved}">Save</span>
                    <span class="pl-[1.35rem] text-sm {swap_saved}">Saved</span>
                </label>
            </div>
        {/if}


        {#if (user_role != "student" || isOP)}
            <div class="dropdown dropdown-hover dropdown-right">
                <label tabindex="0" class="btn btn-ghost btn-xs m-1">
                    <i class="fa-solid fa-ellipsis fa-lg pt-[0.1rem] px-1"></i>
                </label>
                <ul tabindex="0" class="dropdown-content menu p-1 shadow bg-neutral rounded-box text-sm">
                    {#if postType=="draft"}
                        <li><button on:click={() => clickButton("toggle_edit_modal")}>Edit</button></li>
                    {/if}
                    {#if (user_role != "student" || isOP)}
                        <li><button on:click={() => clickButton("toggle_delete_modal")}>Delete</button></li>
                    {/if}
                    {#if postType=="pending"}
                        <li><button on:click={() => clickButton("submit_approval_btn")}>Approve</button></li>
                    {/if}
                    {#if postType=="class_page"}
                        {#if user_role != "student"}
                            {#if post.is_pinned}
                                <li><button on:click={() => clickButton("submit_unpin_btn")}>Unpin</button></li>
                            {:else}
                                <li><button on:click={() => clickButton("submit_pin_btn")}>Pin</button></li>
                            {/if}
                            <!-- <li><a>Lock</a></li>
                            <li><a>Archive</a></li> -->
                        {/if}
                    {/if}
                </ul>
            </div>
        {/if}
    </div>
</div>

<label for="delete_modal" id="toggle_delete_modal" class="hidden"></label>

<Modal modalId="delete_modal">
    <h3 class="font-bold text-lg">Delete Post</h3>
    <p class="mt-3">
        Are you sure you want to delete this post permanently?
    </p>  

    <div class="modal-action">
        <button class="btn btn-primary" on:click={()=>clickButton("toggle_delete_modal")}>Cancel</button>
        <button class="btn" on:click={()=>clickButton("submit_delete_btn")}>Delete</button>
    </div>
</Modal>

<form action="?/approve" method="POST">
    <input name="post_id" value={post.post_id} class="hidden">
    <button type="submit" class="hidden" id="submit_approval_btn"></button>
</form>

<!-- <form action="?/edit" method="POST">
    <input name="post_id" value={post.post_id} class="hidden">
    <button type="submit" class="hidden" id="submit_approval_btn"></button>
</form> -->

<form action="?/delete" method="POST">
    <input name="post_id" value={post.post_id} class="hidden">
    <button type="submit" class="hidden" id="submit_delete_btn"></button>
</form>

<form action="?/pin" method="POST">
    <input name="post_id" value={post.post_id} class="hidden">
    <button type="submit" class="hidden" id="submit_pin_btn"></button>
</form>

<form action="?/unpin" method="POST">
    <input name="post_id" value={post.post_id} class="hidden">
    <button type="submit" class="hidden" id="submit_unpin_btn"></button>
</form>

{#if postType=="draft"}
    <label for="edit_modal" id="toggle_edit_modal" class="hidden"></label>
{/if}