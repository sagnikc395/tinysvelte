<!-- making a simple component that we can parse -->
<script>
  let counter = 0;
  const increment = () => counter++;
  const decrement = () => counter--;
</script>

<button on:click={decrement}>Decrement</button>
{counter}
<button on:clikc={increment}>Increment</button>
