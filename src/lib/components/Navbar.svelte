<script>
	import Avatar from "./Avatar.svelte";
    import { page } from '$app/stores';

    export let data;

    let { user } = data
	$: ({ user } = data)
    console.log($page.route.id.startsWith('/me'))

</script>

<div class="navbar fixed pt-1 max-h-10 z-50 {$page.route.id.startsWith('/me') ? "bg-base-100" : ""}">
    <div class="navbar-start">
        <a class="btn btn-ghost normal-case text-xl font-serif mx-2 px-6" href="/">Klanon</a>
    </div>
    <div class="navbar-center"></div>
    <div class="navbar-end">
        {#if !data.session}
        <a class="btn btn-ghost" href="/login">Log In</a>
        {:else}
        <div class="dropdown dropdown-hover dropdown-end mr-3">
            <div class="w-10">
                <Avatar url={user.avatar_url} username={user.full_name} size="40" supabase={data.supabase}/>
            </div>
            
            <ul class="dropdown-content p-2 menu menu-xs shadow bg-base-200 rounded-box w-52">
                <p class="mx-4 my-2 font-bold">{user.username}</p>
                <div class="divider m-0"></div>
                <li><a data-sveltekit-reload href="/edit-profile">Edit Profile</a></li>
                <form action="/logout" method="POST">
                    <li><button type="submit">Log Out</button></li>
                </form>
            </ul>
        </div>
        {/if}
    </div>
</div>
