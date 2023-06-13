<script>
    export let data

</script>

<div class="navbar bg-base-100 absolute">
    <div class="navbar-start">
      <!-- <div class="dropdown">
        <label tabindex="0" class="btn btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
        </label>
        <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow-xl bg-neutral text-neutral-content rounded-box w-52">
          <li><a href="/stories">Your Account</a></li>
          <li tabindex="0">
            <a class="justify-between">
              Parent
              <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/></svg>
            </a>
            <ul class="p-2">
              <li><a>Submenu 1</a></li>
              <li><a>Submenu 2</a></li>
            </ul>
          </li>
          {#if data.session}
          <form action="/logout" method="POST">
            <li><button type="submit">Log Out</button></li>
          </form>
          {/if}
        </ul>
      </div> -->
      <a class="btn btn-ghost normal-case text-xl font-serif" href="/">Klanon</a>
    </div>
    <div class="navbar-end">
    {#if !data.session}
      <a class="btn btn-ghost" href="/login">Log In</a>
    <!-- {:else}
      <p class="px-3">Welcome back!</p> -->
    {/if}
  </div>
</div>
<div class="min-h-full bg-base-100 flex items-center justify-center">
    <div class="hero-content text-center text-base-content flex-col justify-center pt-16">
        <!-- <img src="/education.jpg" alt="" class="rounded-full max-w-[50%] pb-3"> -->
        <div class="max-w-md px-10">
            <h1 class="mb-5 text-4xl md:text-5xl font-bold font-serif">Welcome to Klanon!</h1>
            <p class="mb-5 text-xl">Online class discussion board where you can participate anonymously.</p>
            {#if !data.session}
                <a href="/signup">
                    <button class="btn btn-neutral m-2">Create an Account</button>
                </a>
            {:else}
                <a href="/me">
                    <button class="btn btn-neutral m-2">Open Klanon</button>
                </a>
            {/if}
        </div>
    </div>
</div>
