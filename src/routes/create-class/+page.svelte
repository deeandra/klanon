<div class="h-full flex items-center justify-center">
    <div class="w-96 p-6 shadow-lg bg-neutral rounded-[40px] max-w-[90%]">
        <h1 class="text-2xl font-extrabold block text-center text-neutral-content">New Classroom</h1>
        <form action="?/create" method="POST">
            <div class="w-full mb-3 mt-8 relative">
                <input type="text" placeholder="Class Name" name="name" class="input w-full pl-4" />
            </div>
            <div class="w-full mb-3 mt-3 relative">
                <textarea class="textarea w-full" placeholder="Description" name="description"></textarea>
            </div>
            <button type="submit" class="btn btn-primary mt-3 mb-3 w-full">Create As Instructor</button>
            <!-- <button type="submit" class="btn btn-secondary mb-3 w-full">Create As Student</button> -->
        </form>
    </div>
</div>