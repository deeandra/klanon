<script>
	import Comment from "$lib/components/Comment.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import Post from "$lib/components/Post.svelte";
    import CreateCommentModal from "$lib/components/CreateCommentModal.svelte";

    export let data
    export let form

    let pinned_comments = []
    let comments = []
    let replies = []

    $: {
        comments = []
        pinned_comments = []
        for (let i=0; i<data.comments.length; i++) {
            if (data.comments[i].is_pinned) {
                pinned_comments.push(data.comments[i])
            }
            else {
                if(data.comments[i].parent_id) {
                    replies.push(data.comments[i])
                }
                else {
                    comments.push(data.comments[i])
                }
            }
        }
    }

    let parent_comment = data.comments[0]

    $: parent_comment = data.comments[0]

    function handleAddComment() {
        parent_comment = ""
        const button = document.getElementById("toggle_comment_modal")
        button.click()
    }

    function handleClickReply(event) {
        parent_comment = event.detail.parent_comment
        // console.log("PARENT:" + parent_id)
        const button = document.getElementById("toggle_comment_modal")
        button.click()
    }

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

    function handlePinPost(event) {
        const inputElement = document.getElementById("pin_post_id_input");
        inputElement.value = event.detail.post_id

        const button = document.getElementById("submit_pin_post_btn")
        button.click()
    }

    function handleUnpinPost(event) {
        const inputElement = document.getElementById("unpin_post_id_input");
        inputElement.value = event.detail.post_id

        const button = document.getElementById("submit_unpin_post_btn")
        button.click()
    }

    function handlePinComment(event) {
        const inputElement = document.getElementById("pin_comment_id_input");
        inputElement.value = event.detail.comment_id

        const button = document.getElementById("submit_pin_comment_btn")
        button.click()
    }

    function handleUnpinComment(event) {
        const inputElement = document.getElementById("unpin_comment_id_input");
        inputElement.value = event.detail.comment_id

        const button = document.getElementById("submit_unpin_comment_btn")
        button.click()
    }

</script>


<div class="flex-1 mt-1 pb-16">

    <Post postData={data.post} postType="post_page" {data} 
    on:save={handleSave} 
    on:likepost={handleLikePost}
    on:delete={handleDeletePost}
    on:pinpost={handlePinPost}
    on:unpinpost={handleUnpinPost}/>
    
    {#each pinned_comments as comment(comment.comment_id)}
        <Comment commentData={comment} commentType="post_page" {data}
        on:reply={handleClickReply} 
        on:likecomment={handleLikeComment}
        on:deletecomment={handleDeleteComment}
        on:pincomment={handlePinComment}
        on:unpincomment={handleUnpinComment}/>
    {/each}

    {#each comments as comment(comment.comment_id)}
        <Comment commentData={comment} commentType="post_page" {data}
        on:reply={handleClickReply} 
        on:likecomment={handleLikeComment}
        on:deletecomment={handleDeleteComment}
        on:pincomment={handlePinComment}
        on:unpincomment={handleUnpinComment}/>
    {/each}
    
</div>
<div class="bg-base-100 text-gray-500 w-[14.3rem] my-4 mr-4 rounded-lg py-2 hidden lg:block"></div>

<button class="fixed z-20 btn btn-primary bottom-6 right-6 text-white py-2 px-4 rounded-full shadow-md" on:click={handleAddComment}>
    Add a Comment
</button>
<label for="create_comment_modal" id="toggle_comment_modal" class="hidden"></label>
<!-- <label for="create_reply_modal" class="hidden" id="toggle_reply_modal"></label> -->
<CreateCommentModal modalId="create_comment_modal" {data} {form} {parent_comment}/>
<!-- <CreateCommentModal modalId="create_reply_modal" {data} {form} {parent_comment} /> -->

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

<form action="?/pin" method="POST">
    <input name="post_id" id="pin_post_id_input" class="hidden">
    <button type="submit" class="hidden" id="submit_pin_post_btn"></button>
</form>

<form action="?/unpin" method="POST">
    <input name="post_id" id="unpin_post_id_input" class="hidden">
    <button type="submit" class="hidden" id="submit_unpin_post_btn"></button>
</form>


<form action="?/pincomment" method="POST">
    <input name="comment_id" id="pin_comment_id_input" class="hidden">
    <button type="submit" class="hidden" id="submit_pin_comment_btn"></button>
</form>

<form action="?/unpincomment" method="POST">
    <input name="comment_id" id="unpin_comment_id_input" class="hidden">
    <button type="submit" class="hidden" id="submit_unpin_comment_btn"></button>
</form>