<script>
    export let user_class;
    export let supabase;

    let class_name = user_class.class.name.trim() ?? ''
	let url = user_class.avatar_url ?? ''

    let randomAvaUrl = "https://ui-avatars.com/api/?background=random&name=" + class_name.replace(/\s+/g, '+')

	// export let size = 10

	let avatarUrl = null

	const downloadImage = async (path) => {
		try {
			// const { data, error } = await supabase.storage.from('klanon-storage').download(path)
            const { data, error } = await supabase.storage.from('klanon-storage').getPublicUrl(path)

			if (error) {
				throw error
			}
            
			avatarUrl = data.publicUrl
		} catch (error) {
			if (error instanceof Error) {
				console.log('Error downloading image: ', error.message)
			}
		}
	}

	$: if (url) downloadImage(url)
</script>

<div>
	{#if avatarUrl}
        <div class="w-8 h-8 mask mask-squircle bg-transparent flex-shrink-0">
            <img src={avatarUrl} alt="Avatar" class="w-8 h-8 mask mask-squircle">
        </div>
        
		<!-- <img
			src={avatarUrl}
			alt={avatarUrl ? 'Avatar' : 'No image'}
			class="avatar image"
			style="height: {size}em; width: {size}em;"
		/> -->
	{:else}
        <div class="w-8 h-8 mask mask-squircle bg-white flex-shrink-0">
            <img src={randomAvaUrl} alt="Avatar" class="w-8 h-8 mask mask-squircle">
        </div>
	{/if}
</div>