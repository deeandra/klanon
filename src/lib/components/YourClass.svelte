<script>
    import ClassIcon from "$lib/components/ClassIcon.svelte";
    import Avatar from "$lib/components/Avatar.svelte";

    export let user_class
    export let supabase

    let url = "/me/c/" + user_class.class_id
</script>

<li>
    <a href={url} class={user_class.styles}>
        <!-- <div class="w-8 h-8 mask mask-squircle bg-white flex-shrink-0">
            <img src="/education.jpg" alt="User 1 Avatar" class="w-8 h-8 rounded-full">
        </div> -->
        <!-- <ClassIcon {user_class} {supabase} /> -->
        <div class="flex max-w-full w-full items-center">
        <div class="w-11 flex-shrink-0 mr-2">
            <Avatar url={user_class.class.avatar_url} username={user_class.class.name} {supabase} size="40"></Avatar>
        </div>
        <span class="truncate">{user_class.class.name}</span>
    </div>
    </a>
</li>
<!-- <li>
    <a href="#" class="flex items-center">
        <div class="indicator">
            <span class="indicator-item badge badge-secondary p-[0.3rem] h-[0.3rem] top-[0.1rem] right-[0.1rem]"></span>
            <div class="w-8 h-8 mask mask-squircle bg-white flex-shrink-0">
                <minidenticon-svg username="ptkom"></minidenticon-svg>
            </div>
        </div>
        <span class="truncate">Pengantar Teknik Komputer</span>
    </a>
</li> -->

<style>
    li > a > div > .truncate:hover {
        text-overflow: clip;
        white-space: normal;
    }
</style>