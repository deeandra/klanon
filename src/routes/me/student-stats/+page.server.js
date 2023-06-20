import { redirect } from '@sveltejs/kit';

/* eslint-disable no-unused-vars */
export const load = async ({ locals, params }) => {
    const session = await locals.getSession();
    if (!session) {
        throw redirect(303, "/")
    }

    const { data:instructor_classes, error:err } = await locals.supabase
      .from('user_class')
      .select('class_id, class(name)')
      .eq('user_id', session.user.id)
      .eq('role', 'instructor')
    
    if (err) {
        console.log(err)
    }

    const class_ids = instructor_classes.map(obj => obj.class_id)


    let { data:students, error:err1 } = await locals.supabase.rpc('get_student_stats', {
        class_ids: class_ids
    }).order('display_name', { ascending: true })
    
    if (err1) {
        console.log(err1)
    }

    console.log(students)
    
    return { students, instructor_classes };
};