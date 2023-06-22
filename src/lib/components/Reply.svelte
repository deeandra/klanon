<script>
    import Avatar from '$lib/components/Avatar.svelte'
    export let reply
    export let session_user_id
    export let supabase
    export let user_role


    let badgeColor
    if (reply.op_role == "student") {
        badgeColor = ""
    }
    else if (reply.op_role == "moderator") {
        badgeColor = "badge-primary"
    }
    else {
        badgeColor = "badge-secondary"
    }

    let seeAuthor = false
    function handleClickSeeAuthor() {
        seeAuthor = true
    }

    function handleUnclickSeeAuthor() {
        seeAuthor = false
    }

    function handleLike(comment_id) {
        dispatch('likecomment', {
			comment_id: comment_id
		});
    }

    function handleDelete(comment_id) {
        dispatch('deletecomment', {
			comment_id: comment_id
		});
    }
</script>

<div class="flex py-4">
    <div class="h-full w-16 pr-6 flex flex-col justify-center flex-shrink-0">
        <div class="my-1  w-full flex justify-center">
            <Avatar url={reply.op_avatar_url} username={reply.op_display_name} size="40" {supabase}/>
        </div>
        <label class="swap mt-6 mb-1 
        {reply.user_has_liked ? "swap-active" : ""}" on:click={()=>handleLike(reply.comment_id)}>
            <i class="fa-regular fa-heart fa-xl swap-off"></i>
            <i class="fa-solid fa-heart fa-xl swap-on" style="color: #d1083b;"></i>
        </label>
        <span class="font-semibold block pt-1 w-full text-center">
            {reply.like_count}
        </span>
    </div>

    <div class="mb-2 flex-grow">
        <div class="flex justify-between">
            <div class="flex items-center my-1">
                {#if reply.op_anon_status=="none" && reply.op_role!="student"}
                <div class="badge {badgeColor} text-gray-100 text-xs mr-2">
                        {reply.op_role}
                    </div>  
                {/if}

                {#if session_user_id == reply.op_id}
                    <div class="badge badge-accent badge-outline text-xs mr-2">You</div>
                {/if}

                {#if reply.op_anon_status != "none"}
                    <div class="badge badge-accent badge-outline text-xs mr-2">anon</div>
                {/if}

                {#if reply.op_anon_status == "partial" && (user_role=="instructor")}
                    <div class="badge badge-accent badge-outline text-xs uppercase font-semibold" on:mousedown={handleClickSeeAuthor} on:mouseup={handleUnclickSeeAuthor}>Click to See Author's Name</div>
                {/if}
               
            </div>

            <div class="dropdown dropdown-hover dropdown-bottom dropdown-end">
                <label tabindex="0" class="btn btn-ghost btn-xs m-1">
                    <i class="fa-solid fa-ellipsis fa-lg pt-[0.1rem] px-1"></i>
                </label>
                <ul tabindex="0" class="dropdown-content menu p-1 shadow bg-neutral rounded-box text-sm">
                    {#if (user_role != "student" || session_user_id == reply.op_id)}
                        <li><button on:click={() => handleDelete(reply.comment_id)}>Delete</button></li>
                    {/if}
                </ul>
            </div>
        </div>

        <div>
            <div class="text-gray-600 max-w-md truncate">
                Posted by {seeAuthor ? reply.author_name : reply.op_display_name} on {new Date(reply.updated_at).toLocaleDateString() + " " + new Date(reply.updated_at).toLocaleTimeString()}
            </div>     
        </div>
        <p class="max-w-full">{@html decodeURIComponent(reply.content).replace(/\n/g, '<br>')}
        </p>
    </div>
</div>