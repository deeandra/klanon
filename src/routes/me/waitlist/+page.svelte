<script>
	import Post from "$lib/components/Post.svelte";

    export let data;

</script>


<div class="flex-1 mt-1">

    {#each data.posts as post(post.post_id)}
        <Post postData={post} postType="pending" {data}/>
    {/each}
    
</div>
<div class="bg-base-100 text-gray-500 w-[14.3rem] my-4 mr-4 rounded-lg py-2 hidden lg:block"></div>

