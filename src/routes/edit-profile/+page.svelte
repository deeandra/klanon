<script>
    import CenterLogoNavbar from '$lib/components/CenterLogoNavbar.svelte'
    import Avatar from '$lib/components/Avatar.svelte';

    export let data
    let supabase
    $: supabase = data.supabase

    let avatar_url

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

            avatar_url = filePath
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

</script>

<!-- <CenterLogoNavbar/> -->

<div class="h-screen bg-base-100 flex items-center justify-center lg:justify-start w-full relative bg-image" style="background-image: url('library (1).jpg');background-size: cover;background-position: center;">
    <div class="w-96 p-6 shadow-lg bg-base-200 rounded-lg max-w-[90%] min-w-[24rem] z-10">
        <h1 class="text-2xl font-bold block text-center text-base-content">Edit Profile</h1>
        <form action="?/editprofile" method="POST">
            <div class="w-full flex justify-center">
                <div class="w-48 m-5 flex justify-center">
                        <Avatar url={avatar_url ? avatar_url : data.user.avatar_url} username={data.user.full_name} size="180" supabase={data.supabase}></Avatar>
                </div>
            </div>
            <div class="w-full text-center">
                <label class="btn btn-outline" for="single">
                    {uploading ? 'Uploading ...' : 'Upload avatar'}
                </label>
            </div>

            <input type="file" id="single" accept="image/*" class="hidden" bind:files
            on:change="{uploadAvatar}"
            disabled="{uploading}" />

            <input type="text" name="avatar_url" class="hidden" value={avatar_url}>

            <div class="w-full mb-3 mt-6 relative">
                <i class="fa-solid fa-user absolute pointer-events-none top-1/2 -translate-y-1/2 left-5"></i>
                <input placeholder="Full Name" name="full_name" class="input w-full pl-12" value={data.user.full_name}/>
            </div>
            <div class="w-full mb-3 mt-3 relative">
                <i class="fa-solid fa-at absolute pointer-events-none top-1/2 -translate-y-1/2 left-5"></i>
                <input placeholder="Username" name="username" class="input w-full pl-12" value={data.user.username}/>
            </div>
            <button class="btn btn-accent mb-3 mt-3 w-full">Save Changes</button>
        </form>
    </div>
</div>

<style>
    .bg-image::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
    }
</style>