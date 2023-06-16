<script>
    export let url;
    export let name;
    export let avatar;
</script>

<li>
    <a href="#">
        <div class="w-8 h-8 mask mask-squircle bg-white flex-shrink-0">
            <img src="/education.jpg" alt="User 1 Avatar" class="w-8 h-8 rounded-full">
        </div>
        <span class="truncate">Calculus 101</span>
    </a>
</li>
<li>
    <a href="#" class="flex items-center">
        <div class="indicator">
            <span class="indicator-item badge badge-secondary p-[0.3rem] h-[0.3rem] top-[0.1rem] right-[0.1rem]"></span>
            <div class="w-8 h-8 mask mask-squircle bg-white flex-shrink-0">
                <minidenticon-svg username="ptkom"></minidenticon-svg>
            </div>
        </div>
        <span class="truncate">Pengantar Teknik Komputer</span>
    </a>
</li>

<style>
    li > a > .truncate:hover {
        text-overflow: clip;
        white-space: normal;
    }
</style>