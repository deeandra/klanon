<script>
	import Avatar from "$lib/components/Avatar.svelte";
	import Modal from "$lib/components/Modal.svelte";
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let data
    export let postData
    export let postType

    let post = postData
    let date
    let postDate

    $: {
        post = postData
        date = new Date(post?.updated_at)
        postDate = date.toLocaleDateString() + " " + date.toLocaleTimeString()
    }

    let isOP
    $: {
        isOP = false;
        if (post?.op_id == data.session.user.id) {
            isOP = true;
        }
    }

    let user_role
    $: {
        user_role = data.user_classes?.find(obj => obj?.class_id == post?.class_id).role
    }


    function handleSave() {
        dispatch('save', {
			post_id: post.post_id
		});
    }


    function handleLike() {
        dispatch('likepost', {
			post_id: post.post_id
		});
    }

    function handleApprove() {
        dispatch('approve', {
			post_id: post.post_id
		});
    }

    function handleDelete() {
        dispatch('delete', {
			post_id: post.post_id
		});
    }

    function handlePin() {
        dispatch('pinpost', {
			post_id: post.post_id
		});
    }

    function handleUnpin() {
        dispatch('unpinpost', {
			post_id: post.post_id
		});
    }

    function handleEdit() {
        dispatch('editpost', {
			post: post
		});
    }

    let postLink = "/me/c/" + post?.class_id + "/p/" + post?.post_id
    $: {
        postLink = "/me/c/" + post?.class_id + "/p/" + post?.post_id
        if (postType == "draft" || postType == "pending" || postType == "post_page") {
            postLink = "#"
        }
    }

    function clickButton(btn_id) {
        const button = document.getElementById(btn_id)
        button.click()
    }

    let badgeColor
    if (post.op_role == "student") {
        badgeColor = "text-base-content"
    }
    else if (post.op_role == "moderator") {
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

</script>

<div class="bg-base-300 w-[95%] max-w-screen-lg rounded-lg mx-auto my-3">
    {#if (post?.is_pinned && postType=="class_page")}
        <div class="w-full h-6 bg-base-300 flex items-center px-5 pt-6 pb-4 rounded-t-lg text-xs font-bold text-gray-600">
            <div class="badge text-gray-600 text-xs">
                <i class="fa-solid fa-thumbtack fa-sm mt-[0.2rem] mr-2"></i>
                PINNED POST
            </div>
        </div>
    {:else if postType!="class_page"}
        <div class="w-full h-6 bg-base-300 flex items-center px-5 pt-6 pb-5 rounded-t-lg text-xs font-bold text-gray-600">
            <a href={"/me/c/"+post?.class_id}><div class="badge text-gray-600 text-xs">
                {post?.class_name.toUpperCase()}
            </div></a>
            {#if postType=="post_page" && post?.is_pinned}
                <div class="badge text-gray-600 text-xs ml-1">
                    <i class="fa-solid fa-thumbtack fa-sm mt-[0.2rem] mr-2"></i>
                    PINNED POST
                </div>
            {/if}
        </div>
    {:else}
        <div class="w-full h-6 bg-base-300 rounded-t-lg">
        </div>
    {/if}

    
    <div class="flex px-6 pb-6">
        <div class="h-full w-24 pr-6 flex flex-col justify-center flex-shrink-0">
            <div class="my-1 w-full flex justify-center">
                <Avatar url={post?.op_avatar_url} username={post?.op_display_name} size="60" supabase={data.supabase}/>
            </div>
            
            {#if postType!="draft" && postType!="pending"}
                <label class="swap mt-6 mb-1 {post?.user_has_liked ? "swap-active" : ""}" on:click={()=>handleLike(post?.post_id)}>
                    <i class="fa-regular fa-heart fa-xl swap-off"></i>
                    <i class="fa-solid fa-heart fa-xl swap-on" style="color: #d1083b;"></i>
                </label>
                <span class="font-semibold block pt-1 w-full text-center">
                    {post?.like_count}
                </span>
            {/if}
        </div>
        
        <div class="mr-2 mb-2 overflow-hidden relative">
            <!-- <div class="absolute top-0 left-0 z-10 w-full h-full bg-gradient-to-t from-base-300"></div> -->
            <h3 class="text-lg font-semibold">{post.title}</h3> 

            <div class="flex items-center my-1">
                {#if postType!="pending" && post.op_anon_status=="none"}
                    <div class="badge {badgeColor} text-xs mr-2">
                        {post.op_role}
                    </div>  
                {/if}
                {#if data.session.user.id == post.op_id}
                    <div class="badge badge-accent badge-outline text-xs mr-2">You</div>
                {/if}
                {#if post.op_anon_status != "none"}
                    <div class="badge badge-accent badge-outline text-xs mr-2">anon</div>
                {/if}
                {#if post.op_anon_status == "partial" && (user_role=="instructor")}
                    <div class="badge badge-accent badge-outline text-xs uppercase font-semibold cursor-pointer" on:mousedown={handleClickSeeAuthor} on:mouseup={handleUnclickSeeAuthor}>Click to See Author's Name</div>
                {/if}
            </div>

            <a data-sveltekit-reload href={postLink}>
                <div class="flex items-center">
                    <div class="text-gray-600 max-w-md truncate">
                        {postType=="pending" ? "Requested " : "Posted"}
                        by {seeAuthor ? post.author_name : post.op_display_name} on {postDate}
                    </div>     
                    
                </div>
                <p>{@html decodeURIComponent(post.content).replace(/\n/g, '<br>')}
                </p>
            </a>
        </div>
    </div>

    <div class="w-full h-10 bg-base-200 flex items-center p-6 rounded-b-lg">
        {#if postType!="draft" && postType!="pending"}
            {#if postType == "post_page"}
                <div class="flex items-center mr-3 p-1 rounded-lg">
                    <i class="fa-regular fa-message pt-[0.1rem]"></i> 
                    <span class="pl-2 text-sm">{post.comment_count} Comments</span>
                </div>
            {:else}
                <div class="flex items-center mr-3 btn-ghost p-1 rounded-lg">
                    <a data-sveltekit-reload href={postLink}>
                        <i class="fa-regular fa-message pt-[0.1rem]"></i> 
                        <span class="pl-2 text-sm">{post.comment_count} Comments</span>
                    </a>
                </div>
            {/if}
            <div class="flex items-center mr-1 btn-ghost p-1 rounded-lg">
                <label class="swap {post.user_has_saved ? "swap-active" : ""}" on:click={()=>handleSave(post.post_id)}>
                    <!-- <input type="checkbox" /> -->
                    <i class="fa-regular fa-bookmark swap-off pt-[0.1rem]"></i>
                    <i class="fa-solid fa-bookmark swap-on pt-[0.1rem]"></i>
                    <span class="pl-[1.35rem] text-sm swap-off">Save</span>
                    <span class="pl-[1.35rem] text-sm swap-on">Saved</span>
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
                        <li><button on:click={handleEdit}>Edit</button></li>
                    {/if}
                    {#if (user_role != "student" || isOP)}
                        <li><button on:click={handleDelete}>Delete</button></li>
                    {/if}
                    {#if postType=="pending"}
                        <li><button on:click={handleApprove}>Approve</button></li>
                    {/if}
                    {#if postType=="class_page" || postType=="post_page"}
                        {#if user_role != "student"}
                            {#if post.is_pinned}
                                <li><button on:click={handleUnpin}>Unpin</button></li>
                            {:else}
                                <li><button on:click={handlePin}>Pin</button></li>
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





<!-- <form action="?/edit" method="POST">
    <input name="post_id" value={post.post_id} class="hidden">
    <button type="submit" class="hidden" id="submit_approval_btn"></button>
</form> -->
