<script>
    export let url
    export let username
    export let size
    export let supabase

    let public_url
    let useRandom = false

    $: {
        if(url) {
            const { data } = supabase
                .storage
                .from('klanon-storage')
                .getPublicUrl(url)
            public_url = data
        }
    }
    // const { data:public_url } = supabase
    //     .storage
    //     .from('klanon-storage')
    //     .getPublicUrl(url)
    // console.log("url"+url)
    
    // $:console.log(public_url)

    // if (!size) {
    //     size = "40"
    // }

    let avatarUrl
    // let ava_url = "https://ehmizkpvugvqmffbnelh.supabase.co/storage/v1/object/public/klanon-storage/avatars/" + url.toString()

    let randomAvaUrl = "https://ui-avatars.com/api/?background=random&name=" + username?.replace(/\s+/g, '+')

    function handleError() {
        useRandom = true
    }

</script>

<div>
	{#if url && !useRandom}
        <!-- <div class="w-[{size}] h-[{size}] mask mask-squircle bg-white flex-shrink-0">
            <img src={url} alt="Avatar" class="object-cover w-full h-full">
        </div>
         -->
         <!-- <div class="h-[{size}px] w-[{size}px] overflow-hidden flex">
        <img src={public_url.publicUrl} on:error={handleError} alt="Avatar" class="object-cover">
        </div> -->
        <img src={public_url.publicUrl} alt="Avatar" height={size} width={size} on:error={handleError} class="mask mask-squircle min-h-[{size}px]">
         <!-- <div class="mask mask-squircle">
        <div class="mask mask-squircle h-[{size}px] w-[{size}px]" style="background-image: url('{public_url.publicUrl}');background-repeat:no-repeat;background-size:cover;background-position: center;"></div> -->

	{:else}
        <!-- <div class="w-[{size}] h-[{size}] mask mask-squircle bg-white flex-shrink-0">
            <img src={randomAvaUrl} alt="Avatar" class="max-w-full max-h-full">
        </div> -->
        <img src={randomAvaUrl} alt="Avatar" height={size} width={size} class="mask mask-squircle min-h-[{size}px]">
        <!-- <div class="h-[{size}px] w-[{size}px]" style="background-image:url('{randomAvaUrl}');background-repeat:no-repeat;background-size:cover;"></div> -->
        <!-- <div class="mask mask-squircle">
            <div class=" h-[{size}px] w-[{size}px]" style="background-image: url('{public_url.publicUrl}');background-repeat:no-repeat;background-size:cover;background-position: center;"></div>
        </div> -->
	{/if}
</div>