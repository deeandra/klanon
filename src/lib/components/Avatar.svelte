<script>
    export let url
    export let username
    export let size

    if (!size) {
        size = 8
    }

    let avatarUrl
    // let ava_url = "https://ehmizkpvugvqmffbnelh.supabase.co/storage/v1/object/public/klanon-storage/avatars/" + url.toString()

    let randomAvaUrl = "https://ui-avatars.com/api/?background=random&name=" + username?.replace(/\s+/g, '+')

</script>

<div>
	{#if url}
        <div class="w-{size} h-{size} mask mask-squircle bg-transparent flex-shrink-0">
            <img src={url} alt="Avatar" class="w-{size} h-{size} mask mask-squircle">
        </div>
        
		<!-- <img
			src={avatarUrl}
			alt={avatarUrl ? 'Avatar' : 'No image'}
			class="avatar image"
			style="height: {size}em; width: {size}em;"
		/> -->
	{:else}
        <div class="w-{size} h-{size} mask mask-squircle bg-transparent flex-shrink-0">
            <img src={randomAvaUrl} alt="Avatar" class="w-{size} h-{size} mask mask-squircle">
        </div>
	{/if}
</div>