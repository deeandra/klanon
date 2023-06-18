<script>
    // import { onMount } from "svelte";

    // let editor;
        
    // export let toolbarOptions = [
    //     ["link"],
    //     ["bold", "italic", "underline", "strike"],
    //     [{ list: "ordered" }, { list: "bullet" }],
    // ];
        
    // onMount(async () => {
    //     const { default: Quill } = await import("quill");
        
    //     let quill = new Quill(editor, {
    //     modules: {
    //         toolbar: toolbarOptions
    //     },
    //     theme: "snow"
    //     });
    // });
</script>


<!-- <style>
    @import 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
    #editor-wrapper {

        
    }
    :global(.ql-toolbar) {
        margin-top: 0.7rem;
        border-radius: 0.5rem !important;
        border: 0 !important;
        background-color: hsl(var(--b2));
    }

    :global(.ql-toolbar .ql-stroke) {
        fill: none;
        stroke: hsl(var(--bc));
    }
    :global(.ql-toolbar .ql-fill) {
        fill: hsl(var(--bc));
        stroke: none;
    }

    :global(.ql-container) {
        background-color: hsl(var(--b2));
        margin-top: 0.5rem;
        border-radius: 0.5rem !important;
        border: 0 !important;
        color: hsl(var(--bc));
        height: 10rem;
    }

    :global(.ql-editor > p) {
        color: hsl(var(--bc)) !important;
        font-family: 'system-ui';
    }
</style> -->

<label for="create_post_modal" class="fixed z-20 btn btn-primary bottom-6 right-6 text-white py-2 px-4 rounded-full shadow-md">Create Post</label>

<input type="checkbox" id="create_post_modal" class="modal-toggle" />
<div class="modal modal-open">
  <div class="modal-box">
    <label for="create_post_modal" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
    <span class="">Posting on <strong>Pengantar Teknik Komputer</strong></span>
    <!-- <div id="editor-wrapper">
        <div bind:this={editor} />
    </div> -->
  </div>
</div>