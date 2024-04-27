<template lang="pug">
.eg-file-input.eg-section.d-flex.align-center.justify-center(
  :class="[{ 'is-dragover': dragover }, internal.length > 0 ? activeClass : '']",
  @click="onClick",
  @dragleave.prevent="dragover = false",
  @dragover.prevent="dragover = true",
  @drop.prevent="onDrop"
)
  input(
    ref="inputFile",
    :accept="accept",
    :disabled="disabled",
    :multiple="multiple",
    @change="onInputChange",
    type="file",
    style="display: none"
  )
  slot(v-if="$slots.default", :files="internal")
  .eg-file-input__content(v-else, @drop.prevent)
    v-icon.el-icon-upload mdi-cloud-upload
    .is-text {{ message }}
      br
      em haga click aquí
</template>
<script lang="ts">
import {
  defineComponent,
  inject,
  PropType,
  ref,
  watch,
  Ref,
  InjectionKey,
} from "@nuxtjs/composition-api";

export interface IFileInput {
  clear: () => void;
  clearPicker: () => void;
  nativeClick: () => void;

  setInternal(val: ModelValue): void;
  getModel(multiple?: boolean): ModelValue;
  deleteFile(idx: number): void;
  modifyFile(val: File, idx: number): void;
  insertFile(val: File, idx: number): void;
  insertFiles(val: File[], idx: number): void;
}

interface Linked {
  items: Ref<unknown[]>;
  mut?: (val: File) => unknown;
}

export type ModelValue = File | File[] | undefined;

type IKey = InjectionKey<Ref<File[]>>;
export const INTERNAL_KEY: IKey = Symbol("file-input.internal");

export type MIType = (val: File[], dragged: boolean) => void;
type MIKey = InjectionKey<MIType>;
export const MUTATE_INTERNAL_KEY: MIKey = Symbol("file-input.mutate_internal");

type LKey = InjectionKey<Linked>;
export const LINKED_KEY: LKey = Symbol("file-input.linked");

export default defineComponent({
  name: "file-input",
  props: {
    value: Object as PropType<ModelValue>,
    activeClass: { type: String, default: "is-not-empty" },
    accept: { type: String, default: "image/*" },
    multiple: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    message: { type: String, default: "Suelte un archivo o" },
  },

  emits: ["input", "update:loading", "change"],
  setup(props, { emit }) {
    // SECTION Internal values.

    const internal = inject(INTERNAL_KEY, ref([]));
    const mutateInternal = inject(MUTATE_INTERNAL_KEY, (value) => {
      if (internal.value !== value) {
        internal.value = value;

        const _value = getModel();
        emit("input", _value);
        emit("change", _value);
      }
    });

    watch(
      () => props.value,
      (value) => {
        if (internal.value !== value) {
          setInternal(value);
          emit("change", getModel());
        }
      },
    );

    // !SECTION

    function setInternal(value: ModelValue) {
      const _value = !value ? [] : Array.isArray(value) ? value : [value];

      internal.value = _value;

      if (linked) {
        const mut = linked.mut;
        const muted = mut ? _value.map((x) => mut(x)) : _value;
        linked.items.value = muted;
      }
    }

    function getModel(multiple?: boolean): ModelValue {
      if (multiple ?? props.multiple) {
        return internal.value;
      }

      if (internal.value.length > 0) {
        return internal.value[0];
      }

      return undefined;
    }

    const linked = inject(LINKED_KEY, undefined);
    const inputFile = ref<HTMLInputElement>();
    const dragover = ref(false);

    function clear() {
      const nativePicker = inputFile.value;
      if (nativePicker) {
        mutateInternal([], false);
        nativePicker.value = "";
      }
    }

    function clearPicker() {
      const nativePicker = inputFile.value;
      if (nativePicker) {
        nativePicker.value = "";
      }
    }

    function nativeClick() {
      inputFile.value?.click();
    }

    function onClick() {
      if (internal.value.length === 0) {
        inputFile.value?.click();
      }
    }

    function onInputChange(e: Event) {
      if (e.target !== null) {
        const et = e.target as HTMLInputElement;
        if (et.files !== null && et.files.length > 0) {
          mutateInternal(Array.from(et.files), false);
        }
      }
    }

    function onDrop(e: DragEvent) {
      const edt = e.dataTransfer;
      if (edt && edt.files.length > 0) {
        mutateInternal(Array.from(edt.files), true);
      }
      dragover.value = false;
    }

    return {
      dragover,
      inputFile,
      internal,
      nativeClick,
      onClick,
      onDrop,
      onInputChange,
      clear,
      clearPicker,
      setInternal,
      getModel,

      deleteFile(idx: number) {
        if (linked && internal.value.length === linked.items.value.length) {
          linked.items.value.splice(idx, 1);
        }

        internal.value.splice(idx, 1);
      },
      modifyFile(val: File, idx: number) {
        if (linked && internal.value.length === linked.items.value.length) {
          linked.items.value[idx] = linked.mut ? linked.mut(val) : val;
        }

        internal.value[idx] = val;
      },
      insertFile(val: File, idx: number) {
        if (linked && internal.value.length === linked.items.value.length) {
          linked.items.value.splice(idx, 0, linked.mut ? linked.mut(val) : val);
        }

        internal.value.splice(idx, 0, val);
      },
      insertFiles(val: File[], idx: number) {
        if (linked && internal.value.length === linked.items.value.length) {
          const mut = linked.mut;
          const muted = mut ? val.map((x) => mut(x)) : val;
          linked.items.value.splice(idx, 0, ...muted);
        }

        internal.value.splice(idx, 0, ...val);
      },
    };
  },
});
</script>
