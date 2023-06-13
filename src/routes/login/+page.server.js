import { AuthApiError } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals: { getSession } }) => {
    const session = await getSession();
    if (session) {
        throw redirect(303, "/me")
    }
};

/** @type {import('./$types').Actions} */
export const actions = {
    login: async ({ request, locals }) => {
        const body = Object.fromEntries(await request.formData())

        /* eslint-disable no-unused-vars */
        const { data, error:err } = await locals.supabase.auth.signInWithPassword({
            email: body.email,
            password: body.password
        })

        if (err) {
            if (err instanceof AuthApiError && err.status === 400) {
                return {failed: true, message: "Invalid email or password."}
            }
            return {failed: true, message: 'Server error. Try again later.'}
        }

        throw redirect(303, "/c")
    }
};