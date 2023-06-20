import { redirect } from '@sveltejs/kit';

/* eslint-disable no-unused-vars */
export const load = async ({ locals, params }) => {
    const session = await locals.getSession();
    if (!session) {
        throw redirect(303, "/")
    }

    const { data:user_classes_ids, error:err } = await locals.supabase
      .from('user_class')
      .select('class_id')
      .eq('user_id', session.user.id)
      .in('role', ['instructor', 'moderator'])
    
    if (err) {
        console.log(err)
    }

    const user_class_ids = user_classes_ids.map(obj => obj.class_id)

    let { data:posts, error:err1 } = await locals.supabase.rpc('get_waitlist', {
        user_class_ids: user_class_ids,
        session_user_id: session.user.id
    }). order('created_at', { ascending: false })
    
    if (err1) {
        console.log(err1)
    }
    else if(posts){ 
        for (let i=0; i<posts?.length; i++) {
            posts[i].op_id = ""
            
            if (posts[i].op_anon_status != 'none') {
                posts[i].op_display_name = posts[i].op_pseudonym
                posts[i].op_avatar_url = ""
            }
        }
    }

    console.log(posts)

    return { posts };
};

export const actions = {
    approve: async ({request, locals}) => {
        const session = await locals.getSession();

        const body = Object.fromEntries(await request.formData())

        const { data:post, error:err1 } = await locals.supabase.from('post')
            .update({post_status: "published"})
            .eq('id', body.post_id)
            .select().single()

        console.log(post)

        if (err1) {
            console.log(err1)
        }
        
    },
    delete: async ({request, locals}) => {
        const session = await locals.getSession();

        const body = Object.fromEntries(await request.formData())

        const { error:err1 } = await locals.supabase.from('post')
            .update({is_deleted: true})
            .eq('id', body.post_id)
            .select().single()


        if (err1) {
            console.log(err1)
        }

        return
        
    },
};