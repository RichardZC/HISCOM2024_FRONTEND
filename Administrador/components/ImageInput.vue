<template lang="pug">
file-input(
  ref="fileInput",
  :class="[{ 'is-float': float, 'is-multiple': multiple }]",
  :disabled="disabled",
  :multiple="multiple && modifyIndex < 0",
  :style="{ 'margin-left: 200px;': float }",
  v-bind="$attrs"
)
  template(v-if="internalSrc.length > 0", v-slot)
    .eg-image-input__content
      img.eg-image(
        ref="elImage",
        :src="internalSrc[0]",
        contain,
        max-height=300
      )
      .flex-column-ca.hover-container(@click.stop)
        v-tooltip(right)
          template(v-slot:activator="{ on, attrs }")
            v-icon.mb-2(
              v-on="on",
              v-bind="attrs",
              :disabled="disableView",
              @click.stop="preview = true",
              color="#79E372",
              style="width: fit-content"
            ) mdi-eye
          span Ver
        v-tooltip(right)
          template(v-slot:activator="{ on, attrs }")
            v-icon.mb-2(
              v-on="on",
              v-bind="attrs",
              :disabled="disableEdit",
              @click.stop="multiple ? modifySome(0) : fileInput.nativeClick()",
              color="#7CBAFB",
              style="width: fit-content"
            ) mdi-pencil
          span Editar
        v-tooltip(right)
          template(v-slot:activator="{ on, attrs }")
            v-icon(
              v-if="!noDelete",
              v-on="on",
              v-bind="attrs",
              :disabled="disableDelete",
              @click.stop="multiple ? deleteSome(0) : mutateInternal([], false)",
              color="#FC9374",
              style="width: fit-content"
            ) mdi-delete
          span Eliminar
    v-overlay(z-index=400, :value="preview")
      v-img(:src="internalSrc[0]", v-click-outside="closePreview")
    .eg-image-input__multiple.text-center(
      v-if="multiple && (firstPick || internalSrc.length > 1)"
    )
      template(v-for="n in internalSrc.length - 1")
        .eg-section(:key="n")
          img(:src="internalSrc[n]")
          .hover-container
            v-btn(
              @click="modifySome(n)",
              circle,
              icon="el-icon-edit",
              type="primary"
            )
            v-btn(
              @click="deleteSome(n)",
              circle,
              icon="el-icon-delete",
              type="danger"
            )
      .eg-section(@click="insertSome(internal.length)")
        v-icon.el-icon-circle-plus-outline mdi-plus-circle-outline
</template>

<script lang="ts">
import {
  PropType,
  Ref,
  defineComponent,
  nextTick,
  provide,
  ref,
  watch,
  onMounted,
} from "@nuxtjs/composition-api";

import {
  IFileInput,
  INTERNAL_KEY,
  MUTATE_INTERNAL_KEY,
  ModelValue,
  MIType,
  LINKED_KEY,
} from "~/components/FileInput.vue";
import { toBase64 } from "~/utils/base64";

export default defineComponent({
  name: "eg-image-input",
  props: {
    value: [String] as PropType<string | undefined>,

    formProp: { type: String, default: "image" },
    disabled: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
    float: { type: Boolean, default: false },

    noDelete: { type: Boolean, default: false },
    disableView: { type: Boolean, default: false },
    disableEdit: { type: Boolean, default: false },
    disableDelete: { type: Boolean, default: false },
  },
  emits: ["input", "change"],
  setup(props, { emit }) {
    // SECTION Internal value.

    const internal = ref<File[]>([]);
    const mutateInternal: MIType = (value, dragged?) => {
      if (props.multiple) {
        if (deleteIndex >= 0) {
          fileInput.value.deleteFile(deleteIndex);
          deleteIndex = -1;
        } else if (insertIndex >= 0) {
          fileInput.value.insertFiles(value, insertIndex);
          insertIndex = -1;
        } else if (modifyIndex.value >= 0) {
          fileInput.value.modifyFile(value[0], modifyIndex.value);
          modifyIndex.value = -1;
        } else if (!firstPick.value || internal.value.length === 0) {
          internal.value = value;
          internalSrc.value = value.map((x) => URL.createObjectURL(x));
        } else if (dragged) {
          fileInput.value.insertFiles(value, internal.value.length);
        }
      } else {
        internal.value = value;
        internalSrc.value =
          value.length > 0 ? [URL.createObjectURL(value[0])] : [];
      }

      const _value = fileInput.value.getModel(props.multiple);
      modelValueFlag = true;
      if (_value instanceof File) {
        toBase64(_value).then((b64) => {
          emit("input", b64);
          emit("change", b64);
        });
      } else if (Array.isArray(_value) && _value.length > 0) {
        toBase64(_value[0]).then((b64) => {
          emit("input", b64);
          emit("change", b64);
        });
      } else {
        emit("input", null);
        emit("change", null);
      }

      if (!firstPick.value) {
        firstPick.value = true;
      }

      fileInput.value.clearPicker();
    };

    provide(INTERNAL_KEY, internal);
    provide(MUTATE_INTERNAL_KEY, mutateInternal);

    watch(
      () => props.value,
      (value) => {
        if (modelValueFlag) {
          modelValueFlag = false;
        } else if (typeof value === "string") {
          replaceSrc(value);
        } else if (internal.value !== value) {
          const _value = value as ModelValue;

          fileInput.value.setInternal(_value);
          emit("change", value);
        }
      },
    );

    // !SECTION

    const fileInput = ref<IFileInput>() as Ref<IFileInput>;

    let modelValueFlag = false;

    function replaceSrc(value: string) {
      const tempFile = new File([], "n.tmp");

      if (internalSrc.value.length > 0) {
        internal.value[0] = tempFile;
        internalSrc.value[0] = value;
      } else {
        internal.value.push(tempFile);
        internalSrc.value.push(value);
      }

      modelValueFlag = true;
      emit("input", null);

      if (!firstPick.value) {
        firstPick.value = true;
      }
    }

    const firstPick = ref(false);
    const internalSrc = ref<string[]>([]);

    onMounted(() => {
      if (typeof props.value === "string") {
        replaceSrc(props.value);
      }
    });

    const multipleInput = ref<HTMLInputElement>() as Ref<HTMLInputElement>;

    let deleteIndex = -1;
    let insertIndex = -1;
    const modifyIndex = ref(-1);

    provide(LINKED_KEY, {
      items: internalSrc,
      mut: (val) => URL.createObjectURL(val),
    });

    const preview = ref(false);

    return {
      fileInput,
      firstPick,
      internal,
      internalSrc,
      modifyIndex,
      multipleInput,
      mutateInternal,
      preview,

      closePreview() {
        preview.value = false;
      },

      deleteSome(idx: number) {
        deleteIndex = idx;
        mutateInternal([], false);
      },
      insertSome(idx: number) {
        insertIndex = idx;
        nextTick(() => fileInput.value.nativeClick());
      },
      modifySome(idx: number) {
        modifyIndex.value = idx;
        nextTick(() => fileInput.value.nativeClick());
      },
    };
  },
});
</script>
