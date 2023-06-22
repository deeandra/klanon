<script>
	import Avatar from "$lib/components/Avatar.svelte";
	import Modal from "$lib/components/Modal.svelte";
    import Reply from "$lib/components/Reply.svelte";
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let data
    export let commentData
    export let commentType

    let comment = commentData
    let date
    let commentDate

    $: {
        comment = commentData
        date = new Date(comment?.updated_at)
        commentDate = date.toLocaleDateString() + " " + date.toLocaleTimeString()
    }

    let isOP
    $: {
        isOP = false;
        if (comment.op_id) {
            isOP = true;
        }
    }

    let user_role
    $: {
        user_role = data.user_classes.find(obj => obj.class_id == comment.class_id).role
    }


    function handleLike(comment_id) {
        dispatch('likecomment', {
			comment_id: comment_id
		});
    }

    function clickButton(btn_id) {
        const button = document.getElementById(btn_id)
        button.click()
    }

    function handleClickReply() {
		dispatch('reply', {
			parent_comment: comment
		});
	}

    function handleApprove(comment_id) {
        dispatch('approvecomment', {
			comment_id: comment_id
		});
    }

    function handleDelete(comment_id) {
        dispatch('deletecomment', {
			comment_id: comment_id
		});
    }

    function handlePin() {
        dispatch('pincomment', {
			comment_id: comment.comment_id
		});
    }

    function handleUnpin() {
        dispatch('unpincomment', {
			comment_id: comment.comment_id
		});
    }

    function handleEdit() {
        dispatch('editcomment', {
			comment: comment
		});
    }

    let arrow = "down"
    let repliesDiv = "hidden"

    function toggleReplies() {
        if (arrow == "up") {
            arrow = "down"
            repliesDiv = "hidden"
        }
        else if (arrow == "down") {
            arrow = "up"
            repliesDiv = ""
        }
    }

    let badgeColor
    if (comment.op_role == "student") {
        badgeColor = ""
    }
    else if (comment.op_role == "moderator") {
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

    function handleLikeReply(event) {
        dispatch('likecomment', {
			comment_id: event.detail.comment_id
		});
    }

    function handleDeleteReply(event) {
        dispatch('deletecomment', {
			comment_id: event.detail.comment_id
		});
    }
</script>

<div class="{commentType=="pending" ? "bg-base-300" : "bg-base-200"} w-[95%] max-w-screen-lg rounded-lg mx-auto my-3">
    {#if (comment.is_pinned && commentType=="post_page")}
        <div class="w-full h-6 bg-base-200 flex items-center px-5 pt-6 pb-4 rounded-t-lg text-xs font-bold text-gray-600">
            <div class="badge text-gray-600 text-xs">
                <i class="fa-solid fa-thumbtack fa-sm mt-[0.2rem] mr-2"></i>
                PINNED COMMENT
            </div>
        </div>
    {:else if commentType!="post_page"}
        <div class="w-full h-28 {commentType=="pending" ? "bg-base-300" : "bg-base-200"} flex flex-col justify-end px-5 pt-4 pb-3 rounded-t-lg text-xs text-gray-600">
            <a href="/me/c/{comment.class_id}/p/{comment.post_id}">
                <div class="flex p-2 bg-base-300 rounded-lg mb-2">
                    <div class="w-[2px] bg-accent my-[2px] ml-2 mr-[0.5rem]"></div>
                    <div class="flex flex-col">
                        <div class="uppercase font-semibold text-accent">
                            {comment.post_op_display_name}
                        </div>
                        <div class="font-semibold text-sm">
                            {decodeURIComponent(comment.post_title)}
                        </div>
                    </div>
                </div>
            </a>
            <div class="flex items-center">
                <div class="badge text-gray-600 text-xs font-bold">
                    {comment.class_name.toUpperCase()}
                </div>
                <div class="badge badge-outline ml-1">comment</div>
            </div>
        </div>
        <!-- <div class="w-full h-6 bg-base-200 flex items-center px-5 pt-6 pb-5 rounded-t-lg text-xs font-bold text-gray-600">
            <div class="badge text-gray-600 text-xs">
                <i class="fa-solid fa-thumbtack fa-sm mt-[0.2rem] mr-2"></i>
                {comment.class_name.toUpperCase()}
            </div>
        </div> -->
    {:else}
        <div class="w-full bg-base-200 flex items-center px-5 pt-4 pb-4 rounded-t-lg text-xs text-gray-600">
        </div>
    {/if}

    
    <div class="flex px-6 pb-6">
        <div class="h-full w-24 pr-6 flex flex-col justify-center flex-shrink-0">
            <div class="my-1 w-full flex justify-center">
                <Avatar url={comment.op_avatar_url} username={comment.op_display_name} size="60" supabase={data.supabase}/>
            </div>
            {#if commentType!="pending" && commentType!="draft"}
                <label class="swap mt-6 mb-1 {comment.user_has_liked ? "swap-active" : ""}" on:click={()=>handleLike(comment.comment_id)}>
                    <i class="fa-regular fa-heart fa-xl swap_off"></i>
                    <i class="fa-solid fa-heart fa-xl swap-on" style="color: #d1083b;"></i>
                </label>
                <span class="font-semibold block pt-1 w-full text-center">
                    {comment.like_count}
                </span>
            {/if}
        </div>

        <div class="mr-2 mb-2 flex-grow">
            <div class="flex justify-between">
                <div class="flex items-center my-1">
                    {#if commentType!="pending" && comment.op_anon_status=="none" && comment.op_role!="student"}
                    <div class="badge {badgeColor} text-gray-100 text-xs mr-2">
                            {comment.op_role}
                        </div>  
                    {/if}
 
                    {#if data.session.user.id == comment.op_id}
                        <div class="badge badge-accent badge-outline text-xs mr-2">You</div>
                    {/if}

                    {#if comment.op_anon_status != "none"}
                        <div class="badge badge-accent badge-outline text-xs mr-2">anon</div>
                    {/if}

                    {#if comment.op_anon_status == "partial" && (user_role=="instructor")}
                        <div class="badge badge-accent badge-outline text-xs uppercase font-semibold" on:mousedown={handleClickSeeAuthor} on:mouseup={handleUnclickSeeAuthor}>Click to See Author's Name</div>
                    {/if}
                   
                </div>

                {#if commentType!="pending"}
                <div class="dropdown dropdown-hover dropdown-bottom dropdown-end">
                    <label tabindex="0" class="btn btn-ghost btn-xs m-1">
                        <i class="fa-solid fa-ellipsis fa-lg pt-[0.1rem] px-1"></i>
                    </label>
                    <ul tabindex="0" class="dropdown-content menu p-1 shadow bg-neutral rounded-box text-sm">
                        {#if commentType=="post_page"}
                        <li><button on:click={handleClickReply}>Reply</button></li>
                        {/if}
                        {#if commentType=="draft"}
                            <li><button on:click={handleEdit}>Edit</button></li>
                        {/if}
                        {#if (user_role != "student" || isOP)}
                            <li><button on:click={()=>handleDelete(comment.comment_id)}>Delete</button></li>
                        {/if}
                        {#if commentType=="pending" && user_role!="student"}
                            <li><button on:click={() => handleApprove(comment.comment_id)}>Approve</button></li>
                        {/if}
                        {#if commentType=="class_page" || commentType=="post_page"}
                            {#if user_role != "student"}
                                {#if comment.is_pinned}
                                    <li><button on:click={handlePin}>Unpin</button></li>
                                {:else}
                                    <li><button on:click={handleUnpin}>Pin</button></li>
                                {/if}
                                <!-- <li><a>Lock</a></li>
                                <li><a>Archive</a></li> -->
                            {/if}
                        {/if}
                    </ul>
                </div>
                {/if}
            </div>

            <div>
                <div class="text-gray-600 max-w-md truncate">
                    {commentType=="pending" ? "Requested " : "Posted"}
                    by {seeAuthor ? comment.author_name : comment.op_display_name} on {commentDate}
                </div>     
            </div>
            <p>{@html decodeURIComponent(comment.content).replace(/\n/g, '<br>')}
            </p>
            {#if commentType=="post_page"}
            <div class="w-full h-6 pt-6 pb-3 flex items-center font-semibold text-accent" on:click={toggleReplies}>
                {comment.reply_count} replies
                <i class="fa-solid fa-angle-{arrow} fa-sm mt-1 ml-2"></i>
            </div>
            <div class="{repliesDiv} ">
                {#each data.comments as reply(reply.comment_id)}
                    {#if reply.parent_id == comment.comment_id}
                        <Reply {reply} supabase={data.supabase} {user_role} session_user_id={data.session.user.id}
                        on:likecomment={handleLikeReply}
                        on:deletecomment={handleDeleteReply}></Reply>
                    {/if}
                {/each}

            </div>
            {/if}
        </div>
    </div> 
    {#if commentType=="pending"}
        <div class="w-full h-10 bg-base-200 flex items-center p-6 rounded-b-lg">
            {#if (user_role != "student" || isOP)}
                <div class="dropdown dropdown-hover dropdown-right">
                    <label tabindex="0" class="btn btn-ghost btn-xs m-1">
                        <i class="fa-solid fa-ellipsis fa-lg pt-[0.1rem] px-1"></i>
                    </label>
                    <ul tabindex="0" class="dropdown-content menu p-1 shadow bg-neutral rounded-box text-sm">
                        {#if (user_role != "student" || isOP)}
                            <li><button on:click={() => handleDelete(comment.comment_id)}>Delete</button></li>
                        {/if}
                        {#if commentType=="pending" && user_role!="student"}
                            <li><button on:click={() => handleApprove(comment.comment_id)}>Approve</button></li>
                        {/if}
                    </ul>
                </div>
            {/if}
        </div>   
    {/if}
</div>


<!-- <form action="?/edit" method="POST">
    <input name="post_id" value={post.post_id} class="hidden">
    <button type="submit" class="hidden" id="submit_approval_btn"></button>
</form> -->



