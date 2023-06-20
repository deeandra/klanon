<script>
	import Post from "$lib/components/Post.svelte";
    import EditPostModal from "$lib/components/EditPostModal.svelte";

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

    let published_posts = []
    let draft_posts = []
    let pending_posts = []
    let posts

    $: {
        posts = data.posts
        published_posts = []
        draft_posts = []
        pending_posts = []
        for (let i=0; i<posts.length; i++) {
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

    

</script>


<div class="flex-1 mt-4">
    <div class="w-[95%] max-w-screen-lg rounded-lg mx-auto flex">
        <div class="tabs tabs-boxed tabs-secondary p-2 w-full">
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
    </div>
    
    <div class={published ? "" : "hidden"}>
        {#each published_posts as post(post.post_id)}
            <Post postData={post} postType="feed_page" {data}/>
        {/each}
    </div>

    <div class={drafts ? "" : "hidden"}>
        {#each draft_posts as post(post.post_id)}
            <Post postData={post} postType="draft" {data}/>
            <EditPostModal {post} {form}></EditPostModal>
        {/each}
    </div>

    <div class={pending ? "" : "hidden"}>
        {#each pending_posts as post(post.post_id)}
            <Post postData={post} postType="pending" {data}/>
        {/each}
    </div>
    
    
</div>
<div class="bg-base-100 text-gray-500 w-[14.3rem] my-4 mr-4 rounded-lg py-2 hidden lg:block"></div>

<style>
    .tab-active {
        background-color: hsl(var(--b1)) !important;
    }
</style>




