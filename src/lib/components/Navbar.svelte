<script>
	import Avatar from "./Avatar.svelte";

    export let data;

    let { user } = data
	$: ({ user } = data)

</script>

<div class="navbar absolute pt-1">
    <div class="navbar-start">
        <a class="btn btn-ghost normal-case text-xl font-serif mx-2 px-6" href="/">Klanon</a>
    </div>
    <div class="navbar-center"></div>
    <div class="navbar-end">
        {#if !data.session}
        <a class="btn btn-ghost" href="/login">Log In</a>
        {:else}
        <div class="dropdown dropdown-hover dropdown-end">
            <Avatar url={user.avatar_url} username={user.full_name}/>
            <ul class="dropdown-content p-2 menu shadow bg-base-200 rounded-box w-52">
                <p class="mx-4 my-2 font-bold">{user.username}</p>
                <div class="divider m-0"></div>
                <li><a>Account Settings</a></li>
                <form action="/logout" method="POST">
                    <li><button type="submit">Log Out</button></li>
                </form>
            </ul>
        </div>
        {/if}
    </div>
</div>
