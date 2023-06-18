import { redirect } from '@sveltejs/kit';

/* eslint-disable no-unused-vars */
export const load = async ({ locals, params }) => {
    const session = await locals.getSession();
    if (!session) {
        throw redirect(303, "/")
    }
 
    const class_id = params.class_id
    console.log(class_id)

    let { data:posts, error:err1 } = await locals.supabase.rpc('get_class_posts', {
        current_class_id: class_id,
        session_user_id: session.user.id
    }). order('created_at', { ascending: false })
    
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
    

    // const { data:posts, error:err1 } = await locals.supabase
    //   .from('post')
    //   .select('id, user_id, class_id, title, content, created_at, is_pinned, pinned_at, users!post_user_id_fkey(id, full_name)')
    //   .eq('class_id', class_id)
    //   .eq('post_status', "published")
    //   .order('created_at', { ascending: false })
    
    // if (err1) {
    //     console.log(err1)
    // }

    const { data:thisClass, error:err2 } = await locals.supabase
      .from('class')
      .select('name, description, banner_url, user_class(role, display_name)')
      .eq('id', class_id)
      .eq('user_class.user_id', session.user.id)
      .single()
    
    if (err2) {
        console.log(err2)
    }

    // const { data:user_saves, error:err3 } = await locals.supabase
    //   .from('user_saved')
    //   .select('post_id, post(class_id)')
    //   .eq('user_id', session.user.id)
    //   .eq('post.class_id', class_id)
    
    // if (err3) {
    //     console.log(err3)
    // }

    // console.log(user_saves)


    return { thisClass, posts };
};