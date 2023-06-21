<script>
	import Post from "$lib/components/Post.svelte";
    import EditPostModal from "$lib/components/EditPostModal.svelte";
    import EditCommentModal from "$lib/components/EditCommentModal.svelte";
	import Comment from "$lib/components/Comment.svelte";
    import Modal from "$lib/components/Modal.svelte";

    export let data
    export let form
    

    let published = "tab-active"
    let drafts = ""
    let pending = ""

    function handleTabClick(tab) {
        published = ""
        drafts = ""
        pending = ""

        if (tab == "published") {
            published = "tab-active"
        }
        else if (tab == "drafts") {
            drafts = "tab-active"
        }
        else if (tab == "pending") {
            pending = "tab-active"
        }
    }

    let post_tab = ""
    let comment_tab = "tab-active"

    function handleTab2Click(tab) {
        post_tab = ""
        comment_tab = ""

        if (tab == "post_tab") {
            post_tab = "tab-active"
        }
        else if (tab == "comment_tab") {
            comment_tab = "tab-active"
        }
    }

    let published_posts = []
    let draft_posts = []
    let pending_posts = []
    let posts

    $: {
        posts = data.posts
        published_posts = []
        draft_posts = []
        pending_posts = []
        for (let i=0; i<posts?.length; i++) {
            if (data.posts[i].post_status == "published") {
                published_posts.push(posts[i])
            }
            else if (data.posts[i].post_status == "draft") {
                draft_posts.push(posts[i])
            }
            else if (data.posts[i].post_status == "pending") {
                pending_posts.push(posts[i])
            }
        }
    }

    let published_comments = []
    let draft_comments = []
    let pending_comments = []
    let comments

    $: {
        comments = data.comments
        published_comments = []
        draft_comments = []
        pending_comments = []
        for (let i=0; i<comments?.length; i++) {
            if (data.comments[i].comment_status == "published") {
                published_comments.push(comments[i])
            }
            else if (data.comments[i].comment_status == "draft") {
                draft_comments.push(comments[i])
            }
            else if (data.comments[i].comment_status == "pending") {
                pending_comments.push(comments[i])
            }
        }

    }

    // let published_uploads
    // let draft_uploads
    // let pending_uploads 

    // $: published_uploads = [...published_posts, ...published_comments]
    // $: draft_uploads = [...draft_posts, ...draft_comments]
    // $: pending_uploads = [...pending_posts, ...pending_comments]


    function handleLikeComment(event) {
        const inputElement = document.getElementById("like_comment_id_input");
        inputElement.value = event.detail.comment_id

        const button = document.getElementById("submit_like_comment_btn")
        button.click()
    }

    function handleSave(event) {
        const inputElement = document.getElementById("save_id_input");
        inputElement.value = event.detail.post_id

        const button = document.getElementById("submit_save_btn")
        button.click()
    }

    function handleLikePost(event) {
        const inputElement = document.getElementById("like_post_id_input");
        inputElement.value = event.detail.post_id

        const button = document.getElementById("submit_like_post_btn")
        button.click()
    }

    function handleDeletePost(event) {
        const inputElement = document.getElementById("delete_post_id_input");
        inputElement.value = event.detail.post_id

        const button = document.getElementById("toggle_delete_modal")
        button.click()
    }

    function cancelDeletePost() {
        const inputElement = document.getElementById("delete_post_id_input");
        inputElement.value = ""
    }

    function confirmDeletePost() {
        const button = document.getElementById("submit_delete_post_btn")
        button.click()
    }

    function handleDeleteComment(event) {
        const inputElement = document.getElementById("delete_comment_id_input");
        inputElement.value = event.detail.comment_id

        const button = document.getElementById("toggle_delete_comment_modal")
        button.click()
    }

    function cancelDeleteComment() {
        const inputElement = document.getElementById("delete_comment_id_input");
        inputElement.value = ""
    }

    function confirmDeleteComment() {
        const button = document.getElementById("submit_delete_comment_btn")
        button.click()
    }

    let post_to_edit
    function handleEditPost(event) {
        post_to_edit = event.detail.post

        const button = document.getElementById("toggle_edit_post_modal")
        button.click()
    }

    let comment_to_edit
    function handleEditComment(event) {
        comment_to_edit = event.detail.comment

        const button = document.getElementById("toggle_edit_comment_modal")
        button.click()
    }


</script>


<div class="flex-1 mt-4">
    <div class="w-[95%] max-w-screen-lg rounded-lg mx-auto flex">
        <div class="tabs tabs-boxed tabs-secondary p-2 w-full flex justify-between">
            <div>
            <label class="tab {published}" 
                on:click|preventDefault={()=>handleTabClick("published")}>
                Published</label> 
            <label class="tab {drafts}" 
                on:click|preventDefault={()=>handleTabClick("drafts")}>
                Drafts</label> 
            <label class="tab {pending}" 
                on:click|preventDefault={()=>handleTabClick("pending")}>
                Pending</label>
            </div>

            <div>
            <label class="tab {post_tab}" 
                on:click|preventDefault={()=>handleTab2Click("post_tab")}>
                Posts</label> 
            <label class="tab {comment_tab}" 
                on:click|preventDefault={()=>handleTab2Click("comment_tab")}>
                Comments</label> 
            </div>
        </div>

    </div>
    
    <div class={published ? "" : "hidden"}>
        <div class={post_tab ? "" : "hidden"}>
            {#each published_posts as post(post.post_id)}
                <Post postData={post} postType="feed_page" {data} 
                on:save={handleSave} 
                on:likepost={handleLikePost}
                on:delete={handleDeletePost}/>
            {/each}
        </div>

        <div class={comment_tab ? "" : "hidden"}>
            {#each published_comments as comment(comment.comment_id)}
                <Comment commentData={comment} commentType="feed_page" {data}  on:likecomment={handleLikeComment}
                on:deletecomment={handleDeleteComment}/>
            {/each}
        </div>
    </div>

    <div class={drafts ? "" : "hidden"}>
        <div class={post_tab ? "" : "hidden"}>
            {#each draft_posts as post(post.post_id)}
                <Post postData={post} postType="draft" {data}
                on:delete={handleDeletePost}
                on:editpost={handleEditPost}/>
            {/each}
        </div>

        <div class={comment_tab ? "" : "hidden"}>
            {#each draft_comments as comment(comment.comment_id)}
                <Comment commentData={comment} commentType="draft" {data}
                on:deletecomment={handleDeleteComment}
                on:editcomment={handleEditComment}/>
            {/each}
        </div>
    </div>

    <div class={pending ? "" : "hidden"}>
        <div class={post_tab ? "" : "hidden"}>
            {#each pending_posts as post(post.post_id)}
                <Post postData={post} postType="pending" {data}
                on:delete={handleDeletePost}/>
            {/each}
        </div>

        <div class={comment_tab ? "" : "hidden"}>
            {#each pending_comments as comment(comment.comment_id)}
                <Comment commentData={comment} commentType="pending" {data}  on:deletecomment={handleDeleteComment}/>
            {/each}
        </div>
    </div>
    
    
</div>
<div class="bg-base-100 text-gray-500 w-[14.3rem] my-4 mr-4 rounded-lg py-2 hidden lg:block"></div>

<style>
    .tab-active {
        background-color: hsl(var(--b1)) !important;
    }
</style>


<form action="?/likecomment" method="POST">
    <input name="comment_id" id="like_comment_id_input" class="hidden">
    <button type="submit" class="hidden" id="submit_like_comment_btn"></button>
</form>

<form action="?/likepost" method="POST">
    <input name="post_id" id="like_post_id_input" class="hidden">
    <button type="submit" class="hidden" id="submit_like_post_btn"></button>
</form>

<form action="?/save" method="POST">
    <input name="post_id" id="save_id_input" class="hidden">
    <button type="submit" class="hidden" id="submit_save_btn"></button>
</form>



<label for="delete_modal" id="toggle_delete_modal" class="hidden"></label>

<Modal modalId="delete_modal">
    <h3 class="font-bold text-lg">Delete Post</h3>
    <p class="mt-3">
        Are you sure you want to delete this post permanently?
    </p>  

    <div class="modal-action">
        <label for="delete_modal" class="btn btn-primary" on:click={cancelDeletePost}>Cancel</label>
        <button class="btn" on:click={confirmDeletePost}>Delete</button>
    </div>
</Modal>

<form action="?/delete" method="POST">
    <input name="post_id" id="delete_post_id_input" class="hidden">
    <button type="submit" class="hidden" id="submit_delete_post_btn"></button>
</form>


<label for="delete_comment_modal" id="toggle_delete_comment_modal" class="hidden"></label>

<Modal modalId="delete_comment_modal">
    <h3 class="font-bold text-lg">Delete Comment</h3>
    <p class="mt-3">
        Are you sure you want to delete this comment permanently?
    </p>  

    <div class="modal-action">
        <button class="btn btn-primary" on:click={cancelDeleteComment}>Cancel</button>
        <button class="btn" on:click={confirmDeleteComment}>Delete</button>
    </div>
</Modal>


<form action="?/deletecomment" method="POST">
    <input name="comment_id" id="delete_comment_id_input" class="hidden">
    <button type="submit" class="hidden" id="submit_delete_comment_btn"></button>
</form>

<label for="edit_post_modal" id="toggle_edit_post_modal" class="hidden"></label>
{#if data.posts}
<EditPostModal post={post_to_edit ? post_to_edit : posts[0]} {form} {data}></EditPostModal>
{/if}

<label for="edit_comment_modal" id="toggle_edit_comment_modal" class="hidden"></label>

{#if data.comments}
<EditCommentModal comment={comment_to_edit ? comment_to_edit : comments[0]} {form} {data}></EditCommentModal>
{/if}