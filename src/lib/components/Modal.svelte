<script>
    export let modalId;
</script>

<!-- <dialog id={modalId} class="modal">
  <form method="dialog" class="modal-box">
    <h3 class="font-bold text-lg">Hello!</h3>
    <p class="py-4">Press ESC key or click on ✕ button to close</p>
    <slot></slot>
  </form>
</dialog> -->

<!-- Put this part before </body> tag -->
<input type="checkbox" id={modalId} class="modal-toggle" />
<div class="modal">
  <div class="modal-box">
    <label for={modalId} class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
    <slot></slot>
  </div>
</div>