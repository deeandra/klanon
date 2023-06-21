<script>
	import Post from "$lib/components/Post.svelte";
    import Modal from "$lib/components/Modal.svelte";

    export let data;

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

</script>


<div class="flex-1 mt-1">

    {#each data.posts as post(post.post_id)}
        <Post postData={post} postType="feed_page" {data} 
        on:save={handleSave} 
        on:likepost={handleLikePost}
        on:delete={handleDeletePost}/>
    {/each}
    
</div>
<div class="bg-base-100 text-gray-500 w-[14.3rem] my-4 mr-4 rounded-lg py-2 hidden lg:block"></div>

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