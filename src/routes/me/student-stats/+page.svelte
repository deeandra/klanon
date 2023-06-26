<script>
    import Avatar from "$lib/components/Avatar.svelte";
    export let data

    let selected

    let instructors = []
    let moderators = []
    let students = []

    $: {
        instructors = []
        moderators = []
        students = []
        for (let i=0; i<data.students.length; i++) {
            if (data.students[i].role == "instructor") {
                instructors.push(data.students[i])
            }
            else if (data.students[i].role == "moderator") {
                moderators.push(data.students[i])
            }
            else if (data.students[i].role == "student") {
                students.push(data.students[i])
            }
        }
        // console.log(students)
    }
</script>

<div class="flex-1 mt-3">
    <div class="bw-[95%] max-w-screen-lg mx-auto my-1 flex items-center justify-between pb-3 px-6">
        <select bind:value={selected} class="select w-full max-w-xs bg-base-300 z-50">
            <option disabled selected>Choose Classroom</option>
            {#each data.instructor_classes as classroom(classroom.class_id)}
                <option value={classroom.class_id}>{classroom.class.name}</option>
            {/each}
        </select>
    </div>

    {#if instructors.some(obj => obj.class_id == selected)}
    <div class="bw-[95%] max-w-screen-lg mx-auto my-1 flex items-center justify-between py-3 px-6">
        <div class="badge badge-secondary font-semibold">INSTRUCTORS</div>
    </div>
    {/if}

    {#each instructors as instructor(instructor.user_id+"_"+instructor.class_id)}
        {#if selected == instructor.class_id}
            <div class="bg-base-300 w-[95%] max-w-screen-lg rounded-lg mx-auto my-1 flex items-center justify-between py-3 px-6">
                <div class="flex items-center">
                    <div class="w-12">
                        <Avatar url={instructor.avatar_url} username={instructor.display_name} size="50" supabase={data.supabase}/>
                    </div>
                    <span class="p-3 ml-4 font-semibold text-lg truncate">{instructor.display_name}</span>
                    {#if data.session.user.id == instructor.user_id}
                        <div class="badge badge-accent badge-outline mr-4">You</div>
                    {/if}
                </div>
                <div class="flex">
                    <div class="text-center w-16" >
                        <i class="fa-solid fa-envelope fa-xl" ></i>
                        <div class="stat-value text-xl">{instructor.post_count + instructor.comment_count}</div>
                    </div>
                    <div class="text-center w-16" >
                        <i class="fa-solid fa-heart fa-xl"  style="color: #d1083b;"></i>
                        <div class="stat-value text-xl">{instructor.post_likes_count + instructor.comment_likes_count}</div>
                    </div>
                </div>
            </div>
        {/if}
    {/each}
    

    {#if moderators.some(obj => obj.class_id == selected)}
    <div class="bw-[95%] max-w-screen-lg mx-auto my-1 flex items-center justify-between py-3 px-6">
        <div class="badge badge-primary font-semibold">MODERATORS</div>
    </div>
    {/if}

    {#each moderators as moderator(moderator.user_id+"_"+moderator.class_id)}
        {#if selected == moderator.class_id}
            <div class="bg-base-300 w-[95%] max-w-screen-lg rounded-lg mx-auto my-1 flex items-center justify-between py-3 px-6">
                <div class="flex items-center">
                    <div class="w-12">
                        <Avatar url={moderator.avatar_url} username={moderator.display_name} size="50" supabase={data.supabase}/>
                    </div>
                    <span class="p-3 ml-4 font-semibold text-lg truncate">{moderator.display_name}</span>
                    {#if data.session.user.id == moderator.user_id}
                        <div class="badge badge-accent badge-outline mr-4">You</div>
                    {/if}
                </div>
                <div class="flex">
                    <div class="text-center w-16" >
                        <i class="fa-solid fa-envelope fa-xl" ></i>
                        <div class="stat-value text-xl">{moderator.post_count + moderator.comment_count}</div>
                    </div>
                    <div class="text-center w-16" >
                        <i class="fa-solid fa-heart fa-xl"  style="color: #d1083b;"></i>
                        <div class="stat-value text-xl">{moderator.post_likes_count + moderator.comment_likes_count}</div>
                    </div>
                </div>
            </div>
        {/if}
    {/each}


    {#if students.some(obj => obj.class_id == selected)}
    <div class="bw-[95%] max-w-screen-lg mx-auto my-1 flex items-center justify-between py-3 px-6">
        <div class="badge badge-accent font-semibold">STUDENTS</div>
    </div>
    {/if}

    {#each students as student(student.user_id+"_"+student.class_id)}
        {#if selected == student.class_id}
            <div class="bg-base-300 w-[95%] max-w-screen-lg rounded-lg mx-auto my-1 flex items-center justify-between py-3 px-6">
                <div class="flex items-center">
                    <div class="w-12">
                        <Avatar url={student.avatar_url} username={student.display_name} size="50" supabase={data.supabase}/>
                    </div>
                    <span class="p-3 ml-4 font-semibold text-lg truncate">{student.display_name}</span>
                    {#if data.session.user.id == student.user_id}
                        <div class="badge badge-accent badge-outline mr-4">You</div>
                    {/if}
                </div>
                <div class="flex">
                    <div class="text-center w-16" >
                        <i class="fa-solid fa-envelope fa-xl" ></i>
                        <div class="stat-value text-xl">{student.post_count + student.comment_count}</div>
                    </div>
                    <div class="text-center w-16" >
                        <i class="fa-solid fa-heart fa-xl"  style="color: #d1083b;"></i>
                        <div class="stat-value text-xl">{student.post_likes_count + student.comment_likes_count}</div>
                    </div>
                </div>
            </div>
        {/if}
    {/each}
</div>