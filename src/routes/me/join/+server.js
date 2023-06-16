import { fail, redirect } from '@sveltejs/kit';

/* eslint-disable no-unused-vars */
export const actions = {
    join: async ({ request, locals }) => {

        // classId = get from class where invite_code = classInviteCode
        const classId = 0

        /* eslint-disable no-unused-vars */
        const { data, error:err } = await locals.supabase.from('user_class').insert({user_id: locals.session.user.id, class_id: classId, role: 'student'}).select()

        if (err) {
            return fail(500, {
                message: 'Server error. Try again later.'
            })
        }

        throw redirect(303, "/")
    }
};