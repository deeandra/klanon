<script>
	import Post from "$lib/components/Post.svelte";
    import Modal from "$lib/components/Modal.svelte";
	import CreatePostModal from "$lib/components/CreatePostModal.svelte";
    import { page } from '$app/stores';
	import Avatar from "$lib/components/Avatar.svelte";

    import { createEventDispatcher } from 'svelte'
    
    export let data
    export let form

    let supabase = data.supabase
    $: supabase = data.supabase
    
    let class_avatar_url

    let uploading = false
    let files


    const uploadAvatar = async () => {
        try {
            uploading = true

            if (!files || files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const file = files[0]
            const fileExt = file.name.split('.').pop()
            const filePath = `${Math.random()}.${fileExt}`

            let { error } = await supabase.storage.from('klanon-storage').upload(filePath, file)

            if (error) {
                console.log(error)
                throw error
            }

            class_avatar_url = filePath
            console.log("class ava "+class_avatar_url)
        } 
        catch (error) {
            if (error instanceof Error) {
                alert(error.message)
            }
        } 
        finally {
            uploading = false
        }
    }

    function compareMembers(a, b) {
        if (a.user_id == data.session.user.id) {
            return -1
        }
        if (b.user_id == data.session.user.id) {
            return 1
        }

        const roleOrder = {
            "instructor": 0,
            "moderator": 1,
            "student": 2,
        }
        const roleComparison = roleOrder[a.role] - roleOrder[b.role]
        if (roleComparison !== 0) {
            return roleComparison
        }

        return a.display_name.localeCompare(b.display_name)
    }

    let member_id_to_change_role
    let change_role_selected
    let member_name_to_change_role

    function changeRole(member) {
        member_id_to_change_role = member.user_id
        change_role_selected = member.role
        member_name_to_change_role = member.display_name

        const button = document.getElementById("label_change_role_modal")
        button.click()
    }

    let role = data.thisClass.user_class[0].role

    $: role = data.thisClass.user_class[0].role

    $: console.log(role)
    // console.log(data.thisClass.user_class[0].role)
    let pinned_posts = []
    let posts = []

    $: {
        posts = []
        pinned_posts = []
        for (let i=0; i<data.posts.length; i++) {
            if (data.posts[i].is_pinned) {
                pinned_posts.push(data.posts[i])
            }
            else {
                posts.push(data.posts[i])
            }
        }
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


    // let member_name_to_remove
    // let member_id_to_remove
    // function handleRemoveMember(member) {
    //     member_id_to_remove = member.user_id
    //     member_name_to_remove = member.display_name

    //     const checkbox = document.getElementById("remove_member_modal")
    //     checkbox.checked = true
    // }

    // function handleCancelRemoveMember() {
    //     member_id_to_remove = ""
    //     member_name_to_remove = ""

    //     const checkbox = document.getElementById("remove_member_modal")
    //     checkbox.checked = false
    // }

    // function handleConfirmRemoveMember() {
    //     const button = document.getElementById("submit_remove_member_btn")
    // }
</script>


<div class="flex-1 mt-4 bg-base-100">
    <div class="bg-base-200 w-[95%] max-w-screen-lg rounded-lg mx-auto flex flex-col">
        <!-- <div class="w-full h-20 bg-cyan-600 rounded-t-lg"></div> -->
        <div class="pl-6 pr-5 py-3 flex justify-between text-lg font-bold">
            <span class="truncate">
                {data.thisClass.name}
            </span>
            <div class="inline right-0">
                {#if data.thisClass.description}
                    <div class="tooltip tooltip-left" data-tip={data.thisClass.description}>
                        <label class="btn-ghost btn-tiny rounded-lg p-1"><i class="fa-solid fa-circle-info fa-sm mx-1"></i></label>
                    </div>
                {/if}
                <label class="btn-ghost btn-tiny rounded-lg p-1"><i class="fa-solid fa-user-group fa-sm mx-1"></i></label>
                {#if role != "student"}
                    <label for="edit_class_modal" class="btn-ghost btn-tiny rounded-lg p-1"><i class="fa-solid fa-gear fa-sm mx-1"></i></label>
                {/if}
            </div>
        </div>
    </div>

    {#each pinned_posts as post(post.post_id)}
        <Post postData={post} postType="class_page" {data} 
        on:save={handleSave} 
        on:likepost={handleLikePost}
        on:delete={handleDeletePost}
        on:pinpost={handlePinPost}
        on:unpinpost={handleUnpinPost}/>
    {/each}

    {#each posts as post(post.post_id)}
        <Post postData={post} postType="class_page" {data} 
        on:save={handleSave} 
        on:likepost={handleLikePost}
        on:delete={handleDeletePost}
        on:pinpost={handlePinPost}
        on:unpinpost={handleUnpinPost}/>
    {/each}
    
</div>
<div class="bg-base-100 text-gray-500 w-[14.3rem] py-6 pr-4 rounded-lg hidden lg:block"></div>

<label for="create_post_modal" class="fixed z-20 btn btn-primary bottom-6 right-6 text-white py-2 px-4 rounded-full shadow-md">Create Post</label>
<CreatePostModal {data} {form}/>

<style>
    .truncate:hover {
        text-overflow: clip;
        white-space: normal;
    }
</style>

<form action="?/likepost" method="POST">
    <input name="post_id" id="like_post_id_input" class="hidden">
    <button type="submit" class="hidden" id="submit_like_post_btn"></button>
</form>

<form action="?/save" method="POST">
    <input name="post_id" id="save_id_input" class="hidden">
    <button type="submit" class="hidden" id="submit_save_btn"></button>
</form>

<Modal modalId="class_members_modal" style="">
    <h3 class="font-bold text-lg mb-4">Class Members</h3> 
    <div class="w-full">
    {#each data.members.sort(compareMembers) as member(member.user_id)}
    <div class="w-full flex items-center justify-between">
        <div class="flex items-center my-3 w-full">
            <div class="w-10 mr-4">
                <Avatar url={member.users.avatar_url} username={member.display_name} supabase={data.supabase}></Avatar>
            </div>
            <div class="flex items-center">
                <div class="truncate max-w-[14rem] mr-2">
                    {member.display_name}
                </div>
                {#if member.role != "student"}
                    <div class="badge badge-primary ml-2">{member.role}</div>
                {/if}
                {#if member.user_id == data.session.user.id}
                    <div class="badge badge-accent badge-outline ml-2">You</div>
                {/if}
            </div>
        </div>
        <div>
            <div class="dropdown dropdown-bottom dropdown-end">
                <label tabindex="0" class="btn btn-ghost btn-xs">
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                </label>
                <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-300 rounded-box w-52">
                    {#if member.user_id == data.session.user.id}
                        <li><label for="change_display_name_modal">Change Display Name</label></li>
                    {/if}
                    {#if data.thisClass.user_class[0].role == "instructor"}
                        <li><label on:click={()=>changeRole(member)}>Change Role</label></li>
                    {/if}
                    <!-- {#if data.thisClass.user_class[0].role != "student"}
                        <li><label for="remove_member_modal">Remove</label></li>
                    {/if} -->
                </ul>
              </div>
        </div>
    </div>
    {/each}
    </div>
</Modal>

<Modal modalId="change_display_name_modal" >
    <form action="?/changedisplayname" method="POST">
        <div class="badge badge-accent badge-outline uppercase font-semibold mb-3">{data.thisClass.name}</div>
        <h3 class="font-bold text-lg mb-3">Change Display Name</h3>

        <input name="display_name" type="text" placeholder="Type here" class="input bg-base-200 w-full" value={data.thisClass.user_class[0].display_name} />

        <div class="modal-action">
            <button class="btn">Save</button>
        </div>
    </form>
</Modal>

<!-- {#if data.thisClass.user_class[0].role != "student"}
<Modal modalId="remove_member_modal" >
    <div class="badge badge-accent badge-outline uppercase font-semibold mb-3">{data.thisClass.name}</div>
    <p class="mb-3">Are you sure you want to remove {member_name_to_remove} from this class?</p>

    <div class="modal-action">
        <button class="btn btn-primary" on:click={handleCancelRemoveMember}>Cancel</button>
        <button class="btn" on:click={handleRemoveMember}>Remove</button>
    </div>
</Modal>

<form action="?/removemember" method="POST">
    <input name="user_id" id="remove_member_id_input" class="hidden">
    <button type="submit" class="hidden" id="submit_remove_member_btn"></button>
</form>
{/if} -->

{#if data.thisClass.user_class[0].role == "instructor"}
<label for="change_role_modal" id="label_change_role_modal"></label>
<Modal modalId="change_role_modal">
    <form action="?/changedisplayname" method="POST">
        <div class="badge badge-accent badge-outline uppercase font-semibold mb-3">{data.thisClass.name}</div>
        <h3 class="font-bold text-lg mb-2">Change Role</h3>
        <p class="mb-2 ml-1">for {member_name_to_change_role}</p>

        <select bind:value={change_role_selected} class="select w-full max-w-xs bg-base-200">
            <option value="instructor">Instructor</option>
            <option value="moderator">Moderator</option>
            <option value="student">Student</option>
        </select>

        <div class="modal-action">
            <button class="btn">Save</button>
        </div>
    </form>
</Modal>
{/if}

{#if data.thisClass.user_class[0].role != "student"}
<Modal modalId="edit_class_modal">
    <h3 class="font-bold text-2xl">Edit Class</h3> 
    <form action="?/editclass" method="POST">
        <div class="form-control w-full">
            <div class="w-full flex flex-col justify-between items-center mb-1">
                <div class="w-48 flex justify-center">
                    <Avatar url={class_avatar_url ? class_avatar_url : data.thisClass.avatar_url} username={data.thisClass.name} size="130" supabase={data.supabase}></Avatar>
                </div>
                <div class="w-full text-center">
                    <label class="btn btn-outline" for="single">
                        {uploading ? 'Uploading ...' : 'Upload avatar'}
                    </label>
                </div>
            </div>

            <input type="file" id="single" accept="image/*" class="hidden" bind:files
            on:change="{uploadAvatar}"
            disabled="{uploading}" />
            <input type="text" name="avatar_url" class="hidden" value={class_avatar_url}>

            
            <label class="label">
                <span class="label-text">Class Name</span>
            </label>
            <input name="name" type="text" placeholder="Type here" class="input bg-base-200 w-full" value={data.thisClass.name} />

            <label class="label mt-1">
                <span class="label-text">Invitation Code
                </span>
            </label>
            <input name="invitation_code" type="text" placeholder="Type here" class="input bg-base-200  w-full" value={data.thisClass.invitation_code} />

            <label class="label mt-1">
                <span class="label-text">Invitation Password
                </span>
            </label>
            <input name="invitation_password" type="text" placeholder="Type here" class="input bg-base-200  w-full" value={data.thisClass.invitation_password} />

            <label class="label mt-1">
                <span class="label-text">Description</span>
            </label>
            <textarea name="description" class="textarea bg-base-200 w-full text-base" placeholder="Type Here" value={data.thisClass.description}></textarea>
            
            <input name="class_id" value={data.thisClass.id} class="hidden">
            
            <div class="flex justify-between items-center mt-4 mb-2">
                <div class="flex flex-col">
                    <span class="label-text mt-3 ml-1">
                        Enable Automatic Moderation System
                    </span> 
                    <input type="checkbox" class="toggle my-2 ml-1" checked />
                </div>
                <button type="submit" class="btn w-32 mt-3">Save</button>
            </div>
            
            <!-- <div class="modal-action">
                <button type="submit" class="btn">Save</button>
            </div> -->
        </div>
    </form>
</Modal>
{/if}

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

<form action="?/pin" method="POST">
    <input name="post_id" id="pin_post_id_input" class="hidden">
    <button type="submit" class="hidden" id="submit_pin_post_btn"></button>
</form>

<form action="?/unpin" method="POST">
    <input name="post_id" id="unpin_post_id_input" class="hidden">
    <button type="submit" class="hidden" id="submit_unpin_post_btn"></button>
</form>