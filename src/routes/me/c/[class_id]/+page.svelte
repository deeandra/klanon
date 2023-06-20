<script>
	import Post from "$lib/components/Post.svelte";
	import CreatePostModal from "$lib/components/CreatePostModal.svelte";
    import { page } from '$app/stores';

    export let data
    export let form

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
                    <div class="tooltip tooltip-bottom" data-tip={data.thisClass.description}>
                        <label class="btn-ghost btn-tiny rounded-lg p-1"><i class="fa-solid fa-circle-info fa-sm mx-1"></i></label>
                    </div>
                {/if}
                <label class="btn-ghost btn-tiny rounded-lg p-1 lg:hidden"><i class="fa-solid fa-user-group fa-sm mx-1"></i></label>
                {#if role != "student"}
                    <label class="btn-ghost btn-tiny rounded-lg p-1"><i class="fa-solid fa-gear fa-sm mx-1"></i></label>
                {/if}
            </div>
        </div>
    </div>

    {#each pinned_posts as post(post.post_id)}
        <Post postData={post} postType="class_page" {data}/>
    {/each}

    {#each posts as post(post.post_id)}
        <Post postData={post} postType="class_page" {data}/>
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