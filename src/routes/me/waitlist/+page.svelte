<script>
	import Post from "$lib/components/Post.svelte";
	import Comment from "$lib/components/Comment.svelte";
    import Modal from "$lib/components/Modal.svelte";

    export let data;

    let posts
    $: posts = data.posts?.map((obj) => ({ id: "p"+obj.post_id, ...obj }))
    let comments
    $: comments = data.comments?.map((obj) => ({ id: "c"+obj.comment_id, ...obj }))

    let uploads = posts?.concat(comments)
    $: {
        uploads = posts?.concat(comments)
        uploads?.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    }

    function handleApprovePost(event) {
        const inputElement = document.getElementById("approve_post_id_input");
        inputElement.value = event.detail.post_id

        const button = document.getElementById("submit_approval_btn")
        button.click()
    }

    function handleApproveComment(event) {
        const inputElement = document.getElementById("approve_comment_id_input");
        inputElement.value = event.detail.post_id

        const button = document.getElementById("submit_comment_approval_btn")
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

</script>


<div class="flex-1 mt-1">

    {#each uploads as upload(upload.id)}
        {#if upload?.comment_id}
            <Comment commentData={upload} commentType="pending" {data} on:approvecomment={handleApproveComment}
            on:deletecomment={handleDeleteComment}/>
        {:else if upload?.post_id}
            <Post postData={upload} postType="pending" {data} 
            on:approve={handleApprovePost}
            on:delete={handleDeletePost}/>
        {/if}
    {/each}
    
</div>
<div class="bg-base-100 text-gray-500 w-[14.3rem] my-4 mr-4 rounded-lg py-2 hidden lg:block"></div>

<form action="?/approve" method="POST">
    <input name="post_id" id="approve_post_id_input" class="hidden">
    <button type="submit" class="hidden" id="submit_approval_btn"></button>
</form>

<form action="?/approvecomment" method="POST">
    <input name="comment_id" id="approve_comment_id_input" class="hidden">
    <button type="submit" class="hidden" id="submit_comment_approval_btn"></button>
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