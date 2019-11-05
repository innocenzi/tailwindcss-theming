<template>
  <main
    role="main"
    class="flex items-center flex-1 bg-background text-on-background transition-all"
  >
    <div class="container mx-auto flex flex-col justify-center items-center p-6 rounded text-on-surface bg-surface border-b-2 border-brand shadow-lg">
      <div class="w-20 flex justify-around mb-4 pb-3 border-on-surface-slightly-visible border-b">
        <button @click="theme()"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="adjust" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M8 256c0 136.966 111.033 248 248 248s248-111.034 248-248S392.966 8 256 8 8 119.033 8 256zm248 184V72c101.705 0 184 82.311 184 184 0 101.705-82.311 184-184 184z"></path></svg></button>
        <button @click="theme('light')"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sun" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 160c-52.9 0-96 43.1-96 96s43.1 96 96 96 96-43.1 96-96-43.1-96-96-96zm246.4 80.5l-94.7-47.3 33.5-100.4c4.5-13.6-8.4-26.5-21.9-21.9l-100.4 33.5-47.4-94.8c-6.4-12.8-24.6-12.8-31 0l-47.3 94.7L92.7 70.8c-13.6-4.5-26.5 8.4-21.9 21.9l33.5 100.4-94.7 47.4c-12.8 6.4-12.8 24.6 0 31l94.7 47.3-33.5 100.5c-4.5 13.6 8.4 26.5 21.9 21.9l100.4-33.5 47.3 94.7c6.4 12.8 24.6 12.8 31 0l47.3-94.7 100.4 33.5c13.6 4.5 26.5-8.4 21.9-21.9l-33.5-100.4 94.7-47.3c13-6.5 13-24.7.2-31.1zm-155.9 106c-49.9 49.9-131.1 49.9-181 0-49.9-49.9-49.9-131.1 0-181 49.9-49.9 131.1-49.9 181 0 49.9 49.9 49.9 131.1 0 181z"></path></svg></button>
        <button @click="theme('dark')"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="moon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M283.211 512c78.962 0 151.079-35.925 198.857-94.792 7.068-8.708-.639-21.43-11.562-19.35-124.203 23.654-238.262-71.576-238.262-196.954 0-72.222 38.662-138.635 101.498-174.394 9.686-5.512 7.25-20.197-3.756-22.23A258.156 258.156 0 0 0 283.211 0c-141.309 0-256 114.511-256 256 0 141.309 114.511 256 256 256z"></path></svg></button>
      </div>

      <div class="flex flex-col justify-center items-center">
        <div class="mb-6 text-on-surface-muted text-center cursor-dynamic content">
          This text is underlined only in light mode, thanks to a CSS custom property in the theme. <br/>
          The cursor changes as well, with a Tailwind utility class though.
        </div>
        <span class="example bg-error text-on-error">Background error</span>
        <span class="example bg-surface text-error">Foreground error</span>
        <span class="example bg-info text-on-info">Background info</span>
        <span class="example bg-surface text-info">Foreground info</span>
        <span class="example bg-warning text-on-warning">Background warning</span>
        <span class="example bg-surface text-warning">Foreground warning</span>
        <span class="example bg-success text-on-success">Background success</span>
        <span class="example bg-surface text-success">Foreground success</span>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import Vue from "vue";
import theming from "../theme.config.js";

export default Vue.extend({
  name: "app",
  data: () => ({
    themes: ["light", "dark"]
  }),
  methods: {
    /**
     * The export strategy is `class`, so changing theme is as simple as
     * removing or adding a theme's name as a class.
     */
    theme(name?: string) {
      document.body.classList.remove(...this.themes);
      if (name) {
        document.body.classList.add(name);
      }
    }
  }
});
</script>

<style lang="postcss" scoped>
button {
  @apply h-4 w-4 text-on-surface-medium-emphasis transition-all;

  &:hover {
    @apply text-on-surface;
  }
}

.example {
  @apply px-2 py-1 my-1 rounded-lg transition-all;
}

.content {
  text-decoration: var(--decoration);
}
</style>
