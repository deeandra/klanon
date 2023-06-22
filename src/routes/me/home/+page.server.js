import { redirect } from '@sveltejs/kit';

/* eslint-disable no-unused-vars */
export const load = async ({ locals, params }) => {
    const session = await locals.getSession();
    if (!session) {
        throw redirect(303, "/")
    }

    const { data:user_classes_ids, error:err } = await locals.supabase
      .from('user_class')
      .select('class_id, role, class(name, avatar_url)')
      .eq('user_id', session.user.id)
    
    if (err) {
        console.log(err)
    }

    const user_class_ids = user_classes_ids.map(obj => obj.class_id)

    // const { data:posts, error:err1 } = await locals.supabase
    //   .from('post')
    //   .select('id, user_id, class_id, title, content, created_at, is_pinned, pinned_at, users!post_user_id_fkey(id, full_name), class!post_class_id_fkey(name)')
    //   .in('class_id', user_class_ids)
    //   .eq('post_status', "published")
    //   .order('created_at', { ascending: false })

    let { data:posts, error:err1 } = await locals.supabase.rpc('get_home_posts', {
        user_class_ids: user_class_ids,
        session_user_id: session.user.id
    }). order('updated_at', { ascending: false })
    
    if (err1) {
        console.log(err1)
    }
    else if(posts){ 
        for (let i=0; i<posts?.length; i++) {
            if(posts[i].op_id != session.user.id) {
                posts[i].op_id = ""
            }
            
            if (posts[i].op_anon_status != 'none') {
                if(posts[i].op_anon_status == 'partial') {
                    const {data: user_role, error:err_role} = await locals.supabase
                        .from('user_class')
                        .select('role')
                        .eq('user_id', session.user.id)
                        .eq('class_id', posts[i].class_id)
                    if (err_role) {
                        console.log(err_role)
                    }

                    if (user_role[0].role == "instructor" || posts[i].op_id == session.user.id) {
                        posts[i].author_name = posts[i].op_display_name
                        console.log(posts[i].author_name)
                    }
                }
                posts[i].op_display_name = posts[i].op_pseudonym
                posts[i].op_avatar_url = ""
            }
        }
    }

    console.log(posts)

    return { posts };
};

export const actions = {
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

        const { error:err2 } = await locals.supabase.from('comment')
            .update({is_deleted: true})
            .eq('post_id', body.post_id)


        if (err2) {
            console.log(err2)
        }


        return
        
    },
    
    likepost: async ({request, locals}) => {
        const session = await locals.getSession();

        const body = Object.fromEntries(await request.formData())

        let { error:err } = await locals.supabase.rpc('add_or_delete_post_like', {
            session_user_id: session.user.id,
            current_post_id: body.post_id
        })
        
        if (err) {
            console.log(err)
        }
        
    },

    save: async ({request, locals}) => {
        const session = await locals.getSession();

        const body = Object.fromEntries(await request.formData())

        let { error:err } = await locals.supabase.rpc('add_or_delete_user_saved', {
            session_user_id: session.user.id,
            current_post_id: body.post_id
        })
        
        if (err) {
            console.log(err)
        }
        
    },
}