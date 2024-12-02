import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold";
import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic";
import DecoupledEditorBase from "@ckeditor/ckeditor5-editor-decoupled/src/decouplededitor";
import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";
import Font from "@ckeditor/ckeditor5-font/src/font";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph";

class DecoupledEditor extends DecoupledEditorBase {}

DecoupledEditor.builtinPlugins = [Essentials, Paragraph, Bold, Italic, Font];

DecoupledEditor.defaultConfig = {
  toolbar: {
    items: [
      "bold",
      "italic",
      "fontColor",
      "fontBackgroundColor",
      "|",
      "undo",
      "redo",
    ],
  },
};

export default DecoupledEditor;
