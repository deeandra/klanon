<script>
    export let url
    export let username
    export let size

    // if (!size) {
    //     size = "40"
    // }

    let avatarUrl
    // let ava_url = "https://ehmizkpvugvqmffbnelh.supabase.co/storage/v1/object/public/klanon-storage/avatars/" + url.toString()

    let randomAvaUrl = "https://ui-avatars.com/api/?background=random&name=" + username?.replace(/\s+/g, '+')

</script>

<div>
	{#if url}
        <!-- <div class="w-[{size}] h-[{size}] mask mask-squircle bg-white flex-shrink-0">
            <img src={url} alt="Avatar" class="object-cover w-full h-full">
        </div>
         -->
        <img src={url} alt="Avatar" height={size} width={size} class="mask mask-squircle">
	{:else}
        <!-- <div class="w-[{size}] h-[{size}] mask mask-squircle bg-white flex-shrink-0">
            <img src={randomAvaUrl} alt="Avatar" class="max-w-full max-h-full">
        </div> -->
        <img src={randomAvaUrl} alt="Avatar" height={size} width={size} class="mask mask-squircle">
	{/if}
</div>