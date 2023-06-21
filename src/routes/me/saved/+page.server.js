import { redirect } from '@sveltejs/kit';

/* eslint-disable no-unused-vars */
export const load = async ({ locals, params }) => {
    const session = await locals.getSession();
    if (!session) {
        throw redirect(303, "/")
    }

    let { data:posts, error:err1 } = await locals.supabase.rpc('get_saved_posts', {
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