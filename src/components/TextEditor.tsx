import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import Image from "@tiptap/extension-image";
import { useEffect, useState } from "react";
import { Popover, Button, TextInput } from "@mantine/core";
import Placeholder from "@tiptap/extension-placeholder";

import { IconPhoto } from "@tabler/icons-react";
import { ActionIcon } from "@mantine/core";

type TextEditorProps = {
  onGetContent: (content: string | undefined) => void;
  oldContent?: string;
};

export default function TextEditor({
  onGetContent,
  oldContent,
}: TextEditorProps) {
  const [content, setContent] = useState<string | undefined>(``);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Edit description here." }),
    ],
    content,
    onCreate({ editor }) {
      console.log("oldContent", oldContent);
      if (oldContent) editor.commands.setContent(oldContent);
      else editor.commands.setContent("<p></p>");
    },
    onUpdate({ editor }) {
      setContent(editor.getHTML());
    },
  });

  useEffect(() => {
    onGetContent(content);
  }, [editor, onGetContent, content]);

  function handleClickAddImage() {
    const url = window.prompt("Enter image URL");
    if (!url) return;
    editor?.chain().focus().setImage({ src: url }).run();
  }

  return (
    <>
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar sticky stickyOffset={60}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
            <RichTextEditor.Code />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Subscript />
            <RichTextEditor.Superscript />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignJustify />
            <RichTextEditor.AlignRight />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <ActionIcon
              size="sm"
              variant="outline"
              onClick={handleClickAddImage}>
              <IconPhoto size="1rem" />
            </ActionIcon>
            {/* <Popover arrowPosition="center" position="bottom" zIndex={10000}>
              <Popover.Target>
                <ActionIcon
                  size="sm"
                  variant="outline"
                  onClick={handleClickAddImage}>
                  <IconPhoto size="1rem" />
                </ActionIcon>
              </Popover.Target>
              <Popover.Dropdown
                sx={(theme) => ({
                  background:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[7]
                      : theme.white,
                })}>
                <TextInput  placeholder="url image" size="xs" />
              </Popover.Dropdown>
            </Popover> */}
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content />
      </RichTextEditor>
    </>
  );
}
