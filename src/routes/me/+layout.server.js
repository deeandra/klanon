import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, route }) => {
    const session = await locals.getSession();
    if (!session) {
        throw redirect(303, "/")
    }
 
    const { data:user_classes, error:err } = await locals.supabase
      .from('user_class')
      .select('class_id, role, display_name, class(name, avatar_url)')
      .eq('user_id', session.user.id)
    
    if (err) {
        console.log(err)
    }

    // const { data:user_saves, error:err2 } = await locals.supabase
    //     .from('user_saved')
    //     .select('post_id')
    //     .eq('user_id', session.user.id)
    
    // if (err2) {
    //     console.log(err2)
    // }

    const currentRoute = route.id


    return { user_classes, currentRoute };
};
  
  