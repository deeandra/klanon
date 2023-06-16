import { fail, redirect } from '@sveltejs/kit'

export async function POST({ request, locals }) {
    const body = Object.fromEntries(await request.formData())

    /* eslint-disable no-unused-vars */
    const { data, error:err } = await locals.supabase.from('class')
        .insert({
            name: body.name, 
            description: body.description,
            invitation_code: body.invitation_code,
            invitation_password: body.invitation_password
        }).select()

    if (err) {
        return fail(500, {
            message: 'Server error. Try again later.'
        })
    }

    // if (err) {
    //     throw error(500, 'Something went wrong logging you out.')
    // }

    throw redirect(303, "/me")
}