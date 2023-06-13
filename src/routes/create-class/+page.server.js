import { fail, redirect } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
    create: async ({ request, locals }) => {
        const body = Object.fromEntries(await request.formData())

        /* eslint-disable no-unused-vars */
        const { data, error:err } = await locals.supabase.from('class').insert({name: body.name, description: body.description}).select()

        if (err) {
            return fail(500, {
                message: 'Server error. Try again later.'
            })
        }

        throw redirect(303, "/")
    }
};