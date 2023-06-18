/* eslint-disable no-unused-vars */
/* eslint-disable no-empty */
import { redirect } from '@sveltejs/kit';

export async function POST({ request, locals }) {
    const session = await locals.getSession();
    const body = Object.fromEntries(await request.formData())

    const { data, error:err } = await locals.supabase.from('user_class')
        .insert({
            user_id: session.user.id, 
            class_id: body.class_id,
            role: 'student',
            display_name: body.display_name
        }).select()

    if (err) {
        console.log(err)
    }

    // if (err) {
    //     throw error(500, 'Something went wrong logging you out.')
    // }

    throw redirect(303, "/me")
}

/* eslint-disable no-unused-vars */
// export const actions = {
//     join: async ({ request, locals }) => {

//         // classId = get from class where invite_code = classInviteCode
//         const classId = 0

//         /* eslint-disable no-unused-vars */
//         const { data, error:err } = await locals.supabase.from('user_class').insert({user_id: locals.session.user.id, class_id: classId, role: 'student'}).select()

//         if (err) {
//             return fail(500, {
//                 message: 'Server error. Try again later.'
//             })
//         }

//         throw redirect(303, "/")
//     }
// };