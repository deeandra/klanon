import { error, redirect } from '@sveltejs/kit'

/** @type {import('./$types').RequestHandler} */
export async function POST({ locals }) {
    // const session = await locals.getSession();
    // if (!session) {
    //     throw redirect(303, "/login")
    // }

    const {error: err} = await locals.supabase.auth.signOut()

    if (err) {
        throw error(500, 'Something went wrong logging you out.')
    }

    throw redirect(303, '/')
}